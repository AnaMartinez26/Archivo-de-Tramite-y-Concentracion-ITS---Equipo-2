using Backend.Helpers;
using Backend.Models.DTOs.Auditoria;
using Backend.Models.DTOs.Common;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class AuditoriaService : IAuditoriaService
{
    private readonly IAuditoriaRepository _repo;
    private readonly FileStorageHelper _storage;

    public AuditoriaService(IAuditoriaRepository repo, FileStorageHelper storage)
    {
        _repo = repo;
        _storage = storage;
    }

    public async Task<List<AuditoriaDto>> ObtenerTodosAsync(string? accion = null, DateTime? desde = null, DateTime? hasta = null)
    {
        var lista = await _repo.ObtenerTodosAsync(accion, desde, hasta);
        return lista.Select(ToDto).ToList();
    }

    public async Task<ServiceResult<AuditoriaDto>> RegistrarManualAsync(CrearAuditoriaDto dto, int? idUsuario, string? ip)
    {
        var desc = string.IsNullOrWhiteSpace(dto.Periodo)
            ? dto.Descripcion.Trim()
            : $"[Período: {dto.Periodo.Trim()}] {dto.Descripcion.Trim()}";

        var registro = new Auditoria
        {
            FechaHora = DateTime.Now,
            IdUsuario = idUsuario > 0 ? idUsuario : null,
            Accion = string.IsNullOrWhiteSpace(dto.Accion) ? "Auditoría Manual" : dto.Accion.Trim(),
            TablaAfectada = string.IsNullOrWhiteSpace(dto.TablaAfectada) ? "auditoria" : dto.TablaAfectada.Trim(),
            IdRegistro = string.IsNullOrWhiteSpace(dto.IdRegistro) ? null : dto.IdRegistro.Trim(),
            Descripcion = desc.Length > 1000 ? desc[..1000] : desc,
            Ip = ip
        };

        await _repo.AgregarAsync(registro);
        await _repo.GuardarCambiosAsync();

        return ServiceResult<AuditoriaDto>.Ok(ToDto(registro), "Observación de auditoría registrada.", 201);
    }

    public async Task RegistrarEventoAsync(int? idUsuario, string accion, string? tabla, string? idRegistro, string descripcion, string? ip)
    {
        try
        {
            var registro = new Auditoria
            {
                FechaHora = DateTime.Now,
                IdUsuario = idUsuario > 0 ? idUsuario : null,
                Accion = accion.Length > 30 ? accion[..30] : accion,
                TablaAfectada = tabla?.Length > 50 ? tabla[..50] : tabla,
                IdRegistro = idRegistro?.Length > 50 ? idRegistro[..50] : idRegistro,
                Descripcion = descripcion.Length > 1000 ? descripcion[..1000] : descripcion,
                Ip = ip
            };

            await _repo.AgregarAsync(registro);
            await _repo.GuardarCambiosAsync();
        }
        catch
        {
            // No interrumpir la petición principal si falla el log de auditoría
        }
    }

    public async Task<VerificacionIntegridadDto> EjecutarVerificacionIntegridadAsync(int? idUsuario, string? ip)
    {
        var totalDocs = await _repo.ContarTotalDocumentosAsync();
        var docsConRuta = await _repo.ObtenerDocumentosConRutaAsync();
        var usuariosSinRol = await _repo.ContarUsuariosActivosSinRolAsync();
        var totalBitacora = await _repo.ContarTotalRegistrosBitacoraAsync();

        int enDisco = 0;
        int faltantes = 0;
        int corruptos = 0;
        var incidencias = new List<string>();

        foreach (var doc in docsConRuta)
        {
            var rutaAbsoluta = _storage.ObtenerRutaAbsoluta(doc.RutaArchivo!);
            if (rutaAbsoluta is null)
            {
                faltantes++;
                incidencias.Add($"Folio {doc.Folio}: archivo no encontrado en almacenamiento ({doc.RutaArchivo}).");
                continue;
            }

            enDisco++;
            try
            {
                using var fs = new FileStream(rutaAbsoluta, FileMode.Open, FileAccess.Read, FileShare.Read);
                var header = new byte[5];
                int read = await fs.ReadAsync(header, 0, 5);
                if (read < 5 || header[0] != 0x25 || header[1] != 0x50 || header[2] != 0x44 || header[3] != 0x46 || header[4] != 0x2D)
                {
                    corruptos++;
                    incidencias.Add($"Folio {doc.Folio}: cabecera PDF inválida o archivo dañado.");
                }
            }
            catch (Exception ex)
            {
                corruptos++;
                incidencias.Add($"Folio {doc.Folio}: error de lectura ({ex.Message}).");
            }
        }

        string estadoArchivos = (faltantes == 0 && corruptos == 0)
            ? "Vigente"
            : "Vencido";

        string estadoAcceso = usuariosSinRol == 0 ? "Activo" : "Inactivo";
        string estadoBitacora = "Activo";

        var resultado = new VerificacionIntegridadDto
        {
            FechaVerificacion = DateTime.Now,
            TotalDocumentos = totalDocs,
            DocumentosConArchivo = docsConRuta.Count,
            ArchivosEnDisco = enDisco,
            ArchivosFaltantes = faltantes,
            ArchivosCorruptos = corruptos,
            EstadoIntegridadArchivos = estadoArchivos,
            EstadoControlAcceso = estadoAcceso,
            EstadoBitacora = estadoBitacora,
            DetallesIncidencias = incidencias
        };

        var resumenLog = $"Verificación de integridad ejecutada: {enDisco}/{docsConRuta.Count} PDFs íntegros, {faltantes} faltante(s), {corruptos} dañado(s).";
        await RegistrarEventoAsync(idUsuario, "Verificación", "documentos", null, resumenLog, ip);

        return resultado;
    }

    private static AuditoriaDto ToDto(Auditoria a) => new()
    {
        Id = a.Id,
        FechaHora = a.FechaHora,
        IdUsuario = a.IdUsuario,
        Usuario = a.Usuario is not null
            ? $"{a.Usuario.Nombre} {a.Usuario.ApellidoP}".Trim()
            : "Sistema / Automático",
        Accion = a.Accion,
        TablaAfectada = a.TablaAfectada,
        IdRegistro = a.IdRegistro,
        Descripcion = a.Descripcion,
        Ip = a.Ip
    };
}
