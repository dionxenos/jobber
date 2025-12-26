using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class EducationField
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CandidateEducation> CandidateEducations { get; set; } = new List<CandidateEducation>();

    public virtual ICollection<JobEducation> JobEducations { get; set; } = new List<JobEducation>();
}
