using JobberAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    public class LanguagesController : BaseApiController
    {
        private readonly ThesisDbContext _context;

        public LanguagesController(ThesisDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Language>>> GetLanguages()
        {
            var languages = await _context.Languages.ToListAsync();
            return Ok(languages);
        }

        [HttpGet("levels")]
        public async Task<ActionResult<IEnumerable<LanguageLevel>>> GetLanguageLevels()
        {
            var levels = await _context.LanguageLevels.ToListAsync();
            return Ok(levels);
        }

        [HttpGet("{code}")]
        public async Task<ActionResult<Language>> GetLanguage(string code)
        {
            var language = await _context.Languages.FindAsync(code);
            if (language == null) return NotFound();
            return Ok(language);
        }

        [HttpGet("getByLangName/{name}")]
        public async Task<ActionResult<Language>> GetLanguageByName(string name)
        {
            var language = await _context.Languages.FirstOrDefaultAsync(l => l.Name == name);
            if (language == null) return NotFound();
            return Ok(language);
        }
    }
}
