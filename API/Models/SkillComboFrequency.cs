using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class SkillComboFrequency
{
    public int SkillIdA { get; set; }

    public int SkillIdB { get; set; }

    public int Occurences { get; set; }
}
