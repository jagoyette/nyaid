using System.ComponentModel.DataAnnotations;

namespace NYAidWebApp.Models
{
    public class Request
    {
        /// <summary>
        /// The unique id identifying this request
        /// </summary>
        [Key]
        public string RequestId { get; set; }

        /// <summary>
        /// Uid of the user that created the Request
        /// </summary>
        public string CreatorUid { get; set; }

        /// <summary>
        /// Uid of the user that this request is assigned to
        /// </summary>
        public string AssignedUid { get; set; }

        /// <summary>
        /// Name of the user that created the request
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Location of the request
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Phone number to contact the user that created the request
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// Description of the request
        /// </summary>
        public string Description { get; set; }
    }
}
