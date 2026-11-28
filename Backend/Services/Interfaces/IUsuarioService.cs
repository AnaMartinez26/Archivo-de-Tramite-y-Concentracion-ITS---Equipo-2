using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Usuarios;
using Backend.Models.Entities;

namespace Backend.Services.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDto>> ObtenerTodosAsync();
    Task<ServiceResult<UsuarioDto>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<UsuarioDto>> CrearAsync(CrearUsuarioDto dto);
    Task<ServiceResult<UsuarioDto>> ActualizarAsync(int id, ActualizarUsuarioDto dto);
    Task<ServiceResult<UsuarioDto>> RestablecerPasswordAsync(
        int id,
        RestablecerPasswordUsuarioDto dto
    );

    Task<ServiceResult<UsuarioDto>> CambiarEstadoAsync(int id, CambiarEstadoUsuarioDto dto, int idUsuarioActual = 0
    );

    Task<List<Rol>> ObtenerRolesAsync();
}