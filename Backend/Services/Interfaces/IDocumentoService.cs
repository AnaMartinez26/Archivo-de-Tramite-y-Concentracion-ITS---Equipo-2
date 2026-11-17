using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Digitalizacion;

namespace Backend.Services.Interfaces;

public interface IDocumentoService
{
    Task<List<DocumentoDto>> ObtenerTodosAsync();
    Task<ServiceResult<DocumentoDto>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<DocumentoDto>> CrearAsync(CrearDocumentoDto dto, int idUsuario);
    Task<ServiceResult<DocumentoDto>> ActualizarAsync(int id, ActualizarDocumentoDto dto);
    Task<ServiceResult<DocumentoDto>> SubirArchivoAsync(int id, Stream archivo, string nombreOriginal, int idUsuario);
    Task<ServiceResult<string>> ObtenerRutaArchivoAsync(int id);
    Task<ServiceResult<bool>> EliminarAsync(int id);
}