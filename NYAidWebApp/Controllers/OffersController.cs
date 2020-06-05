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

        [HttpGet]
        public async Task<IEnumerable<Offer>> Get(string requestId)
        {
            // return all offers for the given request
            return await _context.Offers
                .Where(o => o.RequestId == requestId)
                .ToArrayAsync();
        }

        [HttpGet]
        [Route("/api/request/offers/myoffers")]
        public async Task<IEnumerable<Offer>> GetMyOffers()
        {
            var user = this._userService.CreateUserInfoFromClaims(User);

            _log.LogInformation($"Returning offers for user with id {user.Uid}");

            // return the requested offer
            return await _context.Offers
                .Where(o => o.VolunteerUid == user.Uid)
                .ToArrayAsync();
        }

        [HttpGet]
        [Route("{offerId}")]
        public async Task<Offer> GetMyOffers(string requestId, string offerId)
        {
            _log.LogInformation($"Returning offer with id {offerId}");

            // return the requested offer
            return await _context.Offers
                .FirstOrDefaultAsync(o => o.OfferId == offerId);
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

            return offer.Notes.ToArray();
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