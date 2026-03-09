namespace API.DTOs
{
    public class AddUserEducationDto
    {
        public int UserId { get; set; }
        public int FieldId { get; set; }
        public int LevelId { get; set; }
        public int From { get; set; }
        public int To { get; set; }
    }
}
