using Backend.Models.DTOs.Almacenamiento;
using Backend.Models.DTOs.Common;

namespace Backend.Services.Interfaces;

public interface ICajaService
{
    Task<List<UbicacionFisicaDto>> ObtenerTodasAsync();
    Task<ServiceResult<UbicacionFisicaDto>> CrearAsync(CrearCajaDto dto);
    Task<ServiceResult<UbicacionFisicaDto>> MoverAsync(int id, MoverUbicacionDto dto);
}
