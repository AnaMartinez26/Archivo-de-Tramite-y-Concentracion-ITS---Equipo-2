using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Usuarios;
using Backend.Models.Entities;

namespace Backend.Services.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDto>> ObtenerTodosAsync();
    Task<ServiceResult<UsuarioDto>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<UsuarioDto>> CrearAsync(CrearUsuarioDto dto);
    Task<List<Rol>> ObtenerRolesAsync();
}
