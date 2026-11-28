using Backend.Helpers;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Prestamos;
using Backend.Models.Entities;
using Backend.Models.Enums;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class PrestamoService : IPrestamoService
{
    private readonly IPrestamoRepository _repo;
    public PrestamoService(IPrestamoRepository repo) => _repo = repo;

    public async Task<List<PrestamoDto>> ObtenerTodosAsync()
    {
        var hoy = DateTime.Today;
        return (await _repo.ObtenerTodosAsync()).Select(p => ToDto(p, hoy)).ToList();
    }

    public async Task<ServiceResult<PrestamoDto>> RegistrarSalidaAsync(CrearPrestamoDto dto, int idUsuarioRegistra)
    {
        var folio = dto.FolioPaseSalida.Trim();
        var numeroExp = dto.NumeroExpediente.Trim();
        var textoEmpleado = dto.NumeroEmpleado.Trim();

        if (string.IsNullOrWhiteSpace(folio))
            return Error("El folio del pase de salida es obligatorio.", 400);
        if (string.IsNullOrWhiteSpace(numeroExp))
            return Error("El número de expediente es obligatorio.", 400);
        if (!int.TryParse(textoEmpleado, out var numEmpleado) || numEmpleado <= 0)
            return Error("El número de empleado debe ser un número válido.", 400);

        var salida = (dto.FechaSalida ?? DateTime.Today).Date;
        var regreso = dto.FechaRegreso?.Date;

        if (salida.Year < 1900 || salida.Year > 2100 || (regreso is not null && (regreso.Value.Year < 1900 || regreso.Value.Year > 2100)))
            return Error("Las fechas deben estar entre los años 1900 y 2100.", 400);
        if (regreso is not null && regreso.Value < salida)
            return Error("La fecha de regreso no puede ser anterior a la fecha de salida.", 400);

        if (await _repo.ExisteFolioAsync(folio))
            return Error($"Ya existe un pase de salida con el folio {folio}.", 409);

        var expediente = await _repo.ObtenerExpedientePorNumeroAsync(numeroExp);
        if (expediente is null)
            return Error($"El expediente {numeroExp} no existe. Regístralo primero en Vigencias o en Digitalización.", 400);

        var solicitante = await _repo.ObtenerUsuarioPorNumEmpleadoAsync(numEmpleado);
        if (solicitante is null)
            return Error($"No existe un empleado con el número {numEmpleado}.", 400);
        if (solicitante.Estado != "Activo")
            return Error($"El empleado {numEmpleado} está inactivo y no puede solicitar préstamos.", 400);

        var activo = await _repo.ObtenerActivoDeExpedienteAsync(expediente.Id);
        if (activo is not null)
            return Error(
                $"El expediente {numeroExp} ya está en préstamo (folio {activo.FolioPaseSalida}). Registra su devolución antes de prestarlo de nuevo.", 409);

        var prestamo = new Prestamo
        {
            FolioPaseSalida = folio,
            IdExpediente = expediente.Id,
            IdSolicitante = solicitante.Id,
            TipoMovimiento = TipoMovimientoPrestamo.Prestamo,
            FechaSalida = salida,
            FechaRegreso = regreso,
            Motivo = string.IsNullOrWhiteSpace(dto.Motivo) ? null : dto.Motivo.Trim(),
            Estado = EstadoPrestamo.EnPrestamo,
            IdUsuarioRegistra = idUsuarioRegistra > 0 ? idUsuarioRegistra : null,
            FechaRegistro = DateTime.Now
        };
        await _repo.AgregarAsync(prestamo);

        var errorGuardar = await GuardarAsync();
        if (errorGuardar is not null) return errorGuardar;

        return await RespuestaAsync(prestamo.Id, "Salida registrada.", 201);
    }

    public async Task<ServiceResult<PrestamoDto>> RegistrarDevolucionAsync(int id)
    {
        var prestamo = await _repo.ObtenerPorIdAsync(id);
        if (prestamo is null)
            return Error("Préstamo no encontrado.", 404);
        if (prestamo.Estado == EstadoPrestamo.Devuelto)
            return Error($"El préstamo {prestamo.FolioPaseSalida} ya fue devuelto.", 409);

        prestamo.Estado = EstadoPrestamo.Devuelto;
        prestamo.TipoMovimiento = TipoMovimientoPrestamo.Devolucion;
        prestamo.FechaDevolucion = DateTime.Today;

        var errorGuardar = await GuardarAsync();
        if (errorGuardar is not null) return errorGuardar;

        return await RespuestaAsync(id, "Devolución registrada.");
    }

    public async Task<ServiceResult<PrestamoDto>> ExtenderPlazoAsync(int id, ActualizarPrestamoDto dto)
    {
        var prestamo = await _repo.ObtenerPorIdAsync(id);
        if (prestamo is null)
            return Error("Préstamo no encontrado.", 404);
        if (prestamo.Estado == EstadoPrestamo.Devuelto)
            return Error("No se puede extender el plazo de un préstamo que ya fue devuelto.", 409);
        if (dto.NuevaFechaRegreso is null)
            return Error("La nueva fecha de regreso es obligatoria.", 400);

        var nueva = dto.NuevaFechaRegreso.Value.Date;
        if (nueva.Year < 1900 || nueva.Year > 2100)
            return Error("Las fechas deben estar entre los años 1900 y 2100.", 400);

        var actual = (prestamo.FechaRegreso ?? prestamo.FechaSalida).Date;
        if (nueva <= actual)
            return Error($"La nueva fecha de regreso debe ser posterior a la actual ({actual:dd/MM/yyyy}).", 400);
        if (nueva < DateTime.Today)
            return Error("La nueva fecha de regreso no puede estar en el pasado.", 400);

        prestamo.FechaRegreso = nueva;
        prestamo.Estado = EstadoPrestamo.EnProrroga;
        prestamo.TipoMovimiento = TipoMovimientoPrestamo.Prorroga;

        var errorGuardar = await GuardarAsync();
        if (errorGuardar is not null) return errorGuardar;

        return await RespuestaAsync(id, "Plazo extendido.");
    }

    // Vuelve a leer el préstamo (con expediente y solicitante) para armar la respuesta
    private async Task<ServiceResult<PrestamoDto>> RespuestaAsync(int id, string mensaje, int statusCode = 200)
    {
        var detalle = await _repo.ObtenerDetalleAsync(id);
        return detalle is null
            ? Error("Préstamo no encontrado.", 404)
            : ServiceResult<PrestamoDto>.Ok(ToDto(detalle, DateTime.Today), mensaje, statusCode);
    }

    private async Task<ServiceResult<PrestamoDto>?> GuardarAsync()
    {
        try
        {
            await _repo.GuardarCambiosAsync();
            return null;
        }
        catch (DbUpdateException ex) when (SqlExceptionHelper.EsClaveDuplicada(ex))
        {
            return Error("Ya existe un pase de salida con ese folio.", 409);
        }
        catch (DbUpdateException)
        {
            return Error("No se pudo guardar el movimiento. Revisa los datos e inténtalo de nuevo.", 400);
        }
    }

    private static ServiceResult<PrestamoDto> Error(string mensaje, int statusCode) =>
        ServiceResult<PrestamoDto>.Error(mensaje, statusCode);

    // "Vencido" no se guarda: se calcula cuando la fecha de regreso ya pasó y no se ha devuelto
    private static string EstadoVisible(Prestamo p, DateTime hoy) =>
        p.Estado != EstadoPrestamo.Devuelto && p.FechaRegreso is not null && p.FechaRegreso.Value.Date < hoy.Date
            ? EstadoPrestamo.Vencido
            : p.Estado;

    private static PrestamoDto ToDto(Prestamo p, DateTime hoy) => new()
    {
        Id = p.Id,
        FolioPaseSalida = p.FolioPaseSalida,
        IdExpediente = p.IdExpediente,
        NumeroExpediente = p.Expediente?.NumeroExpediente ?? string.Empty,
        NumeroEmpleado = p.Solicitante?.NumEmpleado ?? 0,
        NombreSolicitante = p.Solicitante is null
            ? string.Empty
            : $"{p.Solicitante.Nombre} {p.Solicitante.ApellidoP}".Trim(),
        TipoMovimiento = p.TipoMovimiento,
        FechaSalida = p.FechaSalida,
        FechaRegreso = p.FechaRegreso,
        FechaDevolucion = p.FechaDevolucion,
        Motivo = p.Motivo,
        Estado = EstadoVisible(p, hoy)
    };
}
