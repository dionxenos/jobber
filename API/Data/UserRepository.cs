using System.Security.Cryptography;
using System.Text;
using API.Interfaces;
using AutoMapper;
using JobberAPI.DTOs;
using JobberAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly ThesisDbContext _context;
        private readonly IMapper _mapper;

        public UserRepository(ThesisDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<User> GetUser(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<UserDetailsDto> GetUserById(int id)
        {
            var foundUser = await _context.Users.FindAsync(id);

            if (foundUser == null)
            {
                return null;
            }

            var userSkills = await GetUserSkillsAsync(id);

            var userLanguages = await (from user in _context.Users
                                       where user.Id == id
                                       join candLang in _context.CandidateLanguges on user.Id equals candLang.UserId
                                       join lang in _context.Languages on candLang.LanguageCode equals lang.Code
                                       join langLevel in _context.LanguageLevels on candLang.LanguageLevelCode equals langLevel.Code
                                       select new LanguageDto
                                       {
                                           Code = lang.Code,
                                           Name = lang.Name,
                                           Level = langLevel.Code
                                       }
                                     ).ToListAsync();

            var userEducation = await (from user in _context.Users
                                       where user.Id == id
                                       join candEdu in _context.CandidateEducations on user.Id equals candEdu.UserId
                                       join eduField in _context.EducationFields on candEdu.FieldId equals eduField.Id
                                       join eduLevel in _context.EducationLevels on candEdu.EducationLevelId equals eduLevel.Id
                                       select new EducationDto
                                       {
                                           Id = eduField.Id,
                                           Name = eduField.Name,
                                           Level = eduLevel.Level,
                                           From = candEdu.From,
                                           To = candEdu.To
                                       }
                                     ).ToListAsync();

            return new UserDetailsDto
            {
                Details = _mapper.Map<UserDto>(foundUser),
                Skills = userSkills,
                Languages = userLanguages,
                Education = userEducation
            };
        }

        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return users.Select(user => _mapper.Map<UserDto>(user));
        }

        public async Task<IEnumerable<SkillDto>> GetUserSkillsAsync(int id)
        {
            var userSkills = await (from candSkill in _context.CandidateSkills
                                    join skill in _context.Skills on candSkill.SkillId equals skill.Id
                                    where candSkill.UserId == id
                                    select skill)
                                    .ToListAsync();

            return userSkills.Select(skill => _mapper.Map<SkillDto>(skill));
        }

        public string HashPassword(string password)
        {
            using var md5 = MD5.Create();
            byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(password));

            string hashedPassword = Convert.ToHexString(bytes);

            return hashedPassword;
        }

        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(int id, string fullName, string email, string telephone)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return;

            user.FullName = fullName;
            user.Email = email;
            user.Telephone = telephone;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}