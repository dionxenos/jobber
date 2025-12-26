using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class Language
{
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<CandidateLanguge> CandidateLanguges { get; set; } = new List<CandidateLanguge>();

    public virtual ICollection<JobLanguage> JobLanguages { get; set; } = new List<JobLanguage>();
}
