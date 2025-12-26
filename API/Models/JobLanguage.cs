using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class JobLanguage
{
    public int Id { get; set; }

    public int JobId { get; set; }

    public string LanguageLevelCode { get; set; } = null!;

    public string LanguageCode { get; set; } = null!;

    public virtual Job Job { get; set; } = null!;

    public virtual Language LanguageCodeNavigation { get; set; } = null!;

    public virtual LanguageLevel LanguageLevelCodeNavigation { get; set; } = null!;
}
