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
           .Include(d => d.Expediente)
           .OrderByDescending(d => d.FechaDigitalizacion)
           .ToListAsync();

    public Task<Documento?> ObtenerPorIdAsync(int id) =>
        _db.Documentos
           .Include(d => d.UsuarioDigitalizo)
           .Include(d => d.Expediente)
           .FirstOrDefaultAsync(d => d.Id == id);

    public Task<Documento?> ObtenerPorFolioAsync(string folio) =>
        _db.Documentos.FirstOrDefaultAsync(d => d.Folio == folio);

    public Task<bool> ExisteFolioAsync(string folio) =>
        _db.Documentos.AnyAsync(d => d.Folio == folio);

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

    public async Task AgregarAsync(Documento documento) =>
        await _db.Documentos.AddAsync(documento);

    public void Eliminar(Documento documento) =>
        _db.Documentos.Remove(documento);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
