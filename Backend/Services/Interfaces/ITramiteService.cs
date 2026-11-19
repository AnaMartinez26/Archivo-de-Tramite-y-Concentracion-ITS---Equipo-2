using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Workflow;

namespace Backend.Services.Interfaces;

public interface ITramiteService
{
    Task<List<TramiteDto>> ObtenerTodosAsync(string? estado = null);
    Task<ServiceResult<TramiteDto>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<TramiteDto>> CrearAsync(CrearTramiteDto dto, int idUsuarioActual);
    Task<ServiceResult<TramiteDto>> CambiarEstadoAsync(int id, ActualizarTramiteDto dto, int idUsuarioRevisa);
    Task<ServiceResult<bool>> EliminarAsync(int id);
}
