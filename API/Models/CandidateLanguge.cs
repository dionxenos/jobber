using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class CandidateLanguge
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string LanguageCode { get; set; } = null!;

    public string LanguageLevelCode { get; set; } = null!;

    public virtual Language LanguageCodeNavigation { get; set; } = null!;

    public virtual LanguageLevel LanguageLevelCodeNavigation { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
