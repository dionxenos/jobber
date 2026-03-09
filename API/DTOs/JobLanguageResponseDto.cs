namespace API.DTOs
{
    public class JobLanguageResponseDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string LanguageCode { get; set; }
        public string LanguageLevelCode { get; set; }
        public string LanguageName { get; set; }
    }
}
