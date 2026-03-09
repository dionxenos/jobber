using JobberAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    public class EducationController : BaseApiController
    {
        private readonly ThesisDbContext _context;

        public EducationController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpGet("fields")]
        public async Task<ActionResult<IEnumerable<EducationField>>> GetFields()
        {
            var fields = await _context.EducationFields.ToListAsync();
            return Ok(fields);
        }

        [HttpGet("levels")]
        public async Task<ActionResult<IEnumerable<EducationLevel>>> GetLevels()
        {
            var levels = await _context.EducationLevels.ToListAsync();
            return Ok(levels);
        }

        [HttpGet("fields/{id}")]
        public async Task<ActionResult<EducationField>> GetField(int id)
        {
            var field = await _context.EducationFields.FindAsync(id);
            if (field == null) return NotFound();
            return Ok(field);
        }

        [HttpGet("levels/{id}")]
        public async Task<ActionResult<EducationLevel>> GetLevel(int id)
        {
            var level = await _context.EducationLevels.FindAsync(id);
            if (level == null) return NotFound();
            return Ok(level);
        }

        [HttpGet("fields/getByName/{name}")]
        public async Task<ActionResult<EducationField>> GetFieldByName(string name)
        {
            var field = await _context.EducationFields.FirstOrDefaultAsync(f => f.Name == name);
            if (field == null) return NotFound();
            return Ok(field);
        }

        [HttpGet("levels/getByName/{level}")]
        public async Task<ActionResult<EducationLevel>> GetLevelByName(string level)
        {
            var eduLevel = await _context.EducationLevels.FirstOrDefaultAsync(l => l.Level == level);
            if (eduLevel == null) return NotFound();
            return Ok(eduLevel);
        }
    }
}
