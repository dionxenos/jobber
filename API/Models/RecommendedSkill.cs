namespace JobberAPI.Models;

public partial class RecommendedSkill
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Occurences { get; set; }
}
