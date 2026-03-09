namespace API.Settings
{
    public class AppSettings
    {
        public ConnectionStringsSettings ConnectionStrings { get; set; } = new();
        public CorsSettings Cors { get; set; } = new();
        public string Secret { get; set; } = string.Empty;
        public string AllowedHosts { get; set; } = "*";
    }

    public class ConnectionStringsSettings
    {
        public string DefaultConnection { get; set; } = string.Empty;
    }

    public class CorsSettings
    {
        public string[] AllowedOrigins { get; set; } = ["http://localhost:3000"];
        public string[] AllowedMethods { get; set; } = ["GET", "POST", "PUT", "DELETE"];
        public string[] AllowedHeaders { get; set; } = ["Content-Type", "Authorization"];
        public bool AllowCredentials { get; set; } = true;
    }
}
