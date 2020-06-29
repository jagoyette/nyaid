using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NYAidWebApp.DataContext;
using NYAidWebApp.Interfaces;
using NYAidWebApp.Models;
using NYAidWebApp.Services;

namespace NYAidWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly ILogger _log;
        private readonly ApiDataContext _context;
        private readonly IUserService _userService;

        public RequestController(ILoggerFactory loggerFactory, ApiDataContext context, IUserService userService)
        {
            _log = loggerFactory.CreateLogger<RequestController>();
            _context = context;
            _userService = userService;
        }

        // GET: api/request
        // Returns all open requests by default
        // Query parameters may be used to filter the response data
        //   creatorUid={uid}  => returns only requests created by user
        //   assignedUid={uid} => returns only requests assigned to user
        //   state={state}     => returns only request in given state
        [HttpGet]
        public async Task<IEnumerable<Request>> Get(string creatorUid, string assignedUid, string stateFilter)
        {
            // By default, return all requests
            bool shouldFilterByState = !string.IsNullOrEmpty(stateFilter);
            RequestState state = RequestState.Open;
            if (!string.IsNullOrEmpty(stateFilter))
            {
                _log.LogDebug($"Adding state filter: {stateFilter}");
                if (!Enum.TryParse(stateFilter, ignoreCase: true, out state))
                {
                    if (stateFilter == "all")
                    {
                        _log.LogInformation("Bypassing state filter and returning all requests");
                        shouldFilterByState = false;
                    }
                }
            }

            _log.LogInformation($"Retrieving all requests using filters (creatorUid: {creatorUid}, assignedUid: {assignedUid}");
            return await _context.Requests
                .Where(r => !shouldFilterByState || r.State == state)
                .Where(r => string.IsNullOrEmpty(creatorUid) || r.CreatorUid == creatorUid)
                .Where(r => string.IsNullOrEmpty(assignedUid) || r.AssignedUid == assignedUid)
                .OrderByDescending(r => r.Created)
                .ToArrayAsync();
        }

        // GET: api/request/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<Request> Get(string id)
        {
            _log.LogInformation($"retrieving request id {id}");
            return await _context.Requests
                .FirstOrDefaultAsync(r => r.RequestId == id);
        }

        // POST: api/request
        [HttpPost]
        public async Task<Request> Post([FromBody] NewRequestInfo requestInfo)
        {
            _log.LogInformation("Creating a new request...");

            var user = _userService.CreateUserInfoFromClaims(User);
            if (user == null)
            {
                _log.LogError("Failed to obtain current user info");
                throw new HttpRequestException("Failed to obtain current user info");
            }

            // Create a new Request object and add it to data store
            var id = _context.CreateUniqueId();
            var request = new Request()
            {
                RequestId = id,
                CreatorUid = user.Uid,
                Created = DateTime.Now,
                Name = requestInfo.Name,
                Location = requestInfo.Location,
                Phone = requestInfo.Phone,
                Description = requestInfo.Description
            };

            _log.LogInformation($"Creating new request with id: {request.RequestId} for user: {request.CreatorUid}");
            
            // Add it to the data store
            await _context.AddAsync(request);
            await _context.SaveChangesAsync();
            return request;
        }

        // PUT: api/request/5
        [HttpPut("{id}")]
        public async Task<Request> Put(string id, [FromBody] NewRequestInfo requestInfo)
        {
            var request = await _context.Requests
                .FirstAsync(r => r.RequestId == id);

            // Retrieve current user info
            var user = _userService.CreateUserInfoFromClaims(User);
            if (user == null)
            {
                _log.LogError("Failed to obtain current user info");
                throw new HttpRequestException("Failed to obtain current user info");
            }

            // Make sure current user matched creator Uid
            if (request.CreatorUid != user.Uid)
            {
                _log.LogError($"Current user is not the owner of request id: {request.RequestId}");
                throw new HttpRequestException($"Current user is not the owner of request id: { request.RequestId }");
            }

            request.Name = requestInfo.Name;
            request.Location = requestInfo.Location;
            request.Phone = requestInfo.Phone;
            request.Description = requestInfo.Description;

            _context.Requests.Update(request);
            await _context.SaveChangesAsync();
            return request;
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            var request = await _context.Requests
                .FirstAsync(r => r.RequestId == id);


            // Retrieve current user info
            var user = _userService.CreateUserInfoFromClaims(User);
            if (user == null)
            {
                _log.LogError("Failed to obtain current user info");
                throw new HttpRequestException("Failed to obtain current user info");
            }

            // Make sure current user matched creator Uid
            if (request.CreatorUid != user.Uid)
            {
                _log.LogError($"Current user is not the owner of request id: {request.RequestId}");
                throw new HttpRequestException($"Current user is not the owner of request id: { request.RequestId }");
            }

            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
        }

        [HttpPost("{id}/close")]
        public async Task<Request> CloseRequest(string id)
        {
            var request = await _context.Requests
                .FirstAsync(r => r.RequestId == id);

            // Retrieve current user info
            var user = _userService.CreateUserInfoFromClaims(User);
            if (user == null)
            {
                _log.LogError("Failed to obtain current user info");
                throw new HttpRequestException("Failed to obtain current user info");
            }

            // Make sure current user matched creator Uid
            if (request.CreatorUid != user.Uid)
            {
                _log.LogError($"Current user is not the owner of request id: {request.RequestId}");
                throw new HttpRequestException($"Current user is not the owner of request id: { request.RequestId }");
            }

            // Mark this request as closed
            request.State = RequestState.Closed;
            _context.Requests.Update(request);

            // Make sure any offers that are still open ('submitted') are updated to
            // reflect the closed request
            var offers = _context.Offers.Where(o => o.RequestId == id && o.State == OfferState.Submitted);
            await offers.ForEachAsync(o =>
            {
                o.State = OfferState.Rejected;
                o.AcceptRejectReason = "This request has been closed";
            });

            await _context.SaveChangesAsync();
            return request;
        }
    }
}
