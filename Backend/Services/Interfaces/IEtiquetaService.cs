using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Etiquetado;

namespace Backend.Services.Interfaces;

public interface IEtiquetaService
{
    Task<List<EtiquetaDto>> ObtenerTodasAsync();
    Task<ServiceResult<EtiquetaDto>> GenerarAsync(CrearEtiquetaDto dto);
}