using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Prestamos;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/prestamos")]
[Authorize]
public class PrestamosController : ControllerBase
{
    // Quién puede registrar salidas, devoluciones y prórrogas
    private const string RolesEscritura = "Administrador,Encargada de Archivo";

    private readonly IPrestamoService _prestamos;
    public PrestamosController(IPrestamoService prestamos) => _prestamos = prestamos;

    private int IdUsuarioActual =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    // GET api/prestamos
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos() =>
        Ok(ApiResponse<List<PrestamoDto>>.Ok(await _prestamos.ObtenerTodosAsync()));

    // POST api/prestamos
    [HttpPost]
    [Authorize(Roles = RolesEscritura)]
    public async Task<IActionResult> RegistrarSalida([FromBody] CrearPrestamoDto dto)
    {
        var r = await _prestamos.RegistrarSalidaAsync(dto, IdUsuarioActual);
        return r.Exito
            ? StatusCode(r.StatusCode, ApiResponse<PrestamoDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<PrestamoDto>.Fail(r.Mensaje));
    }

    // PUT api/prestamos/5/devolucion
    [HttpPut("{id:int}/devolucion")]
    [Authorize(Roles = RolesEscritura)]
    public async Task<IActionResult> RegistrarDevolucion(int id)
    {
        var r = await _prestamos.RegistrarDevolucionAsync(id);
        return r.Exito
            ? Ok(ApiResponse<PrestamoDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<PrestamoDto>.Fail(r.Mensaje));
    }

    // PUT api/prestamos/5/prorroga
    [HttpPut("{id:int}/prorroga")]
    [Authorize(Roles = RolesEscritura)]
    public async Task<IActionResult> ExtenderPlazo(int id, [FromBody] ActualizarPrestamoDto dto)
    {
        var r = await _prestamos.ExtenderPlazoAsync(id, dto);
        return r.Exito
            ? Ok(ApiResponse<PrestamoDto>.Ok(r.Data!, r.Mensaje))
            : StatusCode(r.StatusCode, ApiResponse<PrestamoDto>.Fail(r.Mensaje));
    }
}
