using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Usuarios;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize(Roles = "Administrador")]   // solo el administrador gestiona usuarios
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarios;

    public UsuariosController(IUsuarioService usuarios) => _usuarios = usuarios;

    // Id del usuario autenticado (0 si el token no trae el claim)
    private int UsuarioId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    // GET api/usuarios
    [HttpGet]
    public async Task<IActionResult> ObtenerTodos() =>
        Ok(ApiResponse<List<UsuarioDto>>.Ok(await _usuarios.ObtenerTodosAsync()));

    // GET api/usuarios/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var resultado = await _usuarios.ObtenerPorIdAsync(id);
        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(resultado.Data!))
            : StatusCode(resultado.StatusCode, ApiResponse<UsuarioDto>.Fail(resultado.Mensaje));
    }

    // POST api/usuarios
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearUsuarioDto dto)
    {
        var resultado = await _usuarios.CrearAsync(dto);
        if (!resultado.Exito)
            return StatusCode(resultado.StatusCode, ApiResponse<UsuarioDto>.Fail(resultado.Mensaje));

        return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Data!.Id },
            ApiResponse<UsuarioDto>.Ok(resultado.Data, resultado.Mensaje));
    }

    // GET api/usuarios/roles  -> para llenar el combo "Rol Asignado"
    [HttpGet("roles")]
    public async Task<IActionResult> ObtenerRoles()
    {
        var roles = (await _usuarios.ObtenerRolesAsync())
                    .Select(r => new { r.Id, r.Nombre })
                    .ToList();
        return Ok(ApiResponse<object>.Ok(roles));
    }

    // PATCH api/usuarios/5/estado  -> activar o desactivar usuario
    [HttpPatch("{id:int}/estado")]
    public async Task<IActionResult> CambioEstado(int id, [FromBody] CambiarEstadoUsuarioDto dto)
    {
        var r = await _usuarios.CambiarEstadoAsync(id, dto, UsuarioId);
        return r.Exito ? Ok(ApiResponse<UsuarioDto>.Ok(r.Data!, r.Mensaje))
                       : StatusCode(r.StatusCode, ApiResponse<UsuarioDto>.Fail(r.Mensaje));
    }
}
