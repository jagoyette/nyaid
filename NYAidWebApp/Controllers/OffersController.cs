using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using NYAidWebApp.DataContext;
using NYAidWebApp.Models;
using NYAidWebApp.Services;

namespace NYAidWebApp.Controllers
{
    [Route("api/request/{requestId}/offers")]
    [ApiController]
    [Authorize]
    public class OffersController : ControllerBase
    {
        private readonly ILogger _log;
        private readonly ApiDataContext _context;
        private readonly UserService _userService;

        public OffersController(ILoggerFactory loggerFactory, ApiDataContext context, UserService userService)
        {
            _log = loggerFactory.CreateLogger<RequestController>();
            _context = context;
            _userService = userService;

        }

        // Returns offers using supplied filters across all requests
        // Overrides the routing for the controller class because we don't
        // want to use a requestId in the path
        // Query parameters may be used to filter the response data
        //   volunteerUid={uid}  => returns only offers created by user
        //   state={state}       => returns only offers in given state
        //   includeRequest      => if true, fills in the request detail for each offer
        [HttpGet]
        [Route("/api/offers")]
        public async Task<IEnumerable<Offer>> GetOffers(string volunteerUid, string stateFilter, bool includeRequest)
        {
            _log.LogInformation($"Returning offers with filters volunteerUid: {volunteerUid}, stateFilter: {stateFilter}");

            // By default, return all offers
            bool shouldFilterByState = !string.IsNullOrEmpty(stateFilter);
            OfferState state = OfferState.Submitted;
            if (!string.IsNullOrEmpty(stateFilter))
            {
                _log.LogDebug($"Adding state filter: {stateFilter}");
                if (!Enum.TryParse(stateFilter, ignoreCase: true, out state))
                {
                    if (stateFilter == "all")
                    {
                        _log.LogInformation("Bypassing state filter and returning all offers");
                        shouldFilterByState = false;
                    }
                }
            }

            // return the requested offer
            var offers = _context.Offers
                .Where(o => !shouldFilterByState || o.State == state)
                .Where(o => string.IsNullOrEmpty(volunteerUid) || o.VolunteerUid == volunteerUid)
                .OrderByDescending(o => o.Created);

            if (includeRequest)
            {
                await offers.ForEachAsync(o =>
                {
                    o.RequestDetail = _context.Requests.First(r => r.RequestId == o.RequestId);
                });
            }

            return await offers.ToArrayAsync();
        }

        // Returns all offers for given requestId
        // Query parameters may be used to filter the response data
        //   includeRequest      => if true, fills in the request detail for each offer
        [HttpGet]
        public async Task<IEnumerable<Offer>> Get(string requestId, bool includeRequest)
        {
            // return all offers for the given request
            var offers = _context.Offers
                .Where(o => o.RequestId == requestId)
                .OrderByDescending(o => o.Created);

            if (includeRequest)
            {
                await offers.ForEachAsync(o =>
                {
                    o.RequestDetail = _context.Requests.First(r => r.RequestId == o.RequestId);
                });
            }

            return await offers.ToArrayAsync();
        }


        // returns single request identified by offerId
        // Query parameters may be used to filter the response data
        //   includeRequest      => if true, fills in the request detail for the offer
        [HttpGet]
        [Route("{offerId}")]
        public async Task<Offer> GetOffer(string requestId, string offerId, bool includeRequest)
        {
            _log.LogInformation($"Returning offer with id {offerId}");

            // return the requested offer
            var offer = await _context.Offers
                .FirstOrDefaultAsync(o => o.OfferId == offerId);

            if (includeRequest)
            {
                offer.RequestDetail = await _context.Requests.FirstOrDefaultAsync(r => r.RequestId == offer.RequestId);
            }

            return offer;
        }

        [HttpPost]
        public async Task<Offer> CreateOffer(string requestId, [FromBody] NewOffer newOffer)
        {
            _log.LogInformation($"Creating new offer for request {requestId}");

            var id = _context.CreateUniqueId();
            var offer = new Offer
            {
                OfferId = id,
                RequestId = requestId,
                VolunteerUid = newOffer.VolunteerUid,
                Description = newOffer.Description,
                Created = DateTime.Now,
                State = OfferState.Submitted
            };

            _log.LogInformation($"New offer created with id: {id}");

            await _context.AddAsync(offer);
            await _context.SaveChangesAsync();

            return offer;
        }

        [HttpPost]
        [Route("{offerId}/accept")]
        public async Task<Offer> AcceptOffer(string requestId, string offerId,
            [FromBody] AcceptRejectOffer acceptRejectOffer)
        {
            _log.LogInformation($"Accept / Reject API called for request {requestId} and offer {offerId}");

            // retrieve the offer
            var offer = await _context.Offers
                .FirstAsync(o => o.OfferId == offerId);

            // retrieve the request
            var request = await _context.Requests
                .FirstAsync(r => r.RequestId == offer.RequestId);

            // Verify that the current user owns this request
            var user = _userService.CreateUserInfoFromClaims(User);
            if (request.CreatorUid != user.Uid)
            {
                _log.LogError($"The current user {user.Name} is not the owner {request.CreatorUid} of this request.");
                throw new HttpRequestException(
                    $"The current user {user.Name} is not the owner {request.CreatorUid} of this request.");
            }

            _log.LogInformation($"Offer current state: {offer.State}");

            // Update offer state
            offer.State = acceptRejectOffer.IsAccepted ? OfferState.Accepted : OfferState.Rejected;
            offer.AcceptRejectReason = acceptRejectOffer.Reason;
            _context.Offers.Update(offer);

            // If the offer is accepted, also assign the volunteer to the request
            if (offer.State == OfferState.Accepted)
            {
                _log.LogInformation($"Offer accepted, assigning volunteer to request");
                request.AssignedUid = offer.VolunteerUid;
                request.State = RequestState.InProcess;
                _context.Requests.Update(request);
            }

            await _context.SaveChangesAsync();

            return offer;
        }

        [HttpGet]
        [Route("{offerId}/notes")]
        public async Task<IEnumerable<Note>> GetNotes(string requestId, string offerId)
        {
            // retrieve the offer offer
            var offer = await _context.Offers
                .FirstAsync(o => o.OfferId == offerId);

            return offer.Notes.OrderBy(n => n.Created).ToArray();
        }

        [HttpPost]
        [Route("{offerId}/notes")]
        public async Task<Note> CreateNote(string requestId, string offerId, [FromBody] string noteText)
        {
            // retrieve the offer offer
            var offer = await _context.Offers
                .FirstAsync(o => o.OfferId == offerId);

            // retrieve current user
            var user = _userService.CreateUserInfoFromClaims(User);

            // create the note
            var id = _context.CreateUniqueId();
            var note = new Note
            {
                NoteId = id,
                AuthorUid = user.Uid,
                Created = DateTime.Now,
                NoteText = noteText
            };

            // Add note to our note list
            offer.Notes = offer.Notes.Append(note).ToList();

            // save our changes
            _context.Offers.Update(offer);
            await _context.SaveChangesAsync();

            // return with the note
            return note;
        }

    }
}