using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NYAidWebApp.Models;

namespace NYAidWebApp.DataContext
{
    public class SampleDataSeeder
    {
        public void AddSampleData(ApiDataContext context)
        {
            var request1 = new Request
            {
                RequestId = "1",
                Name = "Fred Flintstone",
                Location = "Bedrock",
                Phone = "555-555-5555",
                Description = "I need someone to pick up a giant rack of ribs. It's heavy!"
            };

            var request2 = new Request
            {
                RequestId = "2",
                Name = "Wile E. Coyote",
                Location = "The Desert",
                Phone = "444-444-4444",
                Description = "I am in need of a large anvil. It must be heavy enough to stop a sneaky roadrunner."
            };

            context.Requests.Add(request1);
            context.Requests.Add(request2);
            context.SaveChanges();
        }
    }
}
