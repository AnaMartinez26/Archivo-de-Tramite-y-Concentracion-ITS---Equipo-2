using System.Security.Claims;
using Backend.Models.DTOs.Common;
using Backend.Models.DTOs.Usuarios;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize(Roles = "Administrador")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarios;

    public UsuariosController(IUsuarioService usuarios) =>
        _usuarios = usuarios;

    private int UsuarioId =>
        int.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier),
            out var id
        ) ? id : 0;

    [HttpGet]
    public async Task<IActionResult> ObtenerTodos() =>
        Ok(ApiResponse<List<UsuarioDto>>.Ok(
            await _usuarios.ObtenerTodosAsync()
        ));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var resultado = await _usuarios.ObtenerPorIdAsync(id);

        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(resultado.Data!))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearUsuarioDto dto)
    {
        var resultado = await _usuarios.CrearAsync(dto);

        if (!resultado.Exito)
        {
            return StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
        }

        return CreatedAtAction(
            nameof(ObtenerPorId),
            new { id = resultado.Data!.Id },
            ApiResponse<UsuarioDto>.Ok(resultado.Data, resultado.Mensaje)
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(
        int id,
        [FromBody] ActualizarUsuarioDto dto)
    {
        var resultado = await _usuarios.ActualizarAsync(id, dto);

        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(
                resultado.Data!,
                resultado.Mensaje
            ))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
    }

    [HttpGet("roles")]
    public async Task<IActionResult> ObtenerRoles()
    {
        var roles = (await _usuarios.ObtenerRolesAsync())
            .Select(r => new { r.Id, r.Nombre })
            .ToList();

        return Ok(ApiResponse<object>.Ok(roles));
    }

    [HttpPatch("{id:int}/estado")]
    public async Task<IActionResult> CambioEstado(
        int id,
        [FromBody] CambiarEstadoUsuarioDto dto)
    {
        var resultado = await _usuarios.CambiarEstadoAsync(
            id,
            dto,
            UsuarioId
        );

        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(
                resultado.Data!,
                resultado.Mensaje
            ))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
    }

    [HttpPatch("{id:int}/password")]
    public async Task<IActionResult> RestablecerPassword(
        int id,
        [FromBody] RestablecerPasswordUsuarioDto dto)
    {
        var resultado = await _usuarios.RestablecerPasswordAsync(id, dto);

        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(
                resultado.Data!,
                resultado.Mensaje
            ))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var dto = new CambiarEstadoUsuarioDto
        {
            Estado = "Inactivo"
        };

        var resultado = await _usuarios.CambiarEstadoAsync(
            id,
            dto,
            UsuarioId
        );

        return resultado.Exito
            ? Ok(ApiResponse<UsuarioDto>.Ok(
                resultado.Data!,
                "Usuario desactivado correctamente."
            ))
            : StatusCode(
                resultado.StatusCode,
                ApiResponse<UsuarioDto>.Fail(resultado.Mensaje)
            );
    }
}