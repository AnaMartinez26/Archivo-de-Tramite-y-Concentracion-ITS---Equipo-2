using System.Security.Claims;
using Backend.Models.DTOs.Auditoria;
using Backend.Models.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/auditoria")]
[Authorize(Roles = "Administrador,Encargada de Archivo,Directivo")]
public class AuditoriaController : ControllerBase
{
    private readonly IAuditoriaService _auditoria;
    public AuditoriaController(IAuditoriaService auditoria) => _auditoria = auditoria;

    private int UsuarioId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    private string? IpCliente =>
        HttpContext.Connection.RemoteIpAddress?.ToString();

    // GET api/auditoria?accion=Modificación&desde=2026-01-01&hasta=2026-12-31
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos(
        [FromQuery] string? accion = null,
        [FromQuery] DateTime? desde = null,
        [FromQuery] DateTime? hasta = null)
    {
        var lista = await _auditoria.ObtenerTodosAsync(accion, desde, hasta);
        return Ok(ApiResponse<List<AuditoriaDto>>.Ok(lista));
    }

    // POST api/auditoria
    [HttpPost]
    [Authorize(Roles = "Administrador,Encargada de Archivo")]
    public async Task<IActionResult> Registrar([FromBody] CrearAuditoriaDto dto)
    {
        var r = await _auditoria.RegistrarManualAsync(dto, UsuarioId, IpCliente);
        return r.Exito
            ? StatusCode(r.StatusCode, ApiResponse<AuditoriaDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<AuditoriaDto>.Fail(r.Mensaje));
    }

    // POST api/auditoria/verificar-integridad
    [HttpPost("verificar-integridad")]
    [Authorize(Roles = "Administrador,Encargada de Archivo")]
    public async Task<IActionResult> VerificarIntegridad()
    {
        var resultado = await _auditoria.EjecutarVerificacionIntegridadAsync(UsuarioId, IpCliente);
        return Ok(ApiResponse<VerificacionIntegridadDto>.Ok(resultado, "Verificación de integridad completada."));
    }
}
