using System;
using System.Threading.Tasks;

namespace NYAidWebApp.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendNewOfferNotification(string offerId);
    }
}
