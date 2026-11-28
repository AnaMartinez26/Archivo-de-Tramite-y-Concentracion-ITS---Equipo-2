using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class AuditoriaRepository : IAuditoriaRepository
{
    private readonly AppDbContext _db;
    public AuditoriaRepository(AppDbContext db) => _db = db;

    public async Task<List<Auditoria>> ObtenerTodosAsync(string? accion = null, DateTime? desde = null, DateTime? hasta = null)
    {
        var query = _db.Auditorias
            .AsNoTracking()
            .Include(a => a.Usuario)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(accion))
            query = query.Where(a => a.Accion == accion.Trim());

        if (desde.HasValue)
            query = query.Where(a => a.FechaHora >= desde.Value.Date);

        if (hasta.HasValue)
        {
            var finDia = hasta.Value.Date.AddDays(1);
            query = query.Where(a => a.FechaHora < finDia);
        }

        return await query
            .OrderByDescending(a => a.FechaHora)
            .ThenByDescending(a => a.Id)
            .Take(500)
            .ToListAsync();
    }

    public async Task AgregarAsync(Auditoria registro) =>
        await _db.Auditorias.AddAsync(registro);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();

    public Task<List<Documento>> ObtenerDocumentosConRutaAsync() =>
        _db.Documentos
           .AsNoTracking()
           .Where(d => d.RutaArchivo != null && d.RutaArchivo != "")
           .ToListAsync();

    public Task<int> ContarTotalDocumentosAsync() =>
        _db.Documentos.CountAsync();

    public Task<int> ContarUsuariosActivosSinRolAsync() =>
        _db.Usuarios.CountAsync(u => u.Estado == "Activo" && u.IdRol <= 0);

    public Task<int> ContarTotalRegistrosBitacoraAsync() =>
        _db.Auditorias.CountAsync();
}
