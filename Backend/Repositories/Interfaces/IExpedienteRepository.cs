
using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IExpedienteRepository
{
    Task<List<Expediente>> ObtenerTodosAsync();
    Task<Expediente?> ObtenerPorIdAsync(int id);
    Task<bool> ExisteNumeroAsync(string numero);
    Task AgregarAsync(Expediente expediente);
    Task GuardarCambiosAsync();
}
