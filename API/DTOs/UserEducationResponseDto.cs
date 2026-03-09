namespace API.DTOs
{
    public class UserEducationResponseDto
    {
        public int UserId { get; set; }
        public List<UserDegreeDto> Degrees { get; set; } = new();
    }

    public class UserDegreeDto
    {
        public int Id { get; set; }
        public string FieldName { get; set; }
        public string Level { get; set; }
        public int From { get; set; }
        public int To { get; set; }
    }
}
