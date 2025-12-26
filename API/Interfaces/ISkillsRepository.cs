using JobberAPI.Models;

public interface ISkillsRepository
{
    Task<IEnumerable<SkillDto>> GetSkillsAsync();
    Task<IEnumerable<RecommendedSkill>> GetRecommendedSkillsAsync(int userId);
    Task<SkillDto> GetSkillById(int Id);
}