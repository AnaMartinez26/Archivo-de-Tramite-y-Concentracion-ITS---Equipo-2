
using Backend.Models.DTOs.Clasificacion;
using Backend.Models.DTOs.Common;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ClasificacionService : IClasificacionService
{
    private readonly IClasificacionRepository _clasificaciones;

    public ClasificacionService(IClasificacionRepository clasificaciones)
    {
        _clasificaciones = clasificaciones;
    }

    public async Task<List<ClasificacionDto>> ObtenerTodasAsync()
    {
        var clasificaciones = await _clasificaciones.ObtenerTodasAsync();

        return clasificaciones
            .Select(ToDto)
            .ToList();
    }

    public async Task<ServiceResult<ClasificacionDto>> CrearAsync(
        CrearClasificacionDto dto)
    {
        if (dto.IdPadre.HasValue)
        {
            var padre = await _clasificaciones.ObtenerPorIdAsync(dto.IdPadre.Value);

            if (padre is null)
                return ServiceResult<ClasificacionDto>.Error(
                    "La clasificación padre no existe.", 404);
        }

        var clasificacion = new Clasificacion
        {
            Nombre = dto.Nombre.Trim(),
            IdPadre = dto.IdPadre,
            Descripcion = Normalizar(dto.Descripcion),
            PlazoConservacion = dto.PlazoConservacion,
            DestinoFinal = Normalizar(dto.DestinoFinal),
            FundamentoNormativo = Normalizar(dto.FundamentoNormativo)
        };

        try
        {
            await _clasificaciones.AgregarAsync(clasificacion);
            await _clasificaciones.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<ClasificacionDto>.Error(
                "No se pudo registrar la clasificación. Verifica sus datos y relaciones.", 400);
        }

        var creada = await _clasificaciones.ObtenerPorIdAsync(clasificacion.Id);

        return ServiceResult<ClasificacionDto>.Ok(
            ToDto(creada!),
            "Clasificación registrada correctamente.",
            201);
    }

    public async Task<ServiceResult<ClasificacionDto>> ActualizarAsync(
        int id,
        ActualizarClasificacionDto dto)
    {
        var clasificacion = await _clasificaciones.ObtenerPorIdAsync(id);

        if (clasificacion is null)
            return ServiceResult<ClasificacionDto>.Error(
                "La clasificación no existe.", 404);

        if (dto.IdPadre.HasValue)
        {
            if (dto.IdPadre.Value == id)
                return ServiceResult<ClasificacionDto>.Error(
                    "Una clasificación no puede ser su propia clasificación padre.");

            var padre = await _clasificaciones.ObtenerPorIdAsync(dto.IdPadre.Value);

            if (padre is null)
                return ServiceResult<ClasificacionDto>.Error(
                    "La clasificación padre no existe.", 404);

            var todas = await _clasificaciones.ObtenerTodasAsync();
            var porId = todas.ToDictionary(c => c.Id);

            // Evita asignar como padre a un descendiente.
            var visitados = new HashSet<int>();
            int? actual = padre.Id;

            while (actual.HasValue)
            {
                if (actual.Value == id)
                    return ServiceResult<ClasificacionDto>.Error(
                        "No puedes asignar como padre una clasificación descendiente.");

                if (!visitados.Add(actual.Value))
                    return ServiceResult<ClasificacionDto>.Error(
                        "La estructura actual contiene una relación jerárquica circular.");

                if (!porId.TryGetValue(actual.Value, out var nodo))
                    break;

                actual = nodo.IdPadre;
            }
        }

        clasificacion.Nombre = dto.Nombre.Trim();
        clasificacion.IdPadre = dto.IdPadre;
        clasificacion.Descripcion = Normalizar(dto.Descripcion);
        clasificacion.PlazoConservacion = dto.PlazoConservacion;
        clasificacion.DestinoFinal = Normalizar(dto.DestinoFinal);
        clasificacion.FundamentoNormativo = Normalizar(dto.FundamentoNormativo);

        try
        {
            await _clasificaciones.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<ClasificacionDto>.Error(
                "No se pudieron guardar los cambios de la clasificación.", 400);
        }

        var actualizada = await _clasificaciones.ObtenerPorIdAsync(id);

        return ServiceResult<ClasificacionDto>.Ok(
            ToDto(actualizada!),
            "Clasificación actualizada correctamente.");
    }

    public async Task<ServiceResult<bool>> EliminarAsync(int id)
    {
        var clasificacion = await _clasificaciones.ObtenerPorIdAsync(id);

        if (clasificacion is null)
            return ServiceResult<bool>.Error(
                "La clasificación no existe.", 404);

        if (await _clasificaciones.TieneHijasAsync(id))
            return ServiceResult<bool>.Error(
                "No se puede eliminar: la clasificación tiene subdivisiones.");

        if (await _clasificaciones.TieneExpedientesAsync(id))
            return ServiceResult<bool>.Error(
                "No se puede eliminar: existen expedientes asociados.");

        _clasificaciones.Eliminar(clasificacion);

        try
        {
            await _clasificaciones.GuardarCambiosAsync();
        }
        catch (DbUpdateException)
        {
            return ServiceResult<bool>.Error(
                "No se pudo eliminar la clasificación porque tiene registros relacionados.", 409);
        }

        return ServiceResult<bool>.Ok(
            true,
            "Clasificación eliminada correctamente.");
    }

    private static ClasificacionDto ToDto(Clasificacion c) => new()
    {
        Id = c.Id,
        Nombre = c.Nombre,
        IdPadre = c.IdPadre,
        Padre = c.Padre?.Nombre,
        Descripcion = c.Descripcion,
        PlazoConservacion = c.PlazoConservacion,
        DestinoFinal = c.DestinoFinal,
        FundamentoNormativo = c.FundamentoNormativo,
        CantidadHijas = c.Hijas.Count
    };

    private static string? Normalizar(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
}
