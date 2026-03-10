using JobberAPI.DTOs;
using JobberAPI.Models;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserDto>> GetUsers();
        Task<IEnumerable<UserDto>> SearchUsers(string query);
        Task<User> GetUser(string email);
        Task<UserDetailsDto> GetUserById(int id);
        Task<IEnumerable<SkillDto>> GetUserSkillsAsync(int id);
        string HashPassword(string password);
        Task AddUser(User user);
        Task UpdateUser(int id, string fullName, string email, string telephone);
        Task<bool> DeleteUser(int id);
    }
}