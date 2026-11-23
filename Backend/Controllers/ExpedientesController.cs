using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Expedientes;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/expedientes")]
[Authorize]
public class ExpedientesController : ControllerBase
{
    private readonly IExpedienteService _expedientes;

    public ExpedientesController(IExpedienteService expedientes) => _expedientes = expedientes;

    // GET api/expedientes
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos() =>
        Ok(ApiResponse<List<ExpedienteDto>>.Ok(await _expedientes.ObtenerTodosAsync()));

    // POST api/expedientes
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearExpedienteDto dto)
    {
        var r = await _expedientes.CrearAsync(dto);
        return r.Exito
            ? StatusCode(r.StatusCode, ApiResponse<ExpedienteDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<ExpedienteDto>.Fail(r.Mensaje));
    }
}
