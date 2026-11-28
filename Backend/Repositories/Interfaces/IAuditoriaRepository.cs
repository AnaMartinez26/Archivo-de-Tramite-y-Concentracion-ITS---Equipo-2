using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IAuditoriaRepository
{
    Task<List<Auditoria>> ObtenerTodosAsync(string? accion = null, DateTime? desde = null, DateTime? hasta = null);
    Task AgregarAsync(Auditoria registro);
    Task GuardarCambiosAsync();
    Task<List<Documento>> ObtenerDocumentosConRutaAsync();
    Task<int> ContarTotalDocumentosAsync();
    Task<int> ContarUsuariosActivosSinRolAsync();
    Task<int> ContarTotalRegistrosBitacoraAsync();
}
