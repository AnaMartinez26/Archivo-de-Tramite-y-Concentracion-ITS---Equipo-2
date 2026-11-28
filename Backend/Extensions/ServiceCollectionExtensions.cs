using System.Text;
using Backend.Data;
using Backend.Helpers;
using Backend.Models.DTOs.Common;
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
    public static IServiceCollection AddAplicacion(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("SatcDb")));

        // Usuarios y autenticación
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddSingleton<JwtHelper>();

        // Documentos
        services.AddScoped<IDocumentoRepository, DocumentoRepository>();
        services.AddScoped<IDocumentoService, DocumentoService>();
        services.AddSingleton<FileStorageHelper>();

        // Trámites
        services.AddScoped<ITramiteRepository, TramiteRepository>();
        services.AddScoped<ITramiteService, TramiteService>();

        // Almacenamiento sistematizado
        services.AddScoped<ICajaRepository, CajaRepository>();
        services.AddScoped<ICajaService, CajaService>();

        // Clasificación
        services.AddScoped<IClasificacionRepository, ClasificacionRepository>();
        services.AddScoped<IClasificacionService, ClasificacionService>();

        // Expedientes
        services.AddScoped<IExpedienteRepository, ExpedienteRepository>();
        services.AddScoped<IExpedienteService, ExpedienteService>();

        // Etiquetado
        services.AddScoped<IEtiquetaRepository, EtiquetaRepository>();
        services.AddScoped<IEtiquetaService, EtiquetaService>();

        //Disposición
        services.AddScoped<IDisposicionRepository, DisposicionRepository>();
        services.AddScoped<IDisposicionService, DisposicionService>();
        
        //Vigencia
        services.AddScoped<IVigenciaRepository, VigenciaRepository>();
        services.AddScoped<IVigenciaService, VigenciaService>();

        //Préstamo
        services.AddScoped<IPrestamoRepository, PrestamoRepository>();
        services.AddScoped<IPrestamoService, PrestamoService>();

        //Auditoría
        //services.AddScoped<IAuditoriaRepository, AuditoriaRepository>();
        //services.AddScoped<IAuditoriaService, AuditoriaService>();
        return services;
    }

    public static IServiceCollection AddAutenticacionJwt(
        this IServiceCollection services,
        IConfiguration config)
    {
        var key = config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(key) ||
            Encoding.UTF8.GetByteCount(key) < 32)
        {
            throw new InvalidOperationException(
                "Falta 'Jwt:Key' en appsettings o tiene menos de 32 bytes.");
        }

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
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(key)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };

                options.Events = new JwtBearerEvents
                {
                    OnChallenge = async ctx =>
                    {
                        ctx.HandleResponse();
                        ctx.Response.StatusCode =
                            StatusCodes.Status401Unauthorized;
                        ctx.Response.ContentType =
                            "application/json; charset=utf-8";

                        await ctx.Response.WriteAsJsonAsync(
                            ApiResponse<object>.Fail(
                                "Tu sesión expiró o no has iniciado sesión."));
                    },

                    OnForbidden = async ctx =>
                    {
                        ctx.Response.StatusCode =
                            StatusCodes.Status403Forbidden;
                        ctx.Response.ContentType =
                            "application/json; charset=utf-8";

                        await ctx.Response.WriteAsJsonAsync(
                            ApiResponse<object>.Fail(
                                "No tienes permisos suficientes para realizar esta acción."));
                    }
                };
            });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddCorsFrontend(
        this IServiceCollection services,
        IConfiguration config)
    {
        var origenes = config.GetSection("Cors:Origenes")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
            options.AddPolicy("Frontend", policy =>
                policy.SetIsOriginAllowed(origin =>
                        origin == "null" ||
                        origenes.Contains(
                            origin,
                            StringComparer.OrdinalIgnoreCase) ||
                        (Uri.TryCreate(
                            origin,
                            UriKind.Absolute,
                            out var uri) && uri.IsLoopback))
                    .AllowAnyHeader()
                    .AllowAnyMethod()));

        return services;
    }
}
