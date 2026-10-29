using System.Security.Claims;
using Backend.Models.DTOs.Auth;
using Backend.Models.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IUsuarioService _usuarios;

    public AuthController(IAuthService auth, IUsuarioService usuarios)
    {
        _auth = auth;
        _usuarios = usuarios;
    }

    // POST api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var resultado = await _auth.LoginAsync(dto);

        return resultado.Exito
            ? Ok(ApiResponse<LoginResponseDto>.Ok(resultado.Data!, resultado.Mensaje))
            : StatusCode(resultado.StatusCode, ApiResponse<LoginResponseDto>.Fail(resultado.Mensaje));
    }

    // GET api/auth/me  -> datos del usuario dueño del token
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id))
            return Unauthorized();

        var resultado = await _usuarios.ObtenerPorIdAsync(id);
        return resultado.Exito
            ? Ok(ApiResponse<object>.Ok(resultado.Data!))
            : StatusCode(resultado.StatusCode, ApiResponse<object>.Fail(resultado.Mensaje));
    }
}
