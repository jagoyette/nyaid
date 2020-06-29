using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NYAidWebApp.DataContext;
using NYAidWebApp.Models;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace NYAidWebApp.Services
{
    public class EmailService
    {
        private readonly ILogger _log;
        private readonly IConfiguration _configuration;
        private readonly ApiDataContext _context;
        private readonly UserService _userService;

        private readonly string FROM_EMAIL_ADDRESS = "no-reply@nyaid.azurewebsites.net";
        private readonly string FROM_EMAIL_NAME = "Friendly";

        public EmailService(ILoggerFactory loggerFactory, IConfiguration configuration, ApiDataContext context, UserService userService)
        {
            _log = loggerFactory.CreateLogger<EmailService>();
            _configuration = configuration;
            _context = context;
            _userService = userService;
        }

        public async Task SendTestEmail(UserInfo user)
        {
            var apiKey = _configuration["SENDGRID_API_KEY"];
            if (!string.IsNullOrEmpty(apiKey))
            {
                var client = new SendGridClient(apiKey);
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

        public async Task SendNewOfferNotification(string offerId)
        {
            var apiKey = _configuration["SENDGRID_API_KEY"];
            if (!string.IsNullOrEmpty(apiKey))
            {
                // retrieve the offer
                var offer = await _context.Offers.FirstOrDefaultAsync(o => o.OfferId == offerId);
                if (offer == null)
                {
                    _log.LogError($"Offer {offerId} was not found");
                    return;
                }

                // retrieve request
                var request = await _context.Requests.FirstOrDefaultAsync(r => r.RequestId == offer.RequestId);
                if (request == null)
                {
                    _log.LogError($"Request {offer.RequestId} was not found");
                    return;
                }

                // retrieve user who created request
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == request.CreatorUid);
                if (user == null)
                {
                    _log.LogError($"User {request.CreatorUid} was not found");
                    return;
                }

                var client = new SendGridClient(apiKey);
                var msg = new SendGridMessage()
                {
                    From = new EmailAddress(FROM_EMAIL_ADDRESS, FROM_EMAIL_NAME),
                    Subject = "An offer was submitted to help with your request",
                    HtmlContent = $"Your request received an <a href=\"https://nyaid.azurewebsites.net/request/{request.RequestId}/offers\">offer</a>"
                };
                msg.AddTo(new EmailAddress(user.Email, user.Name));
                var response = await client.SendEmailAsync(msg);
            }
        }
    }
}
