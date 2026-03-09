namespace API.DTOs
{
    public class UserLanguageResponseDto
    {
        public int Id { get; set; }
        public string LanguageLevelCode { get; set; }
        public LanguageInfoDto Language { get; set; }
    }

    public class LanguageInfoDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
