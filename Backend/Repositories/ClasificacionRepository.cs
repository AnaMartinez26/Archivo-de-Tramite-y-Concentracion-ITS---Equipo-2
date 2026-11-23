using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ClasificacionRepository : IClasificacionRepository
{
    private readonly AppDbContext _db;

    public ClasificacionRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Clasificacion>> ObtenerTodasAsync() =>
        _db.Clasificaciones
            .AsNoTracking()
            .Include(c => c.Padre)
            .Include(c => c.Hijas)
            .OrderBy(c => c.Nombre)
            .ToListAsync();

    public Task<Clasificacion?> ObtenerPorIdAsync(int id) =>
        _db.Clasificaciones
            .Include(c => c.Padre)
            .Include(c => c.Hijas)
            .FirstOrDefaultAsync(c => c.Id == id);

    public Task<bool> TieneHijasAsync(int id) =>
        _db.Clasificaciones.AnyAsync(c => c.IdPadre == id);

    public Task<bool> TieneExpedientesAsync(int id) =>
        _db.Expedientes.AnyAsync(e => e.IdClasificacion == id);

    public async Task AgregarAsync(Clasificacion clasificacion) =>
        await _db.Clasificaciones.AddAsync(clasificacion);

    public void Eliminar(Clasificacion clasificacion) =>
        _db.Clasificaciones.Remove(clasificacion);

    public Task GuardarCambiosAsync() =>
        _db.SaveChangesAsync();
}