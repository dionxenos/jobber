using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class CandidateEducation
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int EducationLevelId { get; set; }

    public int FieldId { get; set; }

    public int From { get; set; }

    public int To { get; set; }

    public virtual EducationLevel EducationLevel { get; set; } = null!;

    public virtual EducationField Field { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
