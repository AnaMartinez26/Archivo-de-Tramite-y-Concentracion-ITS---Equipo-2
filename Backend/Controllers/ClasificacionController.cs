
using Backend.Models.DTOs.Clasificacion;
using Backend.Models.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/clasificaciones")]
[Authorize]
public class ClasificacionController : ControllerBase
{
    private readonly IClasificacionService _clasificaciones;

    public ClasificacionController(IClasificacionService clasificaciones)
    {
        _clasificaciones = clasificaciones;
    }

    // GET api/clasificaciones
    [HttpGet]
    public async Task<IActionResult> ObtenerTodas()
    {
        var clasificaciones = await _clasificaciones.ObtenerTodasAsync();

        return Ok(
            ApiResponse<List<ClasificacionDto>>.Ok(clasificaciones));
    }

    // POST api/clasificaciones
    [HttpPost]
    public async Task<IActionResult> Crear(
        [FromBody] CrearClasificacionDto dto)
    {
        var resultado = await _clasificaciones.CrearAsync(dto);

        return resultado.Exito
            ? StatusCode(
                resultado.StatusCode,
                ApiResponse<ClasificacionDto>.Ok(
                    resultado.Data!,
                    resultado.Mensaje))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<ClasificacionDto>.Fail(
                    resultado.Mensaje));
    }

    // PUT api/clasificaciones/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(
        int id,
        [FromBody] ActualizarClasificacionDto dto)
    {
        var resultado = await _clasificaciones.ActualizarAsync(id, dto);

        return resultado.Exito
            ? Ok(ApiResponse<ClasificacionDto>.Ok(
                resultado.Data!,
                resultado.Mensaje))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<ClasificacionDto>.Fail(
                    resultado.Mensaje));
    }

    // DELETE api/clasificaciones/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var resultado = await _clasificaciones.EliminarAsync(id);

        return resultado.Exito
            ? Ok(ApiResponse<bool>.Ok(
                resultado.Data,
                resultado.Mensaje))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<bool>.Fail(
                    resultado.Mensaje));
    }
}
