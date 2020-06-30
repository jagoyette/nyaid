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
                    Subject = "Someone offered to help you!",
                    HtmlContent = $@"
<html>
    <body>
        <p>Someone has offered to help with your request that you submitted on Friendly!
        </p>
        <div style=""box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);"">
            <div style=""padding: .75rem 1.25rem;margin-bottom: 0;background-color: rgba(0,0,0,.03);border-bottom: 1px solid rgba(0,0,0,.125);"">
                <p>
                    <span style=""margin-bottom: .75rem;font-size: 1.25rem;font-weight: 400;"">{request.Location}</span>
                    <br>
                    <span style=""font-size: 80%;font-weight: 300;"">{request.Created}</span>
                 </p>
            </div>
            <div style=""padding: 2px 16px;"">
                <p>{request.Description}</p>
             </div>
        </div>
        <p>The description of the offer is:</p>
        <blockquote>{offer.Description}</blockquote>
        <p>Please <a href=""https://nyaid.azurewebsites.net/request/{request.RequestId}/offers"">respond</a> to this offer on <a href=""https://nyaid.azurewebsites.net"">Friendly</a>.
        </p>
    </body>
</html>
"
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
