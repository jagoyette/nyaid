namespace NYAidWebApp.Models
{
    public class Request
    {
        /// <summary>
        /// The unique id identifying this request
        /// </summary>
        public string RequestId { get; set; }

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
