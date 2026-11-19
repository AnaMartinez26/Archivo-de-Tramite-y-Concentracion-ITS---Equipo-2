using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Workflow;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

// Control de Flujo de Información (Workflow de Aprobación)
[ApiController]
[Route("api/workflow")]
[Authorize]
public class WorkflowController : ControllerBase
{
    private readonly ITramiteService _tramites;
    public WorkflowController(ITramiteService tramites) => _tramites = tramites;

    // Id del usuario autenticado (0 si el token no trae el claim)
    private int UsuarioId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    // GET api/workflow?estado=Pendiente
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos([FromQuery] string? estado = null) =>
        Ok(ApiResponse<List<TramiteDto>>.Ok(await _tramites.ObtenerTodosAsync(estado)));

    // GET api/workflow/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var r = await _tramites.ObtenerPorIdAsync(id);
        return r.Exito ? Ok(ApiResponse<TramiteDto>.Ok(r.Data!))
                       : StatusCode(r.StatusCode, ApiResponse<TramiteDto>.Fail(r.Mensaje));
    }

    // POST api/workflow
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearTramiteDto dto)
    {
        if (UsuarioId == 0) return Unauthorized(ApiResponse<TramiteDto>.Fail("Token inválido."));
        var r = await _tramites.CrearAsync(dto, UsuarioId);
        return r.Exito ? StatusCode(r.StatusCode, ApiResponse<TramiteDto>.Ok(r.Data!, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<TramiteDto>.Fail(r.Mensaje));
    }

    // PATCH api/workflow/5/estado  -> aprobar, rechazar o reenviar a revisión
    [HttpPatch("{id:int}/estado")]
    [Authorize(Roles = "Administrador,Encargada de Archivo,Directivo")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] ActualizarTramiteDto dto)
    {
        if (UsuarioId == 0) return Unauthorized(ApiResponse<TramiteDto>.Fail("Token inválido."));
        var r = await _tramites.CambiarEstadoAsync(id, dto, UsuarioId);
        return r.Exito ? Ok(ApiResponse<TramiteDto>.Ok(r.Data!, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<TramiteDto>.Fail(r.Mensaje));
    }

    // DELETE api/workflow/5
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador,Encargada de Archivo")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var r = await _tramites.EliminarAsync(id);
        return r.Exito ? Ok(ApiResponse<bool>.Ok(true, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<bool>.Fail(r.Mensaje));
    }
}
