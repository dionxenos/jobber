namespace API.DTOs
{
    public class AddJobLanguageDto
    {
        public int JobId { get; set; }
        public string LanguageCode { get; set; }
        public string LanguageLevelCode { get; set; }
    }
}
