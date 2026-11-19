using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface ITramiteRepository
{
    Task<List<Tramite>> ObtenerTodosAsync(string? estado = null);
    Task<Tramite?> ObtenerPorIdAsync(int id);
    Task<Expediente?> ObtenerExpedientePorNumeroAsync(string numeroExpediente);
    Task<Expediente> CrearExpedienteAsync(string numeroExpediente, string titulo);
    Task<bool> ExisteFolioAsync(string folio);
    Task AgregarAsync(Tramite tramite);
    void Eliminar(Tramite tramite);
    Task GuardarCambiosAsync();
}
