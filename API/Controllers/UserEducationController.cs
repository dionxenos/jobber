using API.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserEducationController : ControllerBase
    {
        private readonly ThesisDbContext _context;

        public UserEducationController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserEducationResponseDto>> GetUserEducation(int userId)
        {
            var results = await (from ce in _context.CandidateEducations
                                 where ce.UserId == userId
                                 join field in _context.EducationFields on ce.FieldId equals field.Id
                                 join level in _context.EducationLevels on ce.EducationLevelId equals level.Id
                                 select new UserDegreeDto
                                 {
                                     Id = ce.Id,
                                     FieldName = field.Name,
                                     Level = level.Level,
                                     From = ce.From,
                                     To = ce.To
                                 }).ToListAsync();

            if (!results.Any())
                return Ok(new List<object>());

            return Ok(new UserEducationResponseDto
            {
                UserId = userId,
                Degrees = results
            });
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<ActionResult> AddUserEducation(AddUserEducationDto dto)
        {
            var candidateEducation = new CandidateEducation
            {
                UserId = dto.UserId,
                EducationLevelId = dto.LevelId,
                FieldId = dto.FieldId,
                From = dto.From,
                To = dto.To
            };

            _context.CandidateEducations.Add(candidateEducation);
            await _context.SaveChangesAsync();

            return Ok(candidateEducation);
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteUserEducation(int id)
        {
            var ce = await _context.CandidateEducations.FirstOrDefaultAsync(x => x.Id == id);
            if (ce == null) return NotFound();

            _context.CandidateEducations.Remove(ce);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }
    }
}
