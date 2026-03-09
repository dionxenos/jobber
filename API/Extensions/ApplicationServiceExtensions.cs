using API.Data;
using API.Interfaces;
using API.Settings;
using JobberAPI.Models;
using JobberAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            AppSettings settings)
        {
            services.AddDbContext<ThesisDbContext>(options =>
                options.UseNpgsql(settings.ConnectionStrings.DefaultConnection));
            services.AddCors();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddCookie(x =>
            {
                x.Cookie.Name = "token";
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
                x.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["token"];
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddScoped<ISkillsRepository, SkillsRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJobScoringService, JobScoringService>();
            services.AddScoped<ISkillFrequencyService, SkillFrequencyService>();

            return services;
        }
    }
}