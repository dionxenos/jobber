using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace API.Extensions
{
    public static class LoggingExtensions
    {
        public static IHostBuilder AddSerilog(this IHostBuilder host)
        {
            host.UseSerilog((context, configuration) =>
                configuration
                    .ReadFrom.Configuration(context.Configuration)
                    .WriteTo.Console(
                        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}",
                        theme: AnsiConsoleTheme.Code,
                        applyThemeToRedirectedOutput: true)
                    .WriteTo.File(
                        path: "logs/log-.txt",
                        rollingInterval: RollingInterval.Day,
                        retainedFileCountLimit: 7,
                        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"));

            return host;
        }
    }
}
