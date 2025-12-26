using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class Job
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime CreatedOn { get; set; }

    public virtual ICollection<JobEducation> JobEducations { get; set; } = new List<JobEducation>();

    public virtual ICollection<JobLanguage> JobLanguages { get; set; } = new List<JobLanguage>();

    public virtual ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();

    public virtual User User { get; set; } = null!;
}
