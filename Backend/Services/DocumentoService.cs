using Backend.Helpers;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Digitalizacion;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class DocumentoService : IDocumentoService
{
    private readonly IDocumentoRepository _docs;
    private readonly FileStorageHelper _storage;

    public DocumentoService(IDocumentoRepository docs, FileStorageHelper storage)
    {
        _docs = docs;
        _storage = storage;
    }

    public async Task<List<DocumentoDto>> ObtenerTodosAsync() =>
        (await _docs.ObtenerTodosAsync()).Select(ToDto).ToList();

    public async Task<ServiceResult<DocumentoDto>> ObtenerPorIdAsync(int id)
    {
        var doc = await _docs.ObtenerPorIdAsync(id);
        return doc is null
            ? ServiceResult<DocumentoDto>.Error("Documento no encontrado.", 404)
            : ServiceResult<DocumentoDto>.Ok(ToDto(doc));
    }

    public async Task<ServiceResult<DocumentoDto>> CrearAsync(CrearDocumentoDto dto, int idUsuario)
    {
        var folio = dto.Folio.Trim().ToUpperInvariant();
        if (await _docs.ExisteFolioAsync(folio))
            return ServiceResult<DocumentoDto>.Error("Ya existe un documento con ese folio.", 409);

        var idExpediente = await ResolverExpedienteAsync(dto.NumeroExpediente, dto.Titulo);

        var doc = new Documento
        {
            Folio = folio,
            Titulo = dto.Titulo.Trim(),
            TipoDocumento = Limpiar(dto.TipoDocumento),
            IdExpediente = idExpediente,
            FechaCreacion = dto.FechaCreacion,
            IdUsuarioDigitalizo = idUsuario
        };

        await _docs.AgregarAsync(doc);
        try
        {
            await _docs.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            // Carrera entre ExisteFolioAsync y el INSERT: el índice único lo detiene
            return ServiceResult<DocumentoDto>.Error("Ya existe un documento con ese folio.", 409);
        }

        var creado = await _docs.ObtenerPorIdAsync(doc.Id);
        return ServiceResult<DocumentoDto>.Ok(ToDto(creado!), "Documento registrado.", 201);
    }

    public async Task<ServiceResult<DocumentoDto>> ActualizarAsync(int id, ActualizarDocumentoDto dto)
    {
        var doc = await _docs.ObtenerPorIdAsync(id);
        if (doc is null)
            return ServiceResult<DocumentoDto>.Error("Documento no encontrado.", 404);

        var idExpediente = await ResolverExpedienteAsync(dto.NumeroExpediente, dto.Titulo);

        doc.Titulo = dto.Titulo.Trim();
        doc.TipoDocumento = Limpiar(dto.TipoDocumento);
        doc.IdExpediente = idExpediente;
        doc.FechaCreacion = dto.FechaCreacion;

        await _docs.GuardarCambiosAsync();
        var actualizado = await _docs.ObtenerPorIdAsync(id);
        return ServiceResult<DocumentoDto>.Ok(ToDto(actualizado!), "Documento actualizado.");
    }

    public async Task<ServiceResult<DocumentoDto>> SubirArchivoAsync(
        int id, Stream archivo, string nombreOriginal, int idUsuario)
    {
        var doc = await _docs.ObtenerPorIdAsync(id);
        if (doc is null)
            return ServiceResult<DocumentoDto>.Error("Documento no encontrado.", 404);

        var ext = Path.GetExtension(nombreOriginal).ToLowerInvariant();
        if (ext is not ".pdf")
            return ServiceResult<DocumentoDto>.Error("Solo se admiten archivos PDF.", 400);

        // Validar el contenido real (firma "%PDF-"), no solo la extensión
        var cabezera = new byte[5];
        var leidos = await archivo.ReadAtLeastAsync(cabezera, cabezera.Length, throwOnEndOfStream: false);
        if (leidos < cabezera.Length || !cabezera.SequenceEqual(new byte[]
        {
            0x25, 0x50, 0x44, 0x46, 0x2D // "%PDF-"
        }))
            return ServiceResult<DocumentoDto>.Error("El archivo no es un PDF válido.", 400);

        // Regresar al inicio; si no, el archivo se guarda sin los primeros 5 bytes (PDF corrupto)
        if (archivo.CanSeek)
        {
            archivo.Position = 0;
        }
        else
        {
            var copia = new MemoryStream();
            await copia.WriteAsync(cabezera);
            await archivo.CopyToAsync(copia);
            copia.Position = 0;
            archivo = copia;
        }

        var ruta = await _storage.GuardarAsync(doc.Folio, archivo, ext);

        doc.RutaArchivo = ruta;
        doc.Formato = "PDF";
        doc.FechaDigitalizacion = DateTime.Now;
        doc.IdUsuarioDigitalizo = idUsuario;

        await _docs.GuardarCambiosAsync();
        return ServiceResult<DocumentoDto>.Ok(ToDto(doc), "Archivo subido correctamente.");
    }

    public async Task<ServiceResult<string>> ObtenerRutaArchivoAsync(int id)
    {
        var doc = await _docs.ObtenerPorIdAsync(id);
        if (doc is null)
            return ServiceResult<string>.Error("Documento no encontrado.", 404);
        if (string.IsNullOrEmpty(doc.RutaArchivo))
            return ServiceResult<string>.Error("Este documento no tiene archivo.", 404);

        var ruta = _storage.ObtenerRutaAbsoluta(doc.RutaArchivo);
        return ruta is null
            ? ServiceResult<string>.Error("El archivo no existe en disco.", 404)
            : ServiceResult<string>.Ok(ruta);
    }

    public async Task<ServiceResult<bool>> EliminarAsync(int id)
    {
        var doc = await _docs.ObtenerPorIdAsync(id);
        if (doc is null)
            return ServiceResult<bool>.Error("Documento no encontrado.", 404);

        var ruta = doc.RutaArchivo;

        // Primero la BD; si falla, el archivo sigue en disco
        _docs.Eliminar(doc);
        await _docs.GuardarCambiosAsync();

        if (!string.IsNullOrEmpty(ruta))
            _storage.Eliminar(ruta);

        return ServiceResult<bool>.Ok(true, "Documento eliminado.");
    }

    // Número de expediente (opcional) -> IdExpediente. Vacío = sin expediente.
    // Si aún no existe en dbo.expedientes, se crea automáticamente.
    private async Task<int?> ResolverExpedienteAsync(string? numeroExpediente, string? titulo = null)
    {
        var numero = Limpiar(numeroExpediente);
        if (numero is null) return null;

        var exp = await _docs.ObtenerExpedientePorNumeroAsync(numero)
                  ?? await _docs.CrearExpedienteAsync(
                      numero,
                      Limpiar(titulo) ?? $"Expediente {numero}");

        return exp.Id;
    }

    private static string? Limpiar(string? texto) =>
        string.IsNullOrWhiteSpace(texto) ? null : texto.Trim();

    // Mapeo manual (mismo estilo que MappingProfile.cs)
    private static DocumentoDto ToDto(Documento d) => new()
    {
        Id = d.Id,
        Folio = d.Folio,
        Titulo = d.Titulo,
        TipoDocumento = d.TipoDocumento,
        IdExpediente = d.IdExpediente,
        NumeroExpediente = d.Expediente?.NumeroExpediente,
        RutaArchivo = d.RutaArchivo,
        Formato = d.Formato,
        FechaCreacion = d.FechaCreacion,
        FechaDigitalizacion = d.FechaDigitalizacion,
        UsuarioDigitalizo = d.UsuarioDigitalizo is not null
            ? $"{d.UsuarioDigitalizo.Nombre} {d.UsuarioDigitalizo.ApellidoP}".Trim()
            : null
    };
}