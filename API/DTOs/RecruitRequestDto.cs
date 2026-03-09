namespace API.DTOs
{
    public class RecruitRequestDto
    {
        public double SkillWeight { get; set; }
        public double LangWeight { get; set; }
        public double EduWeight { get; set; }
        public int NumOfResults { get; set; }
    }
}
