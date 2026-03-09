using API.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSkillsController : ControllerBase
    {
        private readonly ThesisDbContext _context;

        public UserSkillsController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<UserSkillResponseDto>>> GetUserSkills(int userId)
        {
            var skills = await (from cs in _context.CandidateSkills
                                join s in _context.Skills on cs.SkillId equals s.Id
                                where cs.UserId == userId
                                orderby cs.Id
                                select new UserSkillResponseDto
                                {
                                    CsId = cs.Id,
                                    Id = s.Id,
                                    Name = s.Name
                                }).ToListAsync();

            return Ok(skills);
        }

        [HttpGet("recommendedskills/{userId}")]
        public async Task<ActionResult<IEnumerable<RecommendedSkill>>> GetRecommendedSkills(int userId)
        {
            var userSkillIds = await _context.CandidateSkills
                .Where(cs => cs.UserId == userId)
                .Select(cs => cs.SkillId)
                .ToListAsync();

            var recommendedSkills = await _context.SkillComboFrequencies
                .Where(f => userSkillIds.Contains(f.SkillIdA) && !userSkillIds.Contains(f.SkillIdB))
                .GroupBy(f => f.SkillIdB)
                .Select(g => new { SkillId = g.Key, TotalOccurrences = g.Sum(f => f.Occurences) })
                .OrderByDescending(x => x.TotalOccurrences)
                .Take(10)
                .Join(_context.Skills, x => x.SkillId, s => s.Id,
                    (x, s) => new RecommendedSkill
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Occurences = x.TotalOccurrences
                    })
                .ToListAsync();

            return Ok(recommendedSkills);
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<ActionResult> AddUserSkill(AddUserSkillDto dto)
        {
            var nextId = await _context.CandidateSkills
                .MaxAsync(cs => (int?)cs.Id) ?? 0;

            var candidateSkill = new CandidateSkill
            {
                Id = nextId + 1,
                UserId = dto.UserId,
                SkillId = dto.SkillId
            };

            _context.CandidateSkills.Add(candidateSkill);
            await _context.SaveChangesAsync();

            return Ok(candidateSkill);
        }

        [Authorize]
        [HttpDelete("{userId}/delete/{skillId}")]
        public async Task<ActionResult> DeleteUserSkill(int userId, int skillId)
        {
            var cs = await _context.CandidateSkills
                .FirstOrDefaultAsync(x => x.UserId == userId && x.SkillId == skillId);

            if (cs == null) return NotFound();

            _context.CandidateSkills.Remove(cs);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }
    }
}
