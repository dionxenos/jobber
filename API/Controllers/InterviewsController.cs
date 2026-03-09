using API.DTOs;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    public class InterviewsController : BaseApiController
    {
        private readonly ThesisDbContext _context;

        public InterviewsController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> CreateInterview(CreateInterviewDto dto)
        {
            var interview = new Interview
            {
                EmploId = dto.EmploId,
                CandId = dto.CandId,
                HasAccepted = false
            };

            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            return Ok("ADDED INVITE");
        }

        [HttpGet("employer/{emploId}")]
        public async Task<ActionResult<IEnumerable<InterviewDto>>> GetEmployerInvites(int emploId)
        {
            var result = await (from i in _context.Interviews
                                where i.EmploId == emploId
                                join u in _context.Users on i.CandId equals u.Id
                                select new InterviewDto
                                {
                                    Id = i.Id,
                                    Email = u.Email,
                                    FullName = u.FullName,
                                    UserId = u.Id,
                                    HasAccepted = i.HasAccepted
                                }).ToListAsync();

            return Ok(result);
        }

        [HttpGet("candidate/{candId}")]
        public async Task<ActionResult<IEnumerable<InterviewDto>>> GetCandidateInvites(int candId)
        {
            var result = await (from i in _context.Interviews
                                where i.CandId == candId
                                join u in _context.Users on i.EmploId equals u.Id
                                select new InterviewDto
                                {
                                    Id = i.Id,
                                    Email = u.Email,
                                    FullName = u.FullName,
                                    UserId = u.Id,
                                    HasAccepted = i.HasAccepted
                                }).ToListAsync();

            return Ok(result);
        }

        [Authorize]
        [HttpPut("accept")]
        public async Task<ActionResult> AcceptInterview([FromBody] int id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null) return NotFound();

            interview.HasAccepted = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeclineInterview(int id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null) return NotFound();

            _context.Interviews.Remove(interview);
            await _context.SaveChangesAsync();

            return Ok("DELETED INVITE");
        }
    }
}
