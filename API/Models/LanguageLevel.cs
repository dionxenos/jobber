using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class LanguageLevel
{
    public string Code { get; set; } = null!;

    public int Level { get; set; }

    public virtual ICollection<CandidateLanguge> CandidateLanguges { get; set; } = new List<CandidateLanguge>();

    public virtual ICollection<JobLanguage> JobLanguages { get; set; } = new List<JobLanguage>();
}
