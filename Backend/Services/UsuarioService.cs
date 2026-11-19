using Backend.Helpers;
using Backend.Mappings;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Usuarios;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarios;

    public UsuarioService(IUsuarioRepository usuarios) => _usuarios = usuarios;

    public async Task<List<UsuarioDto>> ObtenerTodosAsync() =>
        (await _usuarios.ObtenerTodosAsync()).Select(u => u.ToDto()).ToList();

    public async Task<ServiceResult<UsuarioDto>> ObtenerPorIdAsync(int id)
    {
        var usuario = await _usuarios.ObtenerPorIdAsync(id);
        return usuario is null
            ? ServiceResult<UsuarioDto>.Error("Usuario no encontrado.", 404)
            : ServiceResult<UsuarioDto>.Ok(usuario.ToDto());
    }

    public async Task<ServiceResult<UsuarioDto>> CrearAsync(CrearUsuarioDto dto)
    {
        var correo = dto.Correo.Trim().ToLowerInvariant();

        if (await _usuarios.ExisteCorreoAsync(correo))
            return ServiceResult<UsuarioDto>.Error("Ya existe un usuario con ese correo.", 409);

        if (await _usuarios.ExisteNumEmpleadoAsync(dto.NumEmpleado))
            return ServiceResult<UsuarioDto>.Error("Ya existe un usuario con ese número de empleado.", 409);

        if (!await _usuarios.ExisteRolAsync(dto.IdRol))
            return ServiceResult<UsuarioDto>.Error("El rol seleccionado no existe.", 400);

        var usuario = new Usuario
        {
            NumEmpleado = dto.NumEmpleado,
            Nombre = dto.Nombre.Trim(),
            ApellidoP = dto.ApellidoP.Trim(),
            ApellidoM = dto.ApellidoM.Trim(),
            Correo = correo,
            Pass = PasswordHasher.Hash(dto.Password),
            IdRol = dto.IdRol,
            Estado = dto.Estado,
            Departamento = string.IsNullOrWhiteSpace(dto.Departamento) ? null : dto.Departamento.Trim(),
            Puesto = string.IsNullOrWhiteSpace(dto.Puesto) ? null : dto.Puesto.Trim()
        };

        try
        {
            await _usuarios.AgregarAsync(usuario);
            await _usuarios.GuardarCambiosAsync();
        }
        catch (DbUpdateException ex) when (SqlExceptionHelper.EsClaveDuplicada(ex))
        {
            // Por si dos peticiones registran el mismo correo/número al mismo tiempo (UNIQUE)
            return ServiceResult<UsuarioDto>.Error(
                "No se pudo registrar: el correo o número de empleado ya existe.", 409);
        }

        // Recargar con el rol incluido para regresarlo completo
        var creado = await _usuarios.ObtenerPorIdAsync(usuario.Id);
        return ServiceResult<UsuarioDto>.Ok(creado!.ToDto(), "Usuario registrado correctamente.", 201);
    }

    public async Task<ServiceResult<UsuarioDto>> CambiarEstadoAsync(int id, CambiarEstadoUsuarioDto dto, int idUsuarioActual = 0)
    {
        var usuario = await _usuarios.ObtenerPorIdAsync(id);
        if (usuario is null)
            return ServiceResult<UsuarioDto>.Error("Usuario no encontrado.", 404);

        var nuevoEstado = dto.Estado.Trim();
        if (nuevoEstado is not ("Activo" or "Inactivo"))
            return ServiceResult<UsuarioDto>.Error("El estado debe ser 'Activo' o 'Inactivo'.", 400);

        if (idUsuarioActual > 0 && usuario.Id == idUsuarioActual && nuevoEstado == "Inactivo")
            return ServiceResult<UsuarioDto>.Error("No puedes desactivar tu propio usuario.", 400);

        if (usuario.Estado == nuevoEstado)
            return ServiceResult<UsuarioDto>.Error("El usuario ya se encuentra en ese estado.", 400);

        usuario.Estado = nuevoEstado;
        await _usuarios.GuardarCambiosAsync();

        var accion = nuevoEstado == "Activo" ? "activado" : "desactivado";
        return ServiceResult<UsuarioDto>.Ok(usuario.ToDto(), $"Usuario {accion} correctamente.");
    }

    public Task<List<Rol>> ObtenerRolesAsync() => _usuarios.ObtenerRolesAsync();
}
