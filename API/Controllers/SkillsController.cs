using JobberAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobberAPI.Controllers
{
    public class SkillsController : BaseApiController
    {
        private readonly ISkillsRepository _skillsRepository;
        public SkillsController(ISkillsRepository skillsRepository)
        {
            _skillsRepository = skillsRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<SkillDto>>> GetSkills()
        {
            var skills = await _skillsRepository.GetSkillsAsync();

            return Ok(skills);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<SkillDto>> GetSkill(int id)
        {
            var skill = await _skillsRepository.GetSkillById(id);

            if (skill == null) return NotFound("Skill was not found.");

            return Ok(skill);
        }

        [Authorize]
        [HttpGet]
        [Route("recommendedFor/{userId}")]
        public async Task<ActionResult<List<RecommendedSkill>>> GetRecommendedSkills(int userId)
        {
            var recommendedSkills = await _skillsRepository.GetRecommendedSkillsAsync(userId);

            return Ok(recommendedSkills);
        }
    }
}