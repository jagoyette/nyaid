using System;
using System.Collections.Generic;

namespace NYAidWebApp.Models
{
    public enum OfferState
    {
        Submitted,
        Accepted,
        Rejected
    }

    public class Offer
    {
        public string OfferId { get; set; }

        public string RequestId { get; set; }

        public string VolunteerUid { get; set; }

        public DateTime Created { get; set; }

        public OfferState State { get; set; }

        public string Description { get; set; }

        public string AcceptRejectReason { get; set; }

        public List<Note> Notes { get; set; } = new List<Note>();
    }
}
