using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class DisposicionRepository : IDisposicionRepository
{
    private readonly AppDbContext _db;

    public DisposicionRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Disposicion>> ObtenerTodosAsync()
    {
        return _db.Disposiciones
            .AsNoTracking()
            .Include(d => d.Expediente)
            .OrderByDescending(d => d.FechaRegistro)
            .ToListAsync();
    }

    public Task<List<Disposicion>> ObtenerPorIdsAsync(List<int> ids)
    {
        return _db.Disposiciones
            .Include(d => d.Expediente)
            .Where(d => ids.Contains(d.Id))
            .ToListAsync();
    }

    public Task<List<string>> ObtenerNumerosActaAsync(string prefijo)
    {
        return _db.Disposiciones
            .AsNoTracking()
            .Where(d => d.NumeroActa != null &&
                        d.NumeroActa.StartsWith(prefijo))
            .Select(d => d.NumeroActa!)
            .Distinct()
            .ToListAsync();
    }

    public async Task AgregarAsync(Disposicion disposicion)
    {
        await _db.Disposiciones.AddAsync(disposicion);
    }

    public Task GuardarCambiosAsync()
    {
        return _db.SaveChangesAsync();
    }
}