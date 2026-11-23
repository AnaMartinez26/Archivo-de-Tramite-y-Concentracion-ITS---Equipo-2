using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Disposicion;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class DisposicionService : IDisposicionService
{
    private const string BajaDocumental = "Baja Documental";

    private const string TransferenciaHistorica = "Transferencia Histórica";
    private const string TransferenciaSecundaria = "Transferencia Secundaria";

    private const string DestinoConservacion = "Conservación Permanente";
    private const string DestinoDestruccion = "Destrucción";

    private const string EstadoPendiente = "Pendiente";
    private const string EstadoActa = "Acta generada";
    private const string EstadoAutorizada = "Transferencia autorizada";

    private readonly IDisposicionRepository _disposiciones;
    private readonly IExpedienteRepository _expedientes;

    public DisposicionService(
        IDisposicionRepository disposiciones,
        IExpedienteRepository expedientes)
    {
        _disposiciones = disposiciones;
        _expedientes = expedientes;
    }

    public async Task<List<DisposicionDto>> ObtenerTodosAsync()
    {
        var registros = await _disposiciones.ObtenerTodosAsync();

        return registros.Select(ToDto).ToList();
    }

    public async Task<ServiceResult<DisposicionDto>> CrearAsync(
        CrearDisposicionDto dto)
    {
        var expediente = await _expedientes.ObtenerPorIdAsync(dto.IdExpediente);

        if (expediente is null)
        {
            return ServiceResult<DisposicionDto>.Error(
                "El expediente seleccionado no existe.", 404);
        }

        if (dto.TipoDisposicion == BajaDocumental &&
            dto.DestinoFinal == DestinoConservacion)
        {
            return ServiceResult<DisposicionDto>.Error(
                "Una baja documental no puede tener como destino la conservación permanente.");
        }

        if (dto.DestinoFinal is not null &&
            dto.DestinoFinal != DestinoConservacion &&
            dto.DestinoFinal != DestinoDestruccion)
        {
            return ServiceResult<DisposicionDto>.Error(
                "El destino final indicado no es válido.");
        }

        var disposicion = new Disposicion
        {
            IdExpediente = expediente.Id,
            Expediente = expediente,
            TipoDisposicion = dto.TipoDisposicion.Trim(),
            FechaDisposicion = dto.FechaDisposicion?.Date,
            DestinoFinal = Normalizar(dto.DestinoFinal),
            Observaciones = Normalizar(dto.Observaciones)
        };

        try
        {
            await _disposiciones.AgregarAsync(disposicion);
            await _disposiciones.GuardarCambiosAsync();

            return ServiceResult<DisposicionDto>.Ok(
                ToDto(disposicion),
                "Disposición documental registrada.",
                201);
        }
        catch (DbUpdateException)
        {
            return ServiceResult<DisposicionDto>.Error(
                "No fue posible registrar la disposición documental.", 409);
        }
    }

    public async Task<ServiceResult<ActaBajaDto>> GenerarActaBajaAsync(
        List<int> ids)
    {
        var seleccion = ids.Distinct().ToList();

        if (seleccion.Count == 0)
        {
            return ServiceResult<ActaBajaDto>.Error(
                "Debes seleccionar al menos una disposición.");
        }

        var registros = await _disposiciones.ObtenerPorIdsAsync(seleccion);

        if (registros.Count != seleccion.Count)
        {
            return ServiceResult<ActaBajaDto>.Error(
                "Una o más disposiciones seleccionadas no existen.", 404);
        }

        if (registros.Any(d => d.TipoDisposicion != BajaDocumental))
        {
            return ServiceResult<ActaBajaDto>.Error(
                "El acta solamente puede generarse para bajas documentales.");
        }

        if (registros.Any(d =>
            d.NumeroActa != null || d.IdUsuarioAutoriza != null))
        {
            return ServiceResult<ActaBajaDto>.Error(
                "Una o más disposiciones ya fueron procesadas.");
        }

        var fecha = DateTime.Now;
        var prefijo = $"ACTA-BAJA-{fecha:yyyy}-";

        var numerosExistentes =
            await _disposiciones.ObtenerNumerosActaAsync(prefijo);

        var consecutivo = numerosExistentes
            .Select(n =>
            {
                var parte = n.Substring(prefijo.Length);
                return int.TryParse(parte, out var numero) ? numero : 0;
            })
            .DefaultIfEmpty(0)
            .Max() + 1;

        var numeroActa = $"{prefijo}{consecutivo:D4}";

        foreach (var registro in registros)
        {
            registro.NumeroActa = numeroActa;
        }

        try
        {
            await _disposiciones.GuardarCambiosAsync();

            return ServiceResult<ActaBajaDto>.Ok(
                new ActaBajaDto
                {
                    NumeroActa = numeroActa,
                    FechaGeneracion = fecha,
                    Disposiciones = registros.Select(ToDto).ToList()
                },
                "Acta de baja documental generada.");
        }
        catch (DbUpdateException)
        {
            return ServiceResult<ActaBajaDto>.Error(
                "No fue posible guardar el acta de baja documental.", 409);
        }
    }

    public async Task<ServiceResult<List<DisposicionDto>>> AutorizarTransferenciaAsync(
        List<int> ids,
        int usuarioId)
    {
        var seleccion = ids.Distinct().ToList();

        if (seleccion.Count == 0)
        {
            return ServiceResult<List<DisposicionDto>>.Error(
                "Debes seleccionar al menos una disposición.");
        }

        var registros = await _disposiciones.ObtenerPorIdsAsync(seleccion);

        if (registros.Count != seleccion.Count)
        {
            return ServiceResult<List<DisposicionDto>>.Error(
                "Una o más disposiciones seleccionadas no existen.", 404);
        }

        if (registros.Any(d =>
            d.TipoDisposicion != TransferenciaHistorica &&
            d.TipoDisposicion != TransferenciaSecundaria))
        {
            return ServiceResult<List<DisposicionDto>>.Error(
                "Solamente se pueden autorizar disposiciones de transferencia.");
        }

        if (registros.Any(d =>
            d.IdUsuarioAutoriza != null || d.NumeroActa != null))
        {
            return ServiceResult<List<DisposicionDto>>.Error(
                "Una o más transferencias ya fueron procesadas.");
        }

        foreach (var registro in registros)
        {
            registro.IdUsuarioAutoriza = usuarioId;
        }

        try
        {
            await _disposiciones.GuardarCambiosAsync();

            return ServiceResult<List<DisposicionDto>>.Ok(
                registros.Select(ToDto).ToList(),
                "Transferencia documental autorizada.");
        }
        catch (DbUpdateException)
        {
            return ServiceResult<List<DisposicionDto>>.Error(
                "No fue posible registrar la autorización de la transferencia.", 409);
        }
    }

    private static DisposicionDto ToDto(Disposicion d)
    {
        var estado = d.NumeroActa is not null
            ? EstadoActa
            : d.IdUsuarioAutoriza.HasValue
                ? EstadoAutorizada
                : EstadoPendiente;

        return new DisposicionDto
        {
            Id = d.Id,
            IdExpediente = d.IdExpediente,
            NumeroExpediente = d.Expediente.NumeroExpediente,
            Titulo = d.Expediente.Titulo,
            TipoDisposicion = d.TipoDisposicion,
            FechaDisposicion = d.FechaDisposicion,
            DestinoFinal = d.DestinoFinal,
            Observaciones = d.Observaciones,
            Estado = estado,
            NumeroActa = d.NumeroActa,
            IdUsuarioAutoriza = d.IdUsuarioAutoriza,
            FechaRegistro = d.FechaRegistro
        };
    }

    private static string? Normalizar(string? valor)
    {
        return string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
    }
}