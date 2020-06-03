using System;

namespace NYAidWebApp.Models
{
    public class Note
    {
        public string NoteId { get; set; }

        public string NoteText { get; set; }

        public string AuthorUid { get; set; }

        public DateTime Created { get; set; }
    }
}
