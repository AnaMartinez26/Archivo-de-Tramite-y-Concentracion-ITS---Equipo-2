using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Disposicion;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/disposicion")]
[Authorize]
public class DisposicionController : ControllerBase
{
    private readonly IDisposicionService _disp;

    public DisposicionController(IDisposicionService disp)
    {
        _disp = disp;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerTodas()
    {
        var registros = await _disp.ObtenerTodosAsync();

        return Ok(ApiResponse<List<DisposicionDto>>.Ok(registros));
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,Encargada de Archivo")]
    public async Task<IActionResult> Crear(
        [FromBody] CrearDisposicionDto dto)
    {
        var resultado = await _disp.CrearAsync(dto);

        if (!resultado.Exito)
        {
            return StatusCode(
                resultado.StatusCode,
                ApiResponse<DisposicionDto>.Fail(resultado.Mensaje));
        }

        return StatusCode(
            resultado.StatusCode,
            ApiResponse<DisposicionDto>.Ok(
                resultado.Data!,
                resultado.Mensaje));
    }

    [HttpPost("acta-baja")]
    [Authorize(Roles = "Administrador,Encargada de Archivo")]
    public async Task<IActionResult> GenerarActaBaja(
        [FromBody] SeleccionDisposicionDto dto)
    {
        var resultado = await _disp.GenerarActaBajaAsync(dto.Ids);

        if (!resultado.Exito)
        {
            return StatusCode(
                resultado.StatusCode,
                ApiResponse<ActaBajaDto>.Fail(resultado.Mensaje));
        }

        return Ok(
            ApiResponse<ActaBajaDto>.Ok(
                resultado.Data!,
                resultado.Mensaje));
    }

    [HttpPost("autorizar-transferencia")]
    [Authorize(Roles = "Administrador,Encargada de Archivo,Directivo")]
    public async Task<IActionResult> AutorizarTransferencia(
        [FromBody] SeleccionDisposicionDto dto)
    {
        var identificador = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(identificador, out var usuarioId))
        {
            return Unauthorized(
                ApiResponse<List<DisposicionDto>>.Fail(
                    "No fue posible identificar al usuario autenticado."));
        }

        var resultado = await _disp.AutorizarTransferenciaAsync(
            dto.Ids,
            usuarioId);

        if (!resultado.Exito)
        {
            return StatusCode(
                resultado.StatusCode,
                ApiResponse<List<DisposicionDto>>.Fail(resultado.Mensaje));
        }

        return Ok(
            ApiResponse<List<DisposicionDto>>.Ok(
                resultado.Data!,
                resultado.Mensaje));
    }
}