using Backend.Helpers;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Workflow;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

// Control de Flujo de Información: registro de trámites y workflow de aprobación
public class TramiteService : ITramiteService
{
    // Transiciones permitidas del workflow (estado actual -> estados destino)
    private static readonly Dictionary<string, string[]> Transiciones = new()
    {
        [EstadoTramite.Pendiente] = new[] { EstadoTramite.EnRevision, EstadoTramite.Aprobado, EstadoTramite.Rechazado },
        [EstadoTramite.EnRevision] = new[] { EstadoTramite.Aprobado, EstadoTramite.Rechazado },
        [EstadoTramite.Rechazado] = new[] { EstadoTramite.EnRevision },
        [EstadoTramite.Aprobado] = Array.Empty<string>()
    };

    private readonly ITramiteRepository _tramites;
    private readonly IUsuarioRepository _usuarios;

    public TramiteService(ITramiteRepository tramites, IUsuarioRepository usuarios)
    {
        _tramites = tramites;
        _usuarios = usuarios;
    }

    public async Task<List<TramiteDto>> ObtenerTodosAsync(string? estado = null) =>
        (await _tramites.ObtenerTodosAsync(estado)).Select(ToDto).ToList();

    public async Task<ServiceResult<TramiteDto>> ObtenerPorIdAsync(int id)
    {
        var tramite = await _tramites.ObtenerPorIdAsync(id);
        return tramite is null
            ? ServiceResult<TramiteDto>.Error("Trámite no encontrado.", 404)
            : ServiceResult<TramiteDto>.Ok(ToDto(tramite));
    }

    public async Task<ServiceResult<TramiteDto>> CrearAsync(CrearTramiteDto dto, int idUsuarioActual)
    {
        var folio = dto.Folio.Trim().ToUpperInvariant();
        if (await _tramites.ExisteFolioAsync(folio))
            return ServiceResult<TramiteDto>.Error("Ya existe un trámite con ese folio.", 409);

        // Un trámite nuevo solo puede iniciar como Pendiente o En Revisión;
        // aprobar/rechazar se hace después con el flujo de autorización.
        var estado = string.IsNullOrWhiteSpace(dto.Estado) ? EstadoTramite.Pendiente : dto.Estado.Trim();
        if (estado is not (EstadoTramite.Pendiente or EstadoTramite.EnRevision))
            return ServiceResult<TramiteDto>.Error(
                "Un trámite nuevo solo puede registrarse como \"Pendiente\" o \"En Revisión por Archivo\".", 400);

        var solicitante = await _usuarios.ObtenerPorNumEmpleadoAsync(dto.NumEmpleadoSolicitante);
        if (solicitante is null)
            return ServiceResult<TramiteDto>.Error("No existe un usuario con ese número de empleado.", 404);
        if (solicitante.Estado != "Activo")
            return ServiceResult<TramiteDto>.Error("El solicitante está inactivo.", 400);

        var numeroExpediente = dto.NumeroExpediente.Trim();
        var expediente = await _tramites.ObtenerExpedientePorNumeroAsync(numeroExpediente)
                         ?? await _tramites.CrearExpedienteAsync(
                             numeroExpediente,
                             Limpiar(dto.Solicitud) ?? $"Expediente {numeroExpediente}");

        var tramite = new Tramite
        {
            Folio = folio,
            IdExpediente = expediente.Id,
            IdSolicitante = solicitante.Id,
            Solicitud = Limpiar(dto.Solicitud),
            Estado = estado,
            Observaciones = Limpiar(dto.Observaciones),
            IdUsuarioRevisa = estado == EstadoTramite.EnRevision ? idUsuarioActual : null
        };

        await _tramites.AgregarAsync(tramite);
        try
        {
            await _tramites.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<TramiteDto>.Error("Ya existe un trámite con ese folio.", 409);
        }

        var creado = await _tramites.ObtenerPorIdAsync(tramite.Id);
        return ServiceResult<TramiteDto>.Ok(ToDto(creado!), "Trámite registrado correctamente.", 201);
    }

    public async Task<ServiceResult<TramiteDto>> CambiarEstadoAsync(
        int id, ActualizarTramiteDto dto, int idUsuarioRevisa)
    {
        var tramite = await _tramites.ObtenerPorIdAsync(id);
        if (tramite is null)
            return ServiceResult<TramiteDto>.Error("Trámite no encontrado.", 404);

        var nuevo = dto.Estado.Trim();
        if (!EstadoTramite.EsValido(nuevo))
            return ServiceResult<TramiteDto>.Error("Estado de trámite no válido.", 400);

        if (tramite.Estado == nuevo)
            return ServiceResult<TramiteDto>.Error(
                $"El trámite {tramite.Folio} ya está en \"{nuevo}\".", 409);

        if (!Transiciones.TryGetValue(tramite.Estado, out var destinos) || !destinos.Contains(nuevo))
            return ServiceResult<TramiteDto>.Error(
                $"No se puede pasar el trámite {tramite.Folio} de \"{tramite.Estado}\" a \"{nuevo}\".", 409);

        if (nuevo == EstadoTramite.Aprobado && string.IsNullOrWhiteSpace(dto.FirmaToken))
            return ServiceResult<TramiteDto>.Error(
                "Ingresa la firma electrónica / token para aprobar el trámite.", 400);

        if (nuevo == EstadoTramite.Rechazado && string.IsNullOrWhiteSpace(dto.Observaciones))
            return ServiceResult<TramiteDto>.Error(
                "Ingresa las observaciones o correcciones para rechazar el trámite.", 400);

        tramite.Estado = nuevo;
        tramite.IdUsuarioRevisa = idUsuarioRevisa;

        var obs = Limpiar(dto.Observaciones);
        if (obs is not null) tramite.Observaciones = obs;

        // La firma nunca se guarda en texto plano
        if (nuevo == EstadoTramite.Aprobado)
            tramite.FirmaToken = PasswordHasher.Hash(dto.FirmaToken!.Trim());

        tramite.FechaResolucion = nuevo is EstadoTramite.Aprobado or EstadoTramite.Rechazado
            ? DateTime.Now
            : null;

        await _tramites.GuardarCambiosAsync();

        var actualizado = await _tramites.ObtenerPorIdAsync(id);
        return ServiceResult<TramiteDto>.Ok(ToDto(actualizado!), $"Trámite {tramite.Folio}: {nuevo}.");
    }

    public async Task<ServiceResult<bool>> EliminarAsync(int id)
    {
        var tramite = await _tramites.ObtenerPorIdAsync(id);
        if (tramite is null)
            return ServiceResult<bool>.Error("Trámite no encontrado.", 404);
        if (tramite.Estado == EstadoTramite.Aprobado)
            return ServiceResult<bool>.Error("No se puede eliminar un trámite aprobado.", 409);

        _tramites.Eliminar(tramite);
        await _tramites.GuardarCambiosAsync();
        return ServiceResult<bool>.Ok(true, "Trámite eliminado.");
    }

    private static string? Limpiar(string? texto) =>
        string.IsNullOrWhiteSpace(texto) ? null : texto.Trim();

    // Mapeo manual (mismo estilo que MappingProfile.cs / DocumentoService.cs)
    private static TramiteDto ToDto(Tramite t) => new()
    {
        Id = t.Id,
        Folio = t.Folio,
        IdExpediente = t.IdExpediente,
        NumeroExpediente = t.Expediente?.NumeroExpediente ?? string.Empty,
        IdSolicitante = t.IdSolicitante,
        NumEmpleadoSolicitante = t.Solicitante?.NumEmpleado ?? 0,
        NombreSolicitante = t.Solicitante is not null
            ? $"{t.Solicitante.Nombre} {t.Solicitante.ApellidoP}".Trim()
            : string.Empty,
        Solicitud = t.Solicitud,
        Estado = t.Estado,
        Observaciones = t.Observaciones,
        TieneFirma = !string.IsNullOrEmpty(t.FirmaToken),
        IdUsuarioRevisa = t.IdUsuarioRevisa,
        UsuarioRevisa = t.UsuarioRevisa is not null
            ? $"{t.UsuarioRevisa.Nombre} {t.UsuarioRevisa.ApellidoP}".Trim()
            : null,
        FechaIngreso = t.FechaIngreso,
        FechaResolucion = t.FechaResolucion
    };
}
