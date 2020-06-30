using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NYAidWebApp.DataContext;
using NYAidWebApp.Interfaces;
using NYAidWebApp.Models;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace NYAidWebApp.Services
{
    public class EmailNotificationProvider : INotificationService
    {
        private readonly ILogger _log;
        private readonly IConfiguration _configuration;
        private readonly ApiDataContext _context;
        private readonly IUserService _userService;

        private readonly string FROM_EMAIL_ADDRESS = "no-reply@nyaid.azurewebsites.net";
        private readonly string FROM_EMAIL_NAME = "Friendly";

        public EmailNotificationProvider(ILoggerFactory loggerFactory, IConfiguration configuration, ApiDataContext context, IUserService userService)
        {
            _log = loggerFactory.CreateLogger<EmailNotificationProvider>();
            _configuration = configuration;
            _context = context;
            _userService = userService;
        }

        /// <summary>
        /// Returns the API key authorizing access to SendGrid
        /// </summary>
        private string ApiKey => _configuration["SENDGRID_API_KEY"];

        public async Task SendTestEmail(UserInfo user)
        {
            if (!string.IsNullOrEmpty(ApiKey))
            {
                var client = new SendGridClient(ApiKey);
                var msg = new SendGridMessage()
                {
                    From = new EmailAddress(FROM_EMAIL_ADDRESS, FROM_EMAIL_NAME),
                    Subject = "Friendly Test Email",
                    PlainTextContent = "This is a test email notification.",
                    HtmlContent = "<strong>This is a test email notification</strong>"
                };
                msg.AddTo(new EmailAddress(user.Email, user.Name));
                var response = await client.SendEmailAsync(msg);
            }
        }

        public async Task<bool> SendNewOfferNotification(string offerId)
        {
            if (!string.IsNullOrEmpty(ApiKey))
            {
                // retrieve the offer
                var offer = await _context.Offers.FirstOrDefaultAsync(o => o.OfferId == offerId);
                if (offer == null)
                {
                    _log.LogError($"Offer {offerId} was not found");
                    return false;
                }

                // retrieve request
                var request = await _context.Requests.FirstOrDefaultAsync(r => r.RequestId == offer.RequestId);
                if (request == null)
                {
                    _log.LogError($"Request {offer.RequestId} was not found");
                    return false;
                }

                // retrieve user who created request
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == request.CreatorUid);
                if (user == null)
                {
                    _log.LogError($"User {request.CreatorUid} was not found");
                    return false;
                }

                var client = new SendGridClient(ApiKey);
                var msg = new SendGridMessage()
                {
                    From = new EmailAddress(FROM_EMAIL_ADDRESS, FROM_EMAIL_NAME),
                    Subject = "An offer was submitted to help with your request",
                    HtmlContent = $"Your request received an <a href=\"https://nyaid.azurewebsites.net/request/{request.RequestId}/offers\">offer</a>"
                };
                msg.AddTo(new EmailAddress(user.Email, user.Name));
                var response = await client.SendEmailAsync(msg);

                // Return true for successful response
                return response?.StatusCode == HttpStatusCode.Accepted || 
                       response?.StatusCode == HttpStatusCode.OK;
            }

            return false;
        }
    }
}
