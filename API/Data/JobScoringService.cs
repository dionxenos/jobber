using API.DTOs;
using API.Interfaces;
using JobberAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class JobScoringService : IJobScoringService
    {
        private readonly ThesisDbContext _context;

        public JobScoringService(ThesisDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CandidateScoreDto>> GetEduScoreForJobAsync(int jobId)
        {
            const decimal maxScore = 80m;
            const int maxLevel = 3;

            var jobEducations = await _context.JobEducations
                .Where(je => je.JobId == jobId)
                .ToListAsync();

            if (!jobEducations.Any())
                return Enumerable.Empty<CandidateScoreDto>();

            var candidates = await _context.Users
                .Where(u => u.RoleCode == "CANDI")
                .Select(u => new { u.Id })
                .ToListAsync();

            var candidateEducations = await _context.CandidateEducations.ToListAsync();

            var maxLevelPerUser = candidateEducations
                .GroupBy(ce => ce.UserId)
                .ToDictionary(g => g.Key, g => g.Max(ce => ce.EducationLevelId));

            var results = new List<CandidateScoreDto>();

            foreach (var candidate in candidates)
            {
                var scores = new List<decimal>();

                foreach (var je in jobEducations)
                {
                    var ce = candidateEducations
                        .FirstOrDefault(c => c.UserId == candidate.Id && c.FieldId == je.FieldId);

                    int askedLevel = je.EducationLevelId;

                    if (ce != null)
                    {
                        int ownLevel = ce.EducationLevelId;
                        decimal score;
                        if (askedLevel == ownLevel)
                            score = maxScore;
                        else if (askedLevel < ownLevel)
                            score = maxScore + 20m * ownLevel / maxLevel;
                        else
                            score = maxScore * (1m - 1.0m * (askedLevel - ownLevel) / askedLevel);
                        scores.Add(score);
                    }
                    else
                    {
                        int ownLevel = maxLevelPerUser.GetValueOrDefault(candidate.Id, 0);
                        if (ownLevel > 0)
                        {
                            decimal score = ownLevel * 10.0m * (1.0m - (decimal)(maxLevel - ownLevel) / maxLevel);
                            scores.Add(score);
                        }
                    }
                }

                decimal eduScore = scores.Any() ? scores.Max() : 0;
                results.Add(new CandidateScoreDto
                {
                    JobId = jobId,
                    UserId = candidate.Id,
                    Score = Math.Round(eduScore, 2)
                });
            }

            return results.OrderByDescending(r => r.Score);
        }

        public async Task<IEnumerable<CandidateScoreDto>> GetLangScoreForJobAsync(int jobId)
        {
            const decimal maxScore = 90m;
            const int maxLevel = 6;

            var jobLanguages = await _context.JobLanguages
                .Where(jl => jl.JobId == jobId)
                .ToListAsync();

            if (!jobLanguages.Any())
                return Enumerable.Empty<CandidateScoreDto>();

            var languageLevels = await _context.LanguageLevels
                .ToDictionaryAsync(ll => ll.Code.Trim(), ll => ll.Level);

            var candidates = await _context.Users
                .Where(u => u.RoleCode == "CANDI")
                .Select(u => new { u.Id })
                .ToListAsync();

            var candidateLanguages = await _context.CandidateLanguges.ToListAsync();

            var results = new List<CandidateScoreDto>();

            foreach (var candidate in candidates)
            {
                var scores = new List<decimal>();

                foreach (var jl in jobLanguages)
                {
                    int askedLevel = languageLevels.GetValueOrDefault(jl.LanguageLevelCode.Trim(), 0);

                    var cl = candidateLanguages
                        .FirstOrDefault(c => c.UserId == candidate.Id
                            && c.LanguageCode.Trim() == jl.LanguageCode.Trim());

                    if (cl != null)
                    {
                        int knownLevel = languageLevels.GetValueOrDefault(cl.LanguageLevelCode.Trim(), 0);
                        decimal score;
                        if (askedLevel == knownLevel)
                            score = 90m;
                        else if (askedLevel < knownLevel)
                            score = maxScore + 10m * knownLevel / maxLevel;
                        else
                            score = maxScore * (1m - 1.0m * (askedLevel - knownLevel) / askedLevel);
                        scores.Add(score);
                    }
                    else
                    {
                        scores.Add(0m);
                    }
                }

                decimal langScore = scores.Any() ? scores.Average() : 0;
                results.Add(new CandidateScoreDto
                {
                    JobId = jobId,
                    UserId = candidate.Id,
                    Score = Math.Round(langScore, 2)
                });
            }

            return results.OrderByDescending(r => r.Score);
        }

        public async Task<IEnumerable<CandidateScoreDto>> GetSkillScoreForJobAsync(int jobId)
        {
            var jobSkills = await _context.JobSkills
                .Where(js => js.JobId == jobId)
                .ToListAsync();

            if (!jobSkills.Any())
                return Enumerable.Empty<CandidateScoreDto>();

            var frequencies = await _context.SkillComboFrequencies.ToListAsync();

            decimal upperThreshold = 0;
            if (frequencies.Any())
            {
                double avg = frequencies.Average(f => (double)f.Occurences);
                double stdDev = Math.Sqrt(frequencies.Average(f => Math.Pow((double)f.Occurences - avg, 2)));
                upperThreshold = (decimal)(avg + 3 * stdDev);
            }

            var candidates = await _context.Users
                .Where(u => u.RoleCode == "CANDI")
                .Select(u => new { u.Id })
                .ToListAsync();

            var candidateSkills = await _context.CandidateSkills.ToListAsync();

            var freqLookup = frequencies
                .GroupBy(f => f.SkillIdA)
                .ToDictionary(g => g.Key, g => g.ToDictionary(f => f.SkillIdB, f => f.Occurences));

            var results = new List<CandidateScoreDto>();

            foreach (var candidate in candidates)
            {
                var userSkillIds = candidateSkills
                    .Where(cs => cs.UserId == candidate.Id)
                    .Select(cs => cs.SkillId)
                    .ToHashSet();

                var scores = new List<decimal>();

                foreach (var js in jobSkills)
                {
                    if (userSkillIds.Contains(js.SkillId))
                    {
                        scores.Add(100m);
                    }
                    else
                    {
                        decimal maxOccurrence = 0;
                        if (freqLookup.TryGetValue(js.SkillId, out var relatedSkills))
                        {
                            foreach (var userSkill in userSkillIds)
                            {
                                if (relatedSkills.TryGetValue(userSkill, out int occ))
                                {
                                    if (occ > maxOccurrence)
                                        maxOccurrence = occ;
                                }
                            }
                        }

                        decimal score = upperThreshold > 0
                            ? (maxOccurrence > upperThreshold ? 80m : (maxOccurrence / upperThreshold) * 80m)
                            : 0m;
                        scores.Add(score);
                    }
                }

                decimal skillScore = scores.Any() ? scores.Average() : 0;
                results.Add(new CandidateScoreDto
                {
                    JobId = jobId,
                    UserId = candidate.Id,
                    Score = Math.Round(skillScore, 2)
                });
            }

            return results.OrderByDescending(r => r.Score);
        }

        public async Task<IEnumerable<TotalScoreDto>> GetTotalScoreAsync(
            int jobId, double skillWeight, double langWeight, double eduWeight)
        {
            var eduScores = (await GetEduScoreForJobAsync(jobId))
                .ToDictionary(s => s.UserId, s => (decimal?)s.Score);
            var langScores = (await GetLangScoreForJobAsync(jobId))
                .ToDictionary(s => s.UserId, s => (decimal?)s.Score);
            var skillScores = (await GetSkillScoreForJobAsync(jobId))
                .ToDictionary(s => s.UserId, s => (decimal?)s.Score);

            var candidates = await _context.Users
                .Where(u => u.RoleCode == "CANDI")
                .Select(u => new { u.Id, u.FullName })
                .ToListAsync();

            var results = new List<TotalScoreDto>();

            foreach (var c in candidates)
            {
                decimal? ss = skillScores.GetValueOrDefault(c.Id);
                decimal? ls = langScores.GetValueOrDefault(c.Id);
                decimal? es = eduScores.GetValueOrDefault(c.Id);

                decimal skillVal = ss ?? 0;
                decimal langVal = ls ?? 0;
                decimal eduVal = es ?? 0;

                decimal weightedSum = skillVal * (decimal)skillWeight
                    + langVal * (decimal)langWeight
                    + eduVal * (decimal)eduWeight;

                decimal totalWeight = (ss.HasValue ? (decimal)skillWeight : 0)
                    + (ls.HasValue ? (decimal)langWeight : 0)
                    + (es.HasValue ? (decimal)eduWeight : 0);

                decimal totalScore = totalWeight > 0
                    ? Math.Round(weightedSum / totalWeight, 2)
                    : 0;

                results.Add(new TotalScoreDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    SkillScore = Math.Round(skillVal, 2),
                    LangScore = Math.Round(langVal, 2),
                    EduScore = Math.Round(eduVal, 2),
                    TotalScore = totalScore
                });
            }

            var ordered = results.OrderByDescending(r => r.TotalScore).ToList();
            for (int i = 0; i < ordered.Count; i++)
                ordered[i].RowNum = i + 1;

            return ordered;
        }
    }
}
