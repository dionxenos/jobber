using API.DTOs;
using API.Interfaces;
using AutoMapper;
using JobberAPI.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobberAPI.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _userRepository.GetUsers();
            return Ok(users);
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<IEnumerable<UserDto>>> SearchUsers([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return Ok(Array.Empty<UserDto>());
            var users = await _userRepository.SearchUsers(q);
            return Ok(users);
        }

        [HttpGet]
        [Route("{userId}")]
        public async Task<ActionResult<UserDetailsDto>> GetUser(int userId)
        {
            var user = await _userRepository.GetUserById(userId);

            if (user == null) return NotFound("User not found.");

            return Ok(user);
        }

        [HttpGet]
        [Route("{userId}/skills")]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetUserSkills(int userId)
        {
            var userSkills = await _userRepository.GetUserSkillsAsync(userId);
            return Ok(userSkills);
        }

        [Authorize]
        [HttpPut]
        [Route("{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, UpdateProfileDto dto)
        {
            await _userRepository.UpdateUser(userId, dto.FullName, dto.Email, dto.Telephone);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var deleted = await _userRepository.DeleteUser(userId);
            if (!deleted) return NotFound();

            HttpContext.Response.Cookies.Delete("token");
            return NoContent();
        }
    }
}
