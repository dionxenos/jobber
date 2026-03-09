using API.DTOs;
using API.Interfaces;
using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Controllers
{
    public class JobsController : BaseApiController
    {
        private readonly ThesisDbContext _context;
        private readonly IJobScoringService _scoringService;

        public JobsController(ThesisDbContext context, IJobScoringService scoringService)
        {
            _context = context;
            _scoringService = scoringService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            var jobs = await _context.Jobs.ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpGet("getByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobsByUserId(int userId)
        {
            var jobs = await _context.Jobs.Where(j => j.UserId == userId).ToListAsync();
            return Ok(jobs);
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<ActionResult<Job>> AddJob(AddJobDto dto)
        {
            var job = new Job
            {
                UserId = dto.UserId,
                Title = dto.Title,
                CreatedOn = DateTime.Now
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return Ok(job);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }

        // ---- Job Skills ----

        [HttpGet("getSkills/{jobId}")]
        public async Task<ActionResult> GetJobSkills(int jobId)
        {
            var job = await _context.Jobs
                .Where(j => j.Id == jobId)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    JobSkills = j.JobSkills.Select(js => new
                    {
                        js.Id,
                        js.JobId,
                        js.SkillId,
                        Skill = new { js.Skill.Id, js.Skill.Name }
                    })
                })
                .FirstOrDefaultAsync();

            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost("skills/add")]
        public async Task<ActionResult> AddJobSkill(AddJobSkillDto dto)
        {
            var jobSkill = new JobSkill
            {
                JobId = dto.JobId,
                SkillId = dto.SkillId
            };

            _context.JobSkills.Add(jobSkill);
            await _context.SaveChangesAsync();

            return Ok(jobSkill);
        }

        [HttpDelete("skills/delete/{jobId}/{skillId}")]
        public async Task<ActionResult> DeleteJobSkill(int jobId, int skillId)
        {
            var js = await _context.JobSkills
                .FirstOrDefaultAsync(x => x.JobId == jobId && x.SkillId == skillId);

            if (js == null) return NotFound();

            _context.JobSkills.Remove(js);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }

        // ---- Job Languages ----

        [HttpGet("getLanguages/{jobId}")]
        public async Task<ActionResult<IEnumerable<JobLanguageResponseDto>>> GetJobLanguages(int jobId)
        {
            var result = await (from jl in _context.JobLanguages
                                where jl.JobId == jobId
                                join lang in _context.Languages on jl.LanguageCode equals lang.Code
                                select new JobLanguageResponseDto
                                {
                                    Id = jl.Id,
                                    JobId = jl.JobId,
                                    LanguageCode = jl.LanguageCode,
                                    LanguageLevelCode = jl.LanguageLevelCode,
                                    LanguageName = lang.Name
                                }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("languages/add")]
        public async Task<ActionResult> AddJobLanguage(AddJobLanguageDto dto)
        {
            var jobLanguage = new JobLanguage
            {
                JobId = dto.JobId,
                LanguageCode = dto.LanguageCode,
                LanguageLevelCode = dto.LanguageLevelCode
            };

            _context.JobLanguages.Add(jobLanguage);
            await _context.SaveChangesAsync();

            return Ok(jobLanguage);
        }

        [HttpDelete("languages/delete/{langId}")]
        public async Task<ActionResult> DeleteJobLanguage(int langId)
        {
            var jl = await _context.JobLanguages.FindAsync(langId);
            if (jl == null) return NotFound();

            _context.JobLanguages.Remove(jl);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }

        // ---- Job Education ----

        [HttpGet("getEducation/{jobId}")]
        public async Task<ActionResult<IEnumerable<JobEducationResponseDto>>> GetJobEducation(int jobId)
        {
            var result = await (from je in _context.JobEducations
                                where je.JobId == jobId
                                join field in _context.EducationFields on je.FieldId equals field.Id
                                join level in _context.EducationLevels on je.EducationLevelId equals level.Id
                                select new JobEducationResponseDto
                                {
                                    Id = je.Id,
                                    JobId = je.JobId,
                                    EducationLevelId = je.EducationLevelId,
                                    FieldId = je.FieldId,
                                    Name = field.Name,
                                    Level = level.Level
                                }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("education/add")]
        public async Task<ActionResult> AddJobEducation(AddJobEducationDto dto)
        {
            var jobEducation = new JobEducation
            {
                JobId = dto.JobId,
                EducationLevelId = dto.LevelId,
                FieldId = dto.FieldId
            };

            _context.JobEducations.Add(jobEducation);
            await _context.SaveChangesAsync();

            return Ok(jobEducation);
        }

        [HttpDelete("education/delete/{eduId}")]
        public async Task<ActionResult> DeleteJobEducation(int eduId)
        {
            var je = await _context.JobEducations.FindAsync(eduId);
            if (je == null) return NotFound();

            _context.JobEducations.Remove(je);
            await _context.SaveChangesAsync();

            return Ok("delete was successful");
        }

        // ---- Scoring ----

        [HttpGet("getSkillScore/{jobId}")]
        public async Task<ActionResult<IEnumerable<CandidateScoreDto>>> GetSkillScore(int jobId)
        {
            var result = await _scoringService.GetSkillScoreForJobAsync(jobId);
            return Ok(result.Take(25));
        }

        [HttpGet("getLangScore/{jobId}")]
        public async Task<ActionResult<IEnumerable<CandidateScoreDto>>> GetLangScore(int jobId)
        {
            var result = await _scoringService.GetLangScoreForJobAsync(jobId);
            return Ok(result);
        }

        [HttpGet("getEduScore/{jobId}")]
        public async Task<ActionResult<IEnumerable<CandidateScoreDto>>> GetEduScore(int jobId)
        {
            var result = await _scoringService.GetEduScoreForJobAsync(jobId);
            return Ok(result);
        }

        [HttpPost("recruit/{jobId}")]
        public async Task<ActionResult<IEnumerable<TotalScoreDto>>> Recruit(int jobId, RecruitRequestDto dto)
        {
            var result = await _scoringService.GetTotalScoreAsync(jobId, dto.SkillWeight, dto.LangWeight, dto.EduWeight);
            return Ok(result.Take(dto.NumOfResults));
        }
    }
}
