using Backend.Data;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class PrestamoRepository : IPrestamoRepository
{
    private readonly AppDbContext _db;
    public PrestamoRepository(AppDbContext db) => _db = db;

    public Task<List<Prestamo>> ObtenerTodosAsync() =>
        _db.Prestamos.AsNoTracking()
           .Include(p => p.Expediente)
           .Include(p => p.Solicitante)
           .OrderByDescending(p => p.Id)
           .ToListAsync();

    public Task<Prestamo?> ObtenerDetalleAsync(int id) =>
        _db.Prestamos.AsNoTracking()
           .Include(p => p.Expediente)
           .Include(p => p.Solicitante)
           .FirstOrDefaultAsync(p => p.Id == id);

    public Task<Prestamo?> ObtenerPorIdAsync(int id) =>
        _db.Prestamos.FirstOrDefaultAsync(p => p.Id == id);

    public Task<bool> ExisteFolioAsync(string folio) =>
        _db.Prestamos.AnyAsync(p => p.FolioPaseSalida == folio);

    // Préstamo sin devolver de ese expediente (si lo hay)
    public Task<Prestamo?> ObtenerActivoDeExpedienteAsync(int idExpediente) =>
        _db.Prestamos.AsNoTracking()
           .FirstOrDefaultAsync(p => p.IdExpediente == idExpediente
                                     && p.Estado != EstadoPrestamo.Devuelto);

    public Task<Expediente?> ObtenerExpedientePorNumeroAsync(string numeroExpediente) =>
        _db.Expedientes.AsNoTracking()
           .FirstOrDefaultAsync(e => e.NumeroExpediente == numeroExpediente);

    public Task<Usuario?> ObtenerUsuarioPorNumEmpleadoAsync(int numEmpleado) =>
        _db.Usuarios.AsNoTracking()
           .FirstOrDefaultAsync(u => u.NumEmpleado == numEmpleado);

    public async Task AgregarAsync(Prestamo prestamo) =>
        await _db.Prestamos.AddAsync(prestamo);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
