using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Vigencias;

namespace Backend.Services.Interfaces;

public interface IVigenciaService
{
    Task<List<VigenciaDto>> ObtenerTodosAsync();
    Task<VigenciaResumenDto> ObtenerResumenAsync();
    Task<ServiceResult<VigenciaDto>> RegistrarAsync(CrearVigenciaDto dto);
    Task<ServiceResult<VigenciaDto>> ActualizarAsync(int id, ActualizarVigenciaDto dto);
}
