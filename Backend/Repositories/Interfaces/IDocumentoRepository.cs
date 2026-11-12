using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IDocumentoRepository
{
   Task<List<Documento>> ObtenerTodosAsync();
    Task<Documento?> ObtenerPorIdAsync(int id);
    Task<Documento?> ObtenerPorFolioAsync(string folio);
    Task<bool> ExisteFolioAsync(string folio);
    Task AgregarAsync(Documento documento);
    void Eliminar(Documento documento);
    Task GuardarCambiosAsync();
}