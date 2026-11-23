using Backend.Models.DTOs.Clasificacion;
using Backend.Models.DTOs.Common;

namespace Backend.Services.Interfaces;

public interface IClasificacionService
{
    Task<List<ClasificacionDto>> ObtenerTodasAsync();

    Task<ServiceResult<ClasificacionDto>> CrearAsync(
        CrearClasificacionDto dto);

    Task<ServiceResult<ClasificacionDto>> ActualizarAsync(
        int id,
        ActualizarClasificacionDto dto);

    Task<ServiceResult<bool>> EliminarAsync(int id);
}