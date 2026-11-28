using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Prestamos;

namespace Backend.Services.Interfaces;

public interface IPrestamoService
{
    Task<List<PrestamoDto>> ObtenerTodosAsync();
    Task<ServiceResult<PrestamoDto>> RegistrarSalidaAsync(CrearPrestamoDto dto, int idUsuarioRegistra);
    Task<ServiceResult<PrestamoDto>> RegistrarDevolucionAsync(int id);
    Task<ServiceResult<PrestamoDto>> ExtenderPlazoAsync(int id, ActualizarPrestamoDto dto);
}
