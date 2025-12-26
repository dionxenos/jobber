using AutoMapper;
using JobberAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Services
{
    public class SkillsRepository : ISkillsRepository
    {
        private readonly ThesisDbContext _context;
        private readonly IMapper _mapper;

        public SkillsRepository(ThesisDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RecommendedSkill>> GetRecommendedSkillsAsync(int userId)
        {
            var recommendedSkills = await _context.RecommendedSkills.FromSqlInterpolated($"EXEC [dbo].[GetRecommendatedSkills] @userId={userId}").ToListAsync();

            return recommendedSkills;
        }

        public async Task<SkillDto> GetSkillById(int Id)
        {
            var skill = await _context.Skills.FirstOrDefaultAsync(x => x.Id == Id);

            return _mapper.Map<SkillDto>(skill);
        }

        public async Task<IEnumerable<SkillDto>> GetSkillsAsync()
        {
            var skills = await _context.Skills.ToListAsync();

            return skills.Select(skill => _mapper.Map<SkillDto>(skill));
        }
    }
}