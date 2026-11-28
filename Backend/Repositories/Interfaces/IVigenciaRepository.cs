using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

// Las vigencias viven en la tabla expedientes (fecha_apertura / fecha_cierre)
public interface IVigenciaRepository
{
    Task<List<Expediente>> ObtenerConVigenciaAsync();
    Task<Expediente?> ObtenerPorIdAsync(int id);
    Task<Expediente?> ObtenerPorNumeroAsync(string numeroExpediente);
    Task<bool> ExisteNumeroAsync(string numeroExpediente, int? excluirId = null);
    Task AgregarAsync(Expediente expediente);
    Task GuardarCambiosAsync();
}
