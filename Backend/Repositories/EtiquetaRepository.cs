using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class EtiquetaRepository : IEtiquetaRepository
{
    private readonly AppDbContext _db;

    public EtiquetaRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Etiqueta>> ObtenerTodasAsync()
    {
        return _db.Etiquetas
            .AsNoTracking()
            .Include(e => e.Expediente)
            .OrderByDescending(e => e.FechaGeneracion)
            .ToListAsync();
    }

    public Task<Expediente?> ObtenerExpedientePorIdAsync(int id)
    {
        return _db.Expedientes
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task AgregarAsync(Etiqueta etiqueta)
    {
        await _db.Etiquetas.AddAsync(etiqueta);
    }

    public Task GuardarCambiosAsync()
    {
        return _db.SaveChangesAsync();
    }
}