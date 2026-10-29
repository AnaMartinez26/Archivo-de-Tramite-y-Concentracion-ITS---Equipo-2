using Backend.Helpers;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Seed;

// Crea los roles base y, si no hay ningún usuario, un administrador inicial.
public static class DbSeeder
{
    // Mismos roles que usa el frontend (src/core/helpers.js -> ROLES)
    private static readonly string[] RolesBase =
    {
        "Administrador", "Trabajador RRHH", "Encargada de Archivo", "Servicio Social", "Directivo"
    };

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");

        try
        {
            await db.Database.EnsureCreatedAsync();

            // 1. Roles
            var existentes = await db.Roles.Select(r => r.Nombre).ToListAsync();
            var faltantes = RolesBase.Where(r => !existentes.Contains(r)).ToList();
            if (faltantes.Count > 0)
            {
                db.Roles.AddRange(faltantes.Select(n => new Rol { Nombre = n }));
                await db.SaveChangesAsync();
                logger.LogInformation("Roles creados: {Roles}", string.Join(", ", faltantes));
            }

            // 2. Administrador inicial (solo si la tabla usuarios está vacía)
            if (await db.Usuarios.AnyAsync()) return;

            var admin = config.GetSection("SeedAdmin");
            var password = admin["Password"];
            if (string.IsNullOrWhiteSpace(password))
            {
                logger.LogWarning("No hay usuarios y falta 'SeedAdmin:Password' en appsettings; no se creó el administrador.");
                return;
            }

            var rolAdmin = await db.Roles.FirstAsync(r => r.Nombre == "Administrador");
            db.Usuarios.Add(new Usuario
            {
                NumEmpleado = admin.GetValue("NumEmpleado", 1),
                Nombre = admin["Nombre"] ?? "Administrador",
                ApellidoP = admin["ApellidoP"] ?? "Sistema",
                ApellidoM = admin["ApellidoM"] ?? "SATC",
                Correo = (admin["Correo"] ?? "admin@saltillo.tecnm.mx").ToLowerInvariant(),
                Pass = PasswordHasher.Hash(password),
                IdRol = rolAdmin.Id,
                Estado = "Activo"
            });
            await db.SaveChangesAsync();
            logger.LogInformation("Usuario administrador inicial creado: {Correo}", admin["Correo"]);
        }
        catch (Exception ex)
        {
            // No detenemos la API si la base no está disponible; solo se avisa en consola
            logger.LogError(ex, "No se pudo ejecutar el seeder. ¿Existe la base SATC-ITS y las tablas usuarios/roles?");
        }
    }
}
