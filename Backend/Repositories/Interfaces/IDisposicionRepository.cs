using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IDisposicionRepository
{
    Task<List<Disposicion>> ObtenerTodosAsync();
    Task<List<Disposicion>> ObtenerPorIdsAsync(List<int> ids);
    Task<List<string>> ObtenerNumerosActaAsync(string prefijo);
    Task AgregarAsync(Disposicion disposicion);
    Task GuardarCambiosAsync();
}