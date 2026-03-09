using API.DTOs;
using API.Interfaces;
using API.Settings;
using AutoMapper;
using JobberAPI.Controllers;
using JobberAPI.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly AppSettings _settings;
        private readonly IMapper _mapper;

        public AccountController(IUserRepository userRepository, IOptions<AppSettings> settings, IMapper mapper)
        {
            _userRepository = userRepository;
            _settings = settings.Value;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetUser(loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Could not find email.");
            }

            var hashedPassword = _userRepository.HashPassword(loginDto.Password);

            if (hashedPassword != user.Password)
            {
                return Unauthorized("Invalid password.");
            }

            GenerateToken(user);

            var userDto = _mapper.Map<UserDto>(user);

            return userDto;
        }

        [Authorize]
        [HttpGet]
        [Route("getCurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userRepository.GetUser(userEmail);

            if (user == null)
            {
                return Unauthorized("Could not find email.");
            }

            var userDto = _mapper.Map<UserDto>(user);

            return userDto;
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult LogOut()
        {
            HttpContext.Response.Cookies.Delete("token");

            return StatusCode(204);
        }

        private dynamic GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.RoleCode),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encrypterToken = tokenHandler.WriteToken(token);

            HttpContext.Response.Cookies.Append("token", encrypterToken,
                new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(7),
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.None
                }
            );

            return new { token = encrypterToken, email = user.Email, name = user.FullName };
        }
    }
}