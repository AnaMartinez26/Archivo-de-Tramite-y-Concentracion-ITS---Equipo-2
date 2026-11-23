using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Disposicion;

namespace Backend.Services.Interfaces;

public interface IDisposicionService
{
    Task<List<DisposicionDto>> ObtenerTodosAsync();

    Task<ServiceResult<DisposicionDto>> CrearAsync(
        CrearDisposicionDto dto);

    Task<ServiceResult<ActaBajaDto>> GenerarActaBajaAsync(
        List<int> ids);

    Task<ServiceResult<List<DisposicionDto>>> AutorizarTransferenciaAsync(
        List<int> ids,
        int usuarioId);
}