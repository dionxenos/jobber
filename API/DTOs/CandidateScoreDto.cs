namespace API.DTOs
{
    public class CandidateScoreDto
    {
        public int JobId { get; set; }
        public int UserId { get; set; }
        public decimal Score { get; set; }
    }

    public class TotalScoreDto
    {
        public int RowNum { get; set; }
        public int Id { get; set; }
        public string FullName { get; set; }
        public decimal SkillScore { get; set; }
        public decimal LangScore { get; set; }
        public decimal EduScore { get; set; }
        public decimal TotalScore { get; set; }
    }
}
