using API.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLanguagesController : ControllerBase
    {
        private readonly ThesisDbContext _context;

        public UserLanguagesController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<UserLanguageResponseDto>>> GetUserLanguages(int userId)
        {
            var result = await (from cl in _context.CandidateLanguges
                                where cl.UserId == userId
                                join lang in _context.Languages on cl.LanguageCode equals lang.Code
                                select new UserLanguageResponseDto
                                {
                                    Id = cl.Id,
                                    LanguageLevelCode = cl.LanguageLevelCode,
                                    Language = new LanguageInfoDto
                                    {
                                        Code = lang.Code,
                                        Name = lang.Name
                                    }
                                }).ToListAsync();

            return Ok(result);
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<ActionResult> AddUserLanguage(AddUserLanguageDto dto)
        {
            var candidateLanguage = new CandidateLanguge
            {
                UserId = dto.UserId,
                LanguageCode = dto.LanguageCode,
                LanguageLevelCode = dto.LanguageLevelCode
            };

            _context.CandidateLanguges.Add(candidateLanguage);
            await _context.SaveChangesAsync();

            return Ok(candidateLanguage);
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteUserLanguage(int id)
        {
            var cl = await _context.CandidateLanguges.FindAsync(id);
            if (cl == null) return NotFound();

            _context.CandidateLanguges.Remove(cl);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }
    }
}
