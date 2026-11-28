using Backend.Models.DTOs.Auditoria;
using Backend.Models.DTOs.Common;

namespace Backend.Services.Interfaces;

public interface IAuditoriaService
{
    Task<List<AuditoriaDto>> ObtenerTodosAsync(string? accion = null, DateTime? desde = null, DateTime? hasta = null);
    Task<ServiceResult<AuditoriaDto>> RegistrarManualAsync(CrearAuditoriaDto dto, int? idUsuario, string? ip);
    Task RegistrarEventoAsync(int? idUsuario, string accion, string? tabla, string? idRegistro, string descripcion, string? ip);
    Task<VerificacionIntegridadDto> EjecutarVerificacionIntegridadAsync(int? idUsuario, string? ip);
}
