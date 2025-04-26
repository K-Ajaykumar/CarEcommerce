using System.Threading.Tasks;
using CarEcommerce.API.Models;

namespace CarEcommerce.API.Services
{
    public interface IAuthService
    {
        Task<User?> Authenticate(string username, string password);
        string GenerateToken(User user);
    }
} 