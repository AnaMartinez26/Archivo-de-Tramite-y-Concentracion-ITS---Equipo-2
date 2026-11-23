
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Expedientes;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ExpedienteService : IExpedienteService
{
    private readonly IExpedienteRepository _expedientes;
    private readonly ICajaRepository _cajas;
    private readonly IClasificacionRepository _clasificaciones;

    public ExpedienteService(
        IExpedienteRepository expedientes,
        ICajaRepository cajas,
        IClasificacionRepository clasificaciones)
    {
        _expedientes = expedientes;
        _cajas = cajas;
        _clasificaciones = clasificaciones;
    }

    public async Task<List<ExpedienteDto>> ObtenerTodosAsync()
    {
        var expedientes = await _expedientes.ObtenerTodosAsync();

        return expedientes.Select(ToDto).ToList();
    }

    public async Task<ServiceResult<ExpedienteDto>> CrearAsync(
        CrearExpedienteDto dto)
    {
        var numero = dto.NumeroExpediente.Trim().ToUpperInvariant();

        if (await _expedientes.ExisteNumeroAsync(numero))
            return ServiceResult<ExpedienteDto>.Error(
                "Ya existe un expediente con ese número.", 409);

        if (dto.FechaApertura.HasValue &&
            dto.FechaCierre.HasValue &&
            dto.FechaCierre.Value.Date < dto.FechaApertura.Value.Date)
        {
            return ServiceResult<ExpedienteDto>.Error(
                "La fecha de cierre no puede ser anterior a la fecha de apertura.");
        }

        if (dto.IdClasificacion.HasValue)
        {
            var clasificacion = await _clasificaciones.ObtenerPorIdAsync(
                dto.IdClasificacion.Value);

            if (clasificacion is null)
                return ServiceResult<ExpedienteDto>.Error(
                    "La clasificación seleccionada no existe.", 404);
        }

        int? idCaja = null;

        if (dto.CajaNumero.HasValue)
        {
            var caja = await _cajas.ObtenerPorNumeroAsync(dto.CajaNumero.Value);

            if (caja is null)
                return ServiceResult<ExpedienteDto>.Error(
                    $"La caja {dto.CajaNumero} no existe. Regístrala primero en Almacenamiento Sistematizado.",
                    400);

            if (caja.Estado == "Inactivo")
                return ServiceResult<ExpedienteDto>.Error(
                    $"La caja {caja.CajaNumero} está inactiva.", 400);

            if (caja.Capacidad.HasValue && caja.Capacidad.Value > 0)
            {
                var ocupados = await _cajas.ContarExpedientesAsync(caja.Id);

                if (ocupados >= caja.Capacidad.Value)
                    return ServiceResult<ExpedienteDto>.Error(
                        $"La caja {caja.CajaNumero} alcanzó su capacidad máxima.",
                        400);
            }

            idCaja = caja.Id;
        }

        var expediente = new Expediente
        {
            NumeroExpediente = numero,
            Titulo = dto.Titulo.Trim(),
            IdClasificacion = dto.IdClasificacion,
            IdCaja = idCaja,
            FechaApertura = dto.FechaApertura,
            FechaCierre = dto.FechaCierre,
            Estado = dto.Estado
        };

        try
        {
            await _expedientes.AgregarAsync(expediente);
            await _expedientes.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<ExpedienteDto>.Error(
                "No se pudo registrar el expediente. Verifica sus datos y relaciones.",
                400);
        }

        var creado = await _expedientes.ObtenerPorIdAsync(expediente.Id);

        return ServiceResult<ExpedienteDto>.Ok(
            ToDto(creado!),
            "Expediente registrado correctamente.",
            201);
    }

    private static ExpedienteDto ToDto(Expediente e) => new()
    {
        Id = e.Id,
        NumeroExpediente = e.NumeroExpediente,
        Titulo = e.Titulo,

        // Código calculado para mostrarlo; no se almacena en expedientes.
        CodigoEtiqueta = $"ETQ-{e.NumeroExpediente.Replace(" ", "-")}",

        IdClasificacion = e.IdClasificacion,
        Clasificacion = e.Clasificacion?.Nombre,
        CajaNumero = e.Caja?.CajaNumero,
        FechaApertura = e.FechaApertura,
        FechaCierre = e.FechaCierre,
        Estado = e.Estado,
        FechaCreacion = e.FechaCreacion
    };
}
