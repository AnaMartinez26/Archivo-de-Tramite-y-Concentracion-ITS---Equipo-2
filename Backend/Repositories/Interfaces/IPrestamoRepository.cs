using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IPrestamoRepository
{
    Task<List<Prestamo>> ObtenerTodosAsync();
    Task<Prestamo?> ObtenerDetalleAsync(int id);            // sin seguimiento, con expediente y solicitante
    Task<Prestamo?> ObtenerPorIdAsync(int id);              // con seguimiento, para modificar
    Task<bool> ExisteFolioAsync(string folio);
    Task<Prestamo?> ObtenerActivoDeExpedienteAsync(int idExpediente);
    Task<Expediente?> ObtenerExpedientePorNumeroAsync(string numeroExpediente);
    Task<Usuario?> ObtenerUsuarioPorNumEmpleadoAsync(int numEmpleado);
    Task AgregarAsync(Prestamo prestamo);
    Task GuardarCambiosAsync();
}
