using System.Text;
using Backend.Data;
using Backend.Helpers;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Extensions;

public static class ServiceCollectionExtensions
{
    // Base de datos, repositorios, servicios y helpers
    public static IServiceCollection AddAplicacion(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("SatcDb")));

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddSingleton<JwtHelper>();

        return services;
    }

    // Autenticación con JWT
    public static IServiceCollection AddAutenticacionJwt(this IServiceCollection services, IConfiguration config)
    {
        var key = config["Jwt:Key"]
                  ?? throw new InvalidOperationException("Falta 'Jwt:Key' en appsettings.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = config["Jwt:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });

        services.AddAuthorization();
        return services;
    }

    // CORS para que el frontend en React pueda llamar a la API
    public static IServiceCollection AddCorsFrontend(this IServiceCollection services, IConfiguration config)
    {
        var origenes = config.GetSection("Cors:Origenes").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
            options.AddPolicy("Frontend", policy =>
                policy.WithOrigins(origenes)
                      .AllowAnyHeader()
                      .AllowAnyMethod()));

        return services;
    }
}
