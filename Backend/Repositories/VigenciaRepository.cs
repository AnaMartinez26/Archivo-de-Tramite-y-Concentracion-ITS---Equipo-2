using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class VigenciaRepository : IVigenciaRepository
{
    private readonly AppDbContext _db;
    public VigenciaRepository(AppDbContext db) => _db = db;

    // Solo los expedientes que ya tienen fecha de vencimiento (los más próximos a vencer primero)
    public Task<List<Expediente>> ObtenerConVigenciaAsync() =>
        _db.Expedientes.AsNoTracking()
           .Where(e => e.FechaCierre != null)
           .OrderBy(e => e.FechaCierre)
           .ThenBy(e => e.Id)
           .ToListAsync();

    public Task<Expediente?> ObtenerPorIdAsync(int id) =>
        _db.Expedientes.FirstOrDefaultAsync(e => e.Id == id);

    public Task<Expediente?> ObtenerPorNumeroAsync(string numeroExpediente) =>
        _db.Expedientes.FirstOrDefaultAsync(e => e.NumeroExpediente == numeroExpediente);

    public Task<bool> ExisteNumeroAsync(string numeroExpediente, int? excluirId = null) =>
        _db.Expedientes.AnyAsync(e => e.NumeroExpediente == numeroExpediente
                                      && (excluirId == null || e.Id != excluirId));

    public async Task AgregarAsync(Expediente expediente) =>
        await _db.Expedientes.AddAsync(expediente);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
