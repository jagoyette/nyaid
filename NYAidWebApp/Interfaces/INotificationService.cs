using System;
using System.Threading.Tasks;

namespace NYAidWebApp.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendNewOfferNotification(string offerId);

        Task<bool> SendOfferDeclinedNotification(string offerId);

        Task<bool> SendOfferAcceptedNotification(string offerId);

        Task<bool> SendRequestClosedNotification(string requestId);
    }
}
