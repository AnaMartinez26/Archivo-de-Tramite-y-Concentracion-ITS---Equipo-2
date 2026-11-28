using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Vigencias;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/vigencias")]
[Authorize]
public class VigenciasController : ControllerBase
{
    // Quién puede registrar o modificar vigencias (mismo criterio que Jerarquización)
    private const string RolesEscritura = "Administrador,Encargada de Archivo";

    private readonly IVigenciaService _vigencias;
    public VigenciasController(IVigenciaService vigencias) => _vigencias = vigencias;

    // GET api/vigencias
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos() =>
        Ok(ApiResponse<List<VigenciaDto>>.Ok(await _vigencias.ObtenerTodosAsync()));

    // GET api/vigencias/resumen  (cuántos vigentes, próximos a vencer y vencidos)
    [HttpGet("resumen")]
    public async Task<IActionResult> ObtenerResumen() =>
        Ok(ApiResponse<VigenciaResumenDto>.Ok(await _vigencias.ObtenerResumenAsync()));

    // POST api/vigencias
    [HttpPost]
    [Authorize(Roles = RolesEscritura)]
    public async Task<IActionResult> Registrar([FromBody] CrearVigenciaDto dto)
    {
        var r = await _vigencias.RegistrarAsync(dto);
        return r.Exito
            ? StatusCode(r.StatusCode, ApiResponse<VigenciaDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<VigenciaDto>.Fail(r.Mensaje));
    }

    // PUT api/vigencias/5
    [HttpPut("{id:int}")]
    [Authorize(Roles = RolesEscritura)]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarVigenciaDto dto)
    {
        var r = await _vigencias.ActualizarAsync(id, dto);
        return r.Exito
            ? Ok(ApiResponse<VigenciaDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<VigenciaDto>.Fail(r.Mensaje));
    }
}
