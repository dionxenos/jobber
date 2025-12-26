using API.Interfaces;
using JobberAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace JobberAPI.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("{userId}")]
        public async Task<ActionResult<User>> GetUser(int userId)
        {
            var user = await _userRepository.GetUserById(userId);

            if (user == null) return NotFound("User not found.");

            return Ok(user);
        }

        [HttpGet]
        [Route("{userId}/skills")]
        public async Task<ActionResult<List<SkillDto>>> GetUserSkills(int userId)
        {
            var userSkills = await _userRepository.GetUserSkillsAsync(userId);

            return Ok(userSkills);
        }
    }
}
