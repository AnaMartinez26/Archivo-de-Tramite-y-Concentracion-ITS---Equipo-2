using Backend.Helpers;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Vigencias;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class VigenciaService : IVigenciaService
{
    private readonly IVigenciaRepository _repo;
    public VigenciaService(IVigenciaRepository repo) => _repo = repo;

    public async Task<List<VigenciaDto>> ObtenerTodosAsync()
    {
        var hoy = DateTime.Today;
        return (await _repo.ObtenerConVigenciaAsync()).Select(e => ToDto(e, hoy)).ToList();
    }

    public async Task<VigenciaResumenDto> ObtenerResumenAsync()
    {
        var hoy = DateTime.Today;
        var lista = (await _repo.ObtenerConVigenciaAsync()).Select(e => ToDto(e, hoy)).ToList();
        return new VigenciaResumenDto
        {
            Vigentes = lista.Count(x => x.Estado == EstadoVigencia.Vigente),
            ProximosAVencer = lista.Count(x => x.Estado == EstadoVigencia.ProximoAVencer),
            Vencidos = lista.Count(x => x.Estado == EstadoVigencia.Vencido),
            NumerosVencidos = lista.Where(x => x.Estado == EstadoVigencia.Vencido)
                                   .Select(x => x.NumeroExpediente).Take(10).ToList()
        };
    }

    // Registra la vigencia de un expediente. Si el número no existe, crea el expediente;
    // si ya existe pero sin fechas (p. ej. lo creó Digitalización), le asigna las fechas.
    public async Task<ServiceResult<VigenciaDto>> RegistrarAsync(CrearVigenciaDto dto)
    {
        var numero = dto.NumeroExpediente.Trim();
        var error = ValidarDatos(numero, dto.FechaInicio, dto.FechaVencimiento);
        if (error is not null) return error;

        var inicio = dto.FechaInicio!.Value.Date;
        var vencimiento = dto.FechaVencimiento!.Value.Date;

        var existente = await _repo.ObtenerPorNumeroAsync(numero);
        if (existente is not null)
        {
            if (existente.FechaCierre is not null)
                return ServiceResult<VigenciaDto>.Error(
                    $"El expediente {numero} ya tiene una vigencia registrada. Usa \"Modificar Vigencia\" para cambiarla.", 409);

            existente.FechaApertura = inicio;
            existente.FechaCierre = vencimiento;

            var errorGuardar = await GuardarAsync();
            if (errorGuardar is not null) return errorGuardar;
            return ServiceResult<VigenciaDto>.Ok(
                ToDto(existente, DateTime.Today), "Vigencia registrada para el expediente existente.");
        }

        var nuevo = new Expediente
        {
            NumeroExpediente = numero,
            Titulo = $"Expediente {numero}",
            Estado = "Activo",
            FechaApertura = inicio,
            FechaCierre = vencimiento
        };
        await _repo.AgregarAsync(nuevo);

        var errorNuevo = await GuardarAsync();
        if (errorNuevo is not null) return errorNuevo;
        return ServiceResult<VigenciaDto>.Ok(ToDto(nuevo, DateTime.Today), "Vigencia registrada.", 201);
    }

    public async Task<ServiceResult<VigenciaDto>> ActualizarAsync(int id, ActualizarVigenciaDto dto)
    {
        var expediente = await _repo.ObtenerPorIdAsync(id);
        if (expediente is null || expediente.FechaCierre is null)
            return ServiceResult<VigenciaDto>.Error("Vigencia no encontrada.", 404);

        var numero = dto.NumeroExpediente.Trim();
        var error = ValidarDatos(numero, dto.FechaInicio, dto.FechaVencimiento);
        if (error is not null) return error;

        if (numero != expediente.NumeroExpediente && await _repo.ExisteNumeroAsync(numero, id))
            return ServiceResult<VigenciaDto>.Error("Ya existe otro expediente con ese número.", 409);

        expediente.NumeroExpediente = numero;
        expediente.FechaApertura = dto.FechaInicio!.Value.Date;
        expediente.FechaCierre = dto.FechaVencimiento!.Value.Date;

        var errorGuardar = await GuardarAsync();
        if (errorGuardar is not null) return errorGuardar;
        return ServiceResult<VigenciaDto>.Ok(ToDto(expediente, DateTime.Today), "Vigencia actualizada.");
    }

    // Reglas compartidas por Registrar y Actualizar. Devuelve null si todo está bien.
    private static ServiceResult<VigenciaDto>? ValidarDatos(string numero, DateTime? inicio, DateTime? vencimiento)
    {
        if (string.IsNullOrWhiteSpace(numero))
            return ServiceResult<VigenciaDto>.Error("El número de expediente es obligatorio.", 400);
        if (inicio is null)
            return ServiceResult<VigenciaDto>.Error("La fecha de inicio es obligatoria.", 400);
        if (vencimiento is null)
            return ServiceResult<VigenciaDto>.Error("La fecha de vencimiento es obligatoria.", 400);

        if (inicio.Value.Year < 1900 || inicio.Value.Year > 2100 ||
            vencimiento.Value.Year < 1900 || vencimiento.Value.Year > 2100)
            return ServiceResult<VigenciaDto>.Error("Las fechas deben estar entre los años 1900 y 2100.", 400);

        if (vencimiento.Value.Date < inicio.Value.Date)
            return ServiceResult<VigenciaDto>.Error(
                "La fecha de vencimiento no puede ser anterior a la fecha de inicio.", 400);

        return null;
    }

    private async Task<ServiceResult<VigenciaDto>?> GuardarAsync()
    {
        try
        {
            await _repo.GuardarCambiosAsync();
            return null;
        }
        catch (DbUpdateException ex) when (SqlExceptionHelper.EsClaveDuplicada(ex))
        {
            return ServiceResult<VigenciaDto>.Error("Ya existe un expediente con ese número.", 409);
        }
        catch (DbUpdateException)
        {
            return ServiceResult<VigenciaDto>.Error(
                "No se pudo guardar la vigencia. Revisa los datos e inténtalo de nuevo.", 400);
        }
    }

    private static VigenciaDto ToDto(Expediente e, DateTime hoy) => new()
    {
        Id = e.Id,
        NumeroExpediente = e.NumeroExpediente,
        Titulo = e.Titulo,
        FechaInicio = e.FechaApertura,
        FechaVencimiento = e.FechaCierre,
        Estado = e.FechaCierre is null ? string.Empty : EstadoVigencia.Calcular(e.FechaCierre.Value, hoy),
        DiasParaVencer = e.FechaCierre is null ? null : (e.FechaCierre.Value.Date - hoy.Date).Days
    };
}