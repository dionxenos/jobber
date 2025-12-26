using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class EducationLevel
{
    public int Id { get; set; }

    public string Level { get; set; } = null!;

    public virtual ICollection<CandidateEducation> CandidateEducations { get; set; } = new List<CandidateEducation>();

    public virtual ICollection<JobEducation> JobEducations { get; set; } = new List<JobEducation>();
}
