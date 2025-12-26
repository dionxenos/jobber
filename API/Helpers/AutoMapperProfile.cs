using AutoMapper;
using JobberAPI.DTOs;
using JobberAPI.Models;

namespace JobberAPI.Services
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Skill, SkillDto>();
            CreateMap<User, UserDto>();
        }
    }
}