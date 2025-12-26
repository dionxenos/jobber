using JobberAPI.Models;

namespace JobberAPI.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string RoleCode { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Telephone { get; set; } = null!;

        public DateTime? CreatedOn { get; set; }
    }
}
