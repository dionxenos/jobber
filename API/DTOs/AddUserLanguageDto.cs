namespace API.DTOs
{
    public class AddUserLanguageDto
    {
        public int UserId { get; set; }
        public string LanguageCode { get; set; }
        public string LanguageLevelCode { get; set; }
    }
}
