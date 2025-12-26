using System;
using System.Collections.Generic;

namespace JobberAPI.Models;

public partial class Interview
{
    public int Id { get; set; }

    public int EmploId { get; set; }

    public int CandId { get; set; }

    public bool? HasAccepted { get; set; }

    public virtual User Cand { get; set; } = null!;

    public virtual User Emplo { get; set; } = null!;
}
