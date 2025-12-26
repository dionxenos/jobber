using JobberAPI.Models;

namespace JobberAPI.DTOs
{
    public class UserDetailsDto
    {
        public UserDto Details { get; set; }
        public IEnumerable<SkillDto> Skills { get; set; }
        public List<LanguageDto> Languages { get; set; }
        public List<EducationDto> Education { get; set; }
    }
}
