using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class CajaRepository : ICajaRepository
{
    private readonly AppDbContext _db;
    public CajaRepository(AppDbContext db) => _db = db;

    public Task<List<Caja>> ObtenerTodasAsync() =>
        _db.Cajas.AsNoTracking().OrderBy(c => c.CajaNumero).ToListAsync();

    public Task<Caja?> ObtenerPorIdAsync(int id) =>
        _db.Cajas.FirstOrDefaultAsync(c => c.Id == id);

    public Task<Caja?> ObtenerPorNumeroAsync(int numero) =>
        _db.Cajas.FirstOrDefaultAsync(c => c.CajaNumero == numero);

    public Task<bool> ExisteNumeroAsync(int numero) =>
        _db.Cajas.AnyAsync(c => c.CajaNumero == numero);

    public Task<bool> ExisteCodigoAsync(string codigo) =>
        _db.Cajas.AnyAsync(c => c.CodigoEtiqueta == codigo);

    public async Task<Dictionary<int, int>> ContarExpedientesPorCajaAsync()
    {
        var grupos = await _db.Expedientes.AsNoTracking()
            .Where(e => e.IdCaja != null)
            .GroupBy(e => e.IdCaja!.Value)
            .Select(g => new { IdCaja = g.Key, Total = g.Count() })
            .ToListAsync();

        return grupos.ToDictionary(g => g.IdCaja, g => g.Total);
    }

    public Task<int> ContarExpedientesAsync(int idCaja) =>
        _db.Expedientes.CountAsync(e => e.IdCaja == idCaja);

    public async Task AgregarAsync(Caja caja) =>
        await _db.Cajas.AddAsync(caja);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
