namespace API.DTOs
{
    public class JobEducationResponseDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int EducationLevelId { get; set; }
        public int FieldId { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
    }
}
