
using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ExpedienteRepository : IExpedienteRepository
{
    private readonly AppDbContext _db;

    public ExpedienteRepository(AppDbContext db) => _db = db;

    public Task<List<Expediente>> ObtenerTodosAsync() =>
        _db.Expedientes
            .AsNoTracking()
            .Include(e => e.Caja)
            .Include(e => e.Clasificacion)
            .OrderByDescending(e => e.FechaCreacion)
            .ToListAsync();

    public Task<Expediente?> ObtenerPorIdAsync(int id) =>
        _db.Expedientes
            .Include(e => e.Caja)
            .Include(e => e.Clasificacion)
            .FirstOrDefaultAsync(e => e.Id == id);

    public Task<bool> ExisteNumeroAsync(string numero) =>
        _db.Expedientes.AnyAsync(e => e.NumeroExpediente == numero);

    public async Task AgregarAsync(Expediente expediente) =>
        await _db.Expedientes.AddAsync(expediente);

    public Task GuardarCambiosAsync() =>
        _db.SaveChangesAsync();
}
