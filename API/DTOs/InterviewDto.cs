namespace API.DTOs
{
    public class InterviewDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public int UserId { get; set; }
        public bool? HasAccepted { get; set; }
    }
}
