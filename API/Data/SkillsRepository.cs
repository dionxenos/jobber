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

            return skills.Select(_mapper.Map<SkillDto>);
        }
    }
}