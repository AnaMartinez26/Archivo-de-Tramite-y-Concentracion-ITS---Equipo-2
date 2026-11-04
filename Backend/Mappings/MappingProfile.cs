using Backend.Models.DTOs.Usuarios;
using Backend.Models.Entities;

namespace Backend.Mappings;

// Conversiones entre entidades y DTOs
public static class MappingProfile
{
    public static UsuarioDto ToDto(this Usuario u) => new()
    {
        Id = u.Id,
        NumEmpleado = u.NumEmpleado,
        Nombre = u.Nombre,
        ApellidoP = u.ApellidoP,
        ApellidoM = u.ApellidoM,
        NombreCompleto = $"{u.Nombre} {u.ApellidoP} {u.ApellidoM}".Trim(),
        Correo = u.Correo,
        IdRol = u.IdRol,
        Rol = u.Rol?.Nombre ?? string.Empty,
        Estado = u.Estado,
        UltimoLogin = u.UltimoLogin,
        FechaCreacion = u.FechaCreacion
    };
}
