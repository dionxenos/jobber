using API.Extensions;
using API.Middleware;
using API.Settings;
using DotNetEnv;
using Serilog;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Host.AddSerilog();

var appSettings = builder.Configuration.Get<AppSettings>() ?? new AppSettings();
builder.Services.Configure<AppSettings>(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationServices(appSettings);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder =>
{
    builder
        .WithOrigins(appSettings.Cors.AllowedOrigins)
        .WithMethods(appSettings.Cors.AllowedMethods)
        .WithHeaders(appSettings.Cors.AllowedHeaders);

    if (appSettings.Cors.AllowCredentials)
        builder.AllowCredentials();
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
