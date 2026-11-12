using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class DocumentoRepository : IDocumentoRepository
{
    private readonly AppDbContext _db;
    public DocumentoRepository(AppDbContext db) => _db = db;

    public Task<List<Documento>> ObtenerTodosAsync() =>
        _db.Documentos.AsNoTracking()
           .Include(d => d.UsuarioDigitalizo)
           .OrderByDescending(d => d.FechaDigitalizacion)
           .ToListAsync();

    public Task<Documento?> ObtenerPorIdAsync(int id) =>
        _db.Documentos.Include(d => d.UsuarioDigitalizo)
           .FirstOrDefaultAsync(d => d.Id == id);

    public Task<Documento?> ObtenerPorFolioAsync(string folio) =>
        _db.Documentos.FirstOrDefaultAsync(d => d.Folio == folio);

    public Task<bool> ExisteFolioAsync(string folio) =>
        _db.Documentos.AnyAsync(d => d.Folio == folio);

    public async Task AgregarAsync(Documento documento) =>
        await _db.Documentos.AddAsync(documento);

    public void Eliminar(Documento documento) =>
        _db.Documentos.Remove(documento);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}