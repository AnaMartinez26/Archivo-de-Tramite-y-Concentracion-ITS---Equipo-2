using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Expedientes;

namespace Backend.Services.Interfaces;

public interface IExpedienteService
{
    Task<List<ExpedienteDto>> ObtenerTodosAsync();
    Task<ServiceResult<ExpedienteDto>> CrearAsync(CrearExpedienteDto dto);
}
