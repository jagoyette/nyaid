using System.ComponentModel.DataAnnotations;

namespace NYAidWebApp.Models
{
    public class UserInfo
    {
        /// <summary>
        /// A unique Id (UID) for this user
        /// </summary>
        [Key]
        public string Uid { get; set; }

        /// <summary>
        /// Name of the provider (facebook, google, microsoftaccount...)
        /// </summary>
        public string ProviderName { get; set; }

        /// <summary>
        /// The user Id created by the provider
        /// </summary>
        public string ProviderId { get; set; }
        
        /// <summary>
        /// Full name of the user
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Given name of the user
        /// </summary>
        public string GivenName { get; set; }

        /// <summary>
        /// Surname of the user
        /// </summary>
        public string Surname { get; set; }

        /// <summary>
        /// Email for the user
        /// </summary>
        public string Email { get; set; }
    }
}
