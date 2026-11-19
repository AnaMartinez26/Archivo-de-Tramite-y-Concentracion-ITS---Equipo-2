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

        services.AddScoped<IDocumentoRepository, DocumentoRepository>();
        services.AddScoped<IDocumentoService, DocumentoService>();
        services.AddSingleton<FileStorageHelper>();

        services.AddScoped<ITramiteRepository, TramiteRepository>();
        services.AddScoped<ITramiteService, TramiteService>();


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

    // CORS para que el frontend en React (servidor local o archivo HTML directo file://) pueda llamar a la API
    public static IServiceCollection AddCorsFrontend(this IServiceCollection services, IConfiguration config)
    {
        var origenes = config.GetSection("Cors:Origenes").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
            options.AddPolicy("Frontend", policy =>
                policy.SetIsOriginAllowed(origin =>
                          origin == "null" ||
                          origenes.Contains(origin, StringComparer.OrdinalIgnoreCase) ||
                          (Uri.TryCreate(origin, UriKind.Absolute, out var uri) && uri.IsLoopback))
                      .AllowAnyHeader()
                      .AllowAnyMethod()));

        return services;
    }
}
