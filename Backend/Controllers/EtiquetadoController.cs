using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Etiquetado;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/etiquetado")]
[Authorize]
public class EtiquetadoController : ControllerBase
{
    private readonly IEtiquetaService _service;

    public EtiquetadoController(IEtiquetaService service)
    {
        _service = service;
    }

    [HttpGet("etiquetas")]
    public async Task<IActionResult> ObtenerTodas()
    {
        var etiquetas = await _service.ObtenerTodasAsync();

        return Ok(ApiResponse<List<EtiquetaDto>>.Ok(etiquetas));
    }

    [HttpPost("generar")]
    public async Task<IActionResult> Generar(
        [FromBody] CrearEtiquetaDto dto)
    {
        var resultado = await _service.GenerarAsync(dto);

        if (!resultado.Exito)
        {
            return StatusCode(
                resultado.StatusCode,
                ApiResponse<EtiquetaDto>.Fail(resultado.Mensaje));
        }

        return StatusCode(
            resultado.StatusCode,
            ApiResponse<EtiquetaDto>.Ok(
                resultado.Data!,
                resultado.Mensaje));
    }
}