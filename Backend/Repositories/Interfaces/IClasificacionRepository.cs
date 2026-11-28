using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IClasificacionRepository
{
    Task<List<Clasificacion>> ObtenerTodasAsync();
    Task<Clasificacion?> ObtenerPorIdAsync(int id);

    Task<bool> TieneHijasAsync(int id);
    Task<bool> TieneExpedientesAsync(int id);
    
    Task AgregarAsync(Clasificacion clasificacion);

    void Eliminar(Clasificacion clasificacion);

    Task GuardarCambiosAsync();
}