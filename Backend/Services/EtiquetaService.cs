using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Etiquetado;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class EtiquetaService : IEtiquetaService
{
    private readonly IEtiquetaRepository _repository;

    public EtiquetaService(IEtiquetaRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EtiquetaDto>> ObtenerTodasAsync()
    {
        var etiquetas = await _repository.ObtenerTodasAsync();

        return etiquetas.Select(MapearDto).ToList();
    }

    public async Task<ServiceResult<EtiquetaDto>> GenerarAsync(
        CrearEtiquetaDto dto)
    {
        var expediente = await _repository.ObtenerExpedientePorIdAsync(
            dto.IdExpediente);

        if (expediente == null)
        {
            return ServiceResult<EtiquetaDto>.Error(
                "No se encontró el expediente indicado.", 404);
        }

        var etiqueta = new Etiqueta
        {
            IdExpediente = expediente.Id
        };

        try
        {
            await _repository.AgregarAsync(etiqueta);
            await _repository.GuardarCambiosAsync();

            etiqueta.Expediente = expediente;

            return ServiceResult<EtiquetaDto>.Ok(
                MapearDto(etiqueta),
                "Etiqueta generada y registrada correctamente.",
                201);
        }
        catch (DbUpdateException)
        {
            return ServiceResult<EtiquetaDto>.Error(
                "No fue posible registrar la generación de la etiqueta.", 500);
        }
    }

    private static EtiquetaDto MapearDto(Etiqueta etiqueta)
    {
        var numero = etiqueta.Expediente.NumeroExpediente;

        return new EtiquetaDto
        {
            Id = etiqueta.Id,
            IdExpediente = etiqueta.IdExpediente,
            NumeroExpediente = numero,
            Titulo = etiqueta.Expediente.Titulo,
            CodigoEtiqueta = $"ETQ-{numero.Replace(" ", "-")}",
            FechaGeneracion = etiqueta.FechaGeneracion
        };
    }
}