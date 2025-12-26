using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class JobEducation
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public int EducationLevelId { get; set; }

    public int FieldId { get; set; }

    public virtual EducationLevel EducationLevel { get; set; } = null!;

    public virtual EducationField Field { get; set; } = null!;

    public virtual Job Job { get; set; } = null!;
}
