namespace JobberAPI.Models;

public partial class User
{
    public int Id { get; set; }

    public string FullName { get; set; }

    public string RoleCode { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public string Telephone { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual ICollection<CandidateEducation> CandidateEducations { get; set; } = new List<CandidateEducation>();

    public virtual ICollection<CandidateLanguge> CandidateLanguges { get; set; } = new List<CandidateLanguge>();

    public virtual ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

    public virtual ICollection<Interview> InterviewCands { get; set; } = new List<Interview>();

    public virtual ICollection<Interview> InterviewEmplos { get; set; } = new List<Interview>();

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();

    public virtual Role RoleCodeNavigation { get; set; } = null!;
}
