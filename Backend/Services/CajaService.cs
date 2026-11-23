using Backend.Models.DTOs.Almacenamiento;
using Backend.Models.DTOs.Common;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class CajaService : ICajaService
{
    private readonly ICajaRepository _cajas;

    public CajaService(ICajaRepository cajas) => _cajas = cajas;

    public async Task<List<UbicacionFisicaDto>> ObtenerTodasAsync()
    {
        var cajas = await _cajas.ObtenerTodasAsync();
        var ocupacion = await _cajas.ContarExpedientesPorCajaAsync();

        return cajas
            .Select(c => ToDto(c, ocupacion.GetValueOrDefault(c.Id)))
            .ToList();
    }

    public async Task<ServiceResult<UbicacionFisicaDto>> CrearAsync(CrearCajaDto dto)
    {
        var codigo = dto.CodigoEtiqueta.Trim();

        if (await _cajas.ExisteNumeroAsync(dto.CajaNumero))
            return ServiceResult<UbicacionFisicaDto>.Error(
                "Ya existe una caja con ese número.", 409);

        if (await _cajas.ExisteCodigoAsync(codigo))
            return ServiceResult<UbicacionFisicaDto>.Error(
                "Ya existe una caja con ese código de etiqueta.", 409);

        var caja = new Caja
        {
            CajaNumero = dto.CajaNumero,
            CodigoEtiqueta = codigo,
            UbicacionPasilloEstanteBateria = dto.UbicacionPasilloEstanteBateria.Trim(),
            Capacidad = dto.Capacidad,
            Estado = dto.Estado
        };

        try
        {
            await _cajas.AgregarAsync(caja);
            await _cajas.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<UbicacionFisicaDto>.Error(
                "No se pudo registrar: el número o el código de la caja ya existe.", 409);
        }

        return ServiceResult<UbicacionFisicaDto>.Ok(
            ToDto(caja, 0),
            "Ubicación física asignada correctamente.",
            201);
    }

    public async Task<ServiceResult<UbicacionFisicaDto>> MoverAsync(
        int id, MoverUbicacionDto dto)
    {
        var caja = await _cajas.ObtenerPorIdAsync(id);

        if (caja is null)
            return ServiceResult<UbicacionFisicaDto>.Error(
                "Caja no encontrada.", 404);

        caja.UbicacionPasilloEstanteBateria = dto.Ubicacion.Trim();

        await _cajas.GuardarCambiosAsync();

        var ocupados = await _cajas.ContarExpedientesAsync(caja.Id);

        return ServiceResult<UbicacionFisicaDto>.Ok(
            ToDto(caja, ocupados),
            "Ubicación actualizada correctamente.");
    }

    private static UbicacionFisicaDto ToDto(Caja c, int ocupacion) => new()
    {
        Id = c.Id,
        CajaNumero = c.CajaNumero,
        CodigoEtiqueta = c.CodigoEtiqueta ?? string.Empty,
        UbicacionPasilloEstanteBateria = c.UbicacionPasilloEstanteBateria,
        Capacidad = c.Capacidad,
        Estado = c.Estado,
        Ocupacion = ocupacion
    };
}