using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class CandidateSkill
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int SkillId { get; set; }

    public virtual Skill Skill { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
