using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface ICajaRepository
{
    Task<List<Caja>> ObtenerTodasAsync();
    Task<Caja?> ObtenerPorIdAsync(int id);
    Task<Caja?> ObtenerPorNumeroAsync(int numero);
    Task<bool> ExisteNumeroAsync(int numero);
    Task<bool> ExisteCodigoAsync(string codigo);

    // idCaja -> cantidad de expedientes dentro
    Task<Dictionary<int, int>> ContarExpedientesPorCajaAsync();
    Task<int> ContarExpedientesAsync(int idCaja);

    Task AgregarAsync(Caja caja);
    Task GuardarCambiosAsync();
}
