using API.DTOs;

namespace API.Interfaces
{
    public interface IJobScoringService
    {
        Task<IEnumerable<CandidateScoreDto>> GetEduScoreForJobAsync(int jobId);
        Task<IEnumerable<CandidateScoreDto>> GetLangScoreForJobAsync(int jobId);
        Task<IEnumerable<CandidateScoreDto>> GetSkillScoreForJobAsync(int jobId);
        Task<IEnumerable<TotalScoreDto>> GetTotalScoreAsync(int jobId, double skillWeight, double langWeight, double eduWeight);
    }
}
