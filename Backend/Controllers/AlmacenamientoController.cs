using Backend.Models.DTOs.Almacenamiento;
using Backend.Models.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/almacenamiento")]
[Authorize]
public class AlmacenamientoController : ControllerBase
{
    private readonly ICajaService _cajas;

    public AlmacenamientoController(ICajaService cajas) => _cajas = cajas;

    // GET api/almacenamiento/cajas
    [HttpGet("cajas")]
    public async Task<IActionResult> ObtenerCajas()
    {
        var cajas = await _cajas.ObtenerTodasAsync();
        return Ok(ApiResponse<List<UbicacionFisicaDto>>.Ok(cajas));
    }

    // POST api/almacenamiento/cajas
    [HttpPost("cajas")]
    public async Task<IActionResult> CrearCaja([FromBody] CrearCajaDto dto)
    {
        var resultado = await _cajas.CrearAsync(dto);
        if (!resultado.Exito)
            return StatusCode(resultado.StatusCode, ApiResponse<UbicacionFisicaDto>.Fail(resultado.Mensaje));

        return StatusCode(201, ApiResponse<UbicacionFisicaDto>.Ok(resultado.Data!, resultado.Mensaje));
    }

    // PUT api/almacenamiento/cajas/5/ubicacion
    [HttpPut("cajas/{id:int}/ubicacion")]
    public async Task<IActionResult> MoverCaja(int id, [FromBody] MoverUbicacionDto dto)
    {
        var resultado = await _cajas.MoverAsync(id, dto);
        return resultado.Exito
            ? Ok(ApiResponse<UbicacionFisicaDto>.Ok(resultado.Data!, resultado.Mensaje))
            : StatusCode(resultado.StatusCode, ApiResponse<UbicacionFisicaDto>.Fail(resultado.Mensaje));
    }
}
