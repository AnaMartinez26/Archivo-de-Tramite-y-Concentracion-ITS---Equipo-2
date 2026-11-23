using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IEtiquetaRepository
{
    Task<List<Etiqueta>> ObtenerTodasAsync();
    Task<Expediente?> ObtenerExpedientePorIdAsync(int id);
    Task AgregarAsync(Etiqueta etiqueta);
    Task GuardarCambiosAsync();
}