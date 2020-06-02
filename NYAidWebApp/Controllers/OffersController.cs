using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
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
        [Route("{offerId}")]
        public async Task<Offer> GetOffer(string requestId, string offerId)
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
        public async Task<Offer> AcceptOffer(string requestId, string offerId, [FromBody] AcceptRejectOffer acceptRejectOffer)
        {
            _log.LogInformation($"Accept / Reject API called for request {requestId} and offer {offerId}");

            // retrieve the offer
            var offer = await _context.Offers
                .FirstOrDefaultAsync(o => o.OfferId == offerId);

            _log.LogInformation($"Offer current state: {offer.State}");

            // Update offer state
            offer.State = acceptRejectOffer.IsAccepted ? OfferState.Accepted : OfferState.Rejected;
            offer.AcceptRejectReason = acceptRejectOffer.Reason;
            _context.Offers.Update(offer);

            // If the offer is accepted, also assign the volunteer to the request
            if (offer.State == OfferState.Accepted)
            {
                _log.LogInformation($"Offer accepted, assigning volunteer to request");
                var request = await _context.Requests
                    .FirstOrDefaultAsync(r => r.RequestId == offer.RequestId);
                if (request != null)
                {
                    request.AssignedUid = offer.VolunteerUid;
                    request.State = RequestState.InProcess;
                    _context.Requests.Update(request);
                }
            }

            await _context.SaveChangesAsync();

            return offer;
        }

    }
}