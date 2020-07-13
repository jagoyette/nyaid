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
using NYAidWebApp.Interfaces;
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
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public OffersController(ILoggerFactory loggerFactory, ApiDataContext context, IUserService userService, INotificationService notificationService)
        {
            _log = loggerFactory.CreateLogger<RequestController>();
            _context = context;
            _userService = userService;
            _notificationService = notificationService;
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
            _log.LogInformation($"Retrieving offers with filters volunteerUid: {volunteerUid}, stateFilter: {stateFilter}");

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

            // retrieve matching offers
            _log.LogInformation($"Querying database for offers");
            var offers = await _context.Offers
                .Where(o => !shouldFilterByState || o.State == state)
                .Where(o => string.IsNullOrEmpty(volunteerUid) || o.VolunteerUid == volunteerUid)
                .OrderByDescending(o => o.Created)
                .ToListAsync();

            _log.LogInformation($"Retrieved {offers.Count} offers");
            if (includeRequest)
            { 
                _log.LogInformation($"Adding request detail to {offers.Count} offers");
                offers.ForEach(async o =>
                {
                    o.RequestDetail = await _context.Requests.FirstAsync(r => r.RequestId == o.RequestId);
                });
            }

            return offers;
        }

        // Returns all offers for given requestId
        // Query parameters may be used to filter the response data
        //   includeRequest      => if true, fills in the request detail for each offer
        [HttpGet]
        public async Task<IEnumerable<Offer>> Get(string requestId, bool includeRequest)
        {
            // return all offers for the given request
            _log.LogInformation($"Retrieving offers for request id {requestId}");
            var offers = await _context.Offers
                .Where(o => o.RequestId == requestId)
                .OrderByDescending(o => o.Created)
                .ToListAsync();

            if (includeRequest)
            {
                _log.LogInformation($"Adding request detail to {offers.Count} offers");
                offers.ForEach(async o =>
                {
                    o.RequestDetail = await _context.Requests.FirstAsync(r => r.RequestId == o.RequestId);
                });
            }

            return offers;
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
                _log.LogInformation($"Adding request detail");
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
            _log.LogInformation($"Finished updating database");

            // send new offer notification
            await _notificationService.SendNewOfferNotification(id);

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

            // Retrieve all offers for this request
            var allOffers = _context.Offers
                .Where(o => o.RequestId == requestId);

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

                _log.LogInformation($"Rejecting all other offers for request {requestId}");
                await allOffers.ForEachAsync(o =>
                {
                    // Reject all submitted offers except the one we are accepting
                    if (o.OfferId != offerId && o.State == OfferState.Submitted)
                    {
                        o.AcceptRejectReason = "Another offer was accepted.";
                        o.State = OfferState.Rejected;

                        // Send notification that this offer was rejected
                        _notificationService.SendOfferDeclinedNotification(o.OfferId);
                    }
                });
                _context.Offers.UpdateRange(allOffers);
            }

            _log.LogInformation("Updating database");
            await _context.SaveChangesAsync();
            _log.LogInformation($"Finished updating database");

            // Send notification to Offer owner about accepted/rejected state
            if (acceptRejectOffer.IsAccepted)
                await _notificationService.SendOfferAcceptedNotification(offerId);
            else
                await _notificationService.SendOfferDeclinedNotification(offerId);

            return offer;
        }

        [HttpGet]
        [Route("{offerId}/notes")]
        public async Task<IEnumerable<Note>> GetNotes(string requestId, string offerId)
        {
            _log.LogInformation($"Retrieving notes for offer {offerId}");

            // retrieve the offer offer
            var offer = await _context.Offers
                .FirstAsync(o => o.OfferId == offerId);

            return offer.Notes.OrderBy(n => n.Created).ToArray();
        }

        [HttpPost]
        [Route("{offerId}/notes")]
        public async Task<Note> CreateNote(string requestId, string offerId, [FromBody] string noteText)
        {
            _log.LogInformation($"Creating note for offer {offerId}");

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
            _log.LogInformation("Updating database");
            _context.Offers.Update(offer);
            await _context.SaveChangesAsync();
            _log.LogInformation($"Finished updating database");

            // return with the note
            return note;
        }

    }
}