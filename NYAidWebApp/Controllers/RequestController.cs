using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NYAidWebApp.Models;

namespace NYAidWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        // GET: api/request
        // Returns all requests
        [HttpGet]
        public IEnumerable<Request> Get()
        {
            return new Request[]
            {
                new Request
                {
                    RequestId = "1",
                    Name = "Fred Flintstone",
                    Location = "Bedrock",
                    Phone = "555-555-5555",
                    Description = "I need someone to pick up a giant rack of ribs. It's heavy!"
                },
                new Request
                {
                    RequestId = "2",
                    Name = "Wile E. Coyote",
                    Location = "The Desert",
                    Phone = "444-444-4444",
                    Description = "I am in need of a large anvil. It must be heavy enough to stop a sneaky roadrunner."
                }
            };
        }

        // GET: api/request/5
        [HttpGet("{id}", Name = "Get")]
        public Request Get(int id)
        {
            return new Request
            {
                RequestId = "1",
                Name = "Fred Flintstone",
                Location = "Bedrock",
                Phone = "555-555-5555",
                Description = "I need someone to pick up a giant rack of ribs. It's heavy!"
            };
        }

        // POST: api/request
        [HttpPost]
        public void Post([FromBody] NewRequestInfo requestInfo)
        {
            // Not implemented
            throw new NotImplementedException();
        }

        // PUT: api/request/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] NewRequestInfo requestInfo)
        {
            // Not implemented
            throw new NotImplementedException();
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
