using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NYAidWebApp.DataContext;
using NYAidWebApp.Models;

namespace NYAidWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly ApiDataContext _context;

        public RequestController(ApiDataContext context)
        {
            _context = context;
        }

        // GET: api/request
        // Returns all requests by default
        // Query parameters may be used to filter the response data
        //   creatorUid={uid}  => returns only requests created by user
        //   assignedUid={uid} => returns only requests assigned to user
        [HttpGet]
        public async Task<IEnumerable<Request>> Get(string creatorUid, string assignedUid)
        {
            return await _context.Requests
                .Where(r => string.IsNullOrEmpty(creatorUid) || r.CreatorUid == creatorUid)
                .Where(r => string.IsNullOrEmpty(assignedUid) || r.AssignedUid == assignedUid)
                .ToArrayAsync();
        }

        // GET: api/request/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<Request> Get(string id)
        {
            return await _context.Requests
                .FirstOrDefaultAsync(r => r.RequestId == id);
        }

        // POST: api/request
        [HttpPost]
        public async Task<Request> Post([FromBody] NewRequestInfo requestInfo)
        {
            // Create a new Request object and add it to data store
            var id = _context.CreateUniqueId();
            var request = new Request()
            {
                RequestId = id,
                Name = requestInfo.Name,
                Location = requestInfo.Location,
                Phone = requestInfo.Phone,
                Description = requestInfo.Description
            };

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
            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
        }
    }
}
