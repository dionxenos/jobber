using API.Interfaces;
using JobberAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class SkillFrequencyService : ISkillFrequencyService
    {
        private readonly ThesisDbContext _context;

        public SkillFrequencyService(ThesisDbContext context)
        {
            _context = context;
        }

        public async Task RefreshSkillComboFrequencyAsync()
        {
            var existingRecords = await _context.SkillComboFrequencies.ToListAsync();
            _context.SkillComboFrequencies.RemoveRange(existingRecords);

            var candidateSkills = await _context.CandidateSkills.ToListAsync();

            var grouped = candidateSkills
                .GroupBy(cs => cs.UserId)
                .Where(g => g.Count() > 1);

            var combos = new Dictionary<(int, int), int>();

            foreach (var userGroup in grouped)
            {
                var skills = userGroup.Select(cs => cs.SkillId).ToList();
                for (int i = 0; i < skills.Count; i++)
                {
                    for (int j = 0; j < skills.Count; j++)
                    {
                        if (skills[i] == skills[j]) continue;
                        var key = (skills[i], skills[j]);
                        combos[key] = combos.GetValueOrDefault(key) + 1;
                    }
                }
            }

            var newRecords = combos.Select(kvp => new SkillComboFrequency
            {
                SkillIdA = kvp.Key.Item1,
                SkillIdB = kvp.Key.Item2,
                Occurences = kvp.Value
            });

            _context.SkillComboFrequencies.AddRange(newRecords);
            await _context.SaveChangesAsync();
        }
    }
}
