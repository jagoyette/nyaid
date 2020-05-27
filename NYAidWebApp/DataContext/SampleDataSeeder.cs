﻿using NYAidWebApp.Models;

namespace NYAidWebApp.DataContext
{
    public class SampleDataSeeder
    {
        public void AddSampleData(ApiDataContext context)
        {
            // Add a few users
            var userFred = new UserInfo
            {
                Uid = "1",
                Email = "fred@flinstones.com",
                GivenName = "Fred",
                Surname = "Flintstone",
                Name = "Fred Flintstone",
                ProviderId = "FF-129389342",
                ProviderName = "SampleDataSeeder"
            };

            var userWiley = new UserInfo
            {
                Uid = "2",
                Email = "wile@coyote.com",
                GivenName = "Wile",
                Surname = "Coyote",
                Name = "Wile E Coyote",
                ProviderId = "WC-098812733",
                ProviderName = "SampleDataSeeder"
            };
            context.AddRange(new UserInfo[] {userFred, userWiley});

            var requests = new Request[]
            {
                new Request
                {
                    RequestId = "1",
                    CreatorUid = userFred.Uid,
                    Name = "Fred Flintstone",
                    Location = "Bedrock",
                    Phone = "555-555-5555",
                    Description = "I need someone to pick up a giant rack of ribs. It's heavy!"
                },
                new Request
                {
                    RequestId = "2",
                    CreatorUid = userWiley.Uid,
                    Name = "Wile E. Coyote",
                    Location = "The Desert",
                    Phone = "444-444-4444",
                    Description = "I am in need of a large anvil. It must be heavy enough to stop a sneaky roadrunner."
                },
                new Request
                {
                    RequestId = "3",
                    CreatorUid = userFred.Uid,
                    Name = "Fred Flintstone",
                    Location = "Just around the Corner",
                    Phone = "333-333-3333",
                    Description = "I would like someone to run down to the corner store and buy me some twigs. I need to start a fire."
                },
                new Request
                {
                    RequestId = "4",
                    CreatorUid = userWiley.Uid,
                    Name = "Wile E. Coyote",
                    Location = "Train station",
                    Phone = "444-444-4444",
                    Description = "I need a reliable schedule for the trains. It seems that every time I chase that roadrunner onto the tracks, a train finds me!"
                },

            };

            context.Requests.AddRange(requests);
            context.SaveChanges();
        }
    }
}
