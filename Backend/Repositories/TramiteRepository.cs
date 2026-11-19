using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class TramiteRepository : ITramiteRepository
{
    private readonly AppDbContext _db;
    public TramiteRepository(AppDbContext db) => _db = db;

    public Task<List<Tramite>> ObtenerTodosAsync(string? estado = null)
    {
        var query = _db.Tramites.AsNoTracking()
            .Include(t => t.Expediente)
            .Include(t => t.Solicitante)
            .Include(t => t.UsuarioRevisa)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(estado))
        {
            var filtro = estado.Trim();
            query = query.Where(t => t.Estado == filtro);
        }

        return query.OrderByDescending(t => t.FechaIngreso).ToListAsync();
    }

    public Task<Tramite?> ObtenerPorIdAsync(int id) =>
        _db.Tramites
           .Include(t => t.Expediente)
           .Include(t => t.Solicitante)
           .Include(t => t.UsuarioRevisa)
           .FirstOrDefaultAsync(t => t.Id == id);

    public Task<Expediente?> ObtenerExpedientePorNumeroAsync(string numeroExpediente) =>
        _db.Expedientes.AsNoTracking()
           .FirstOrDefaultAsync(e => e.NumeroExpediente == numeroExpediente);

    public async Task<Expediente> CrearExpedienteAsync(string numeroExpediente, string titulo)
    {
        var expediente = new Expediente
        {
            NumeroExpediente = numeroExpediente,
            Titulo = titulo,
            FechaApertura = DateTime.Today,
            Estado = "Activo"
        };

        await _db.Expedientes.AddAsync(expediente);
        try
        {
            await _db.SaveChangesAsync();
            return expediente;
        }
        catch (DbUpdateException)
        {
            _db.Entry(expediente).State = EntityState.Detached;
            return (await ObtenerExpedientePorNumeroAsync(numeroExpediente))!;
        }
    }

    public Task<bool> ExisteFolioAsync(string folio) =>
        _db.Tramites.AnyAsync(t => t.Folio == folio);

    public async Task AgregarAsync(Tramite tramite) =>
        await _db.Tramites.AddAsync(tramite);

    public void Eliminar(Tramite tramite) => _db.Tramites.Remove(tramite);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
