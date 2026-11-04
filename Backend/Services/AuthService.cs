using Backend.Helpers;
using Backend.Mappings;
using Backend.Models.DTOs.Auth;
using Backend.Models.DTOs.Common;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private const string CredencialesInvalidas = "Usuario o contraseña incorrectos.";

    private readonly IUsuarioRepository _usuarios;
    private readonly JwtHelper _jwt;

    public AuthService(IUsuarioRepository usuarios, JwtHelper jwt)
    {
        _usuarios = usuarios;
        _jwt = jwt;
    }

    public async Task<ServiceResult<LoginResponseDto>> LoginAsync(LoginRequestDto dto)
    {
        var entrada = dto.Usuario.Trim();

        // Si escribió solo números se busca por número de empleado, si no por correo
        Usuario? usuario = int.TryParse(entrada, out var numEmpleado)
            ? await _usuarios.ObtenerPorNumEmpleadoAsync(numEmpleado)
            : await _usuarios.ObtenerPorCorreoAsync(entrada.ToLowerInvariant());

        if (usuario is null)
        {
            PasswordHasher.VerifyFicticio(dto.Password); // mismo tiempo de respuesta
            return ServiceResult<LoginResponseDto>.Error(CredencialesInvalidas, 401);
        }

        if (!PasswordHasher.Verify(dto.Password, usuario.Pass))
            return ServiceResult<LoginResponseDto>.Error(CredencialesInvalidas, 401);

        if (usuario.Estado != "Activo")
            return ServiceResult<LoginResponseDto>.Error(
                "Tu usuario está inactivo. Contacta al administrador.", 403);

        usuario.UltimoLogin = DateTime.Now;
        await _usuarios.GuardarCambiosAsync();

        var (token, expira) = _jwt.GenerarToken(usuario);

        return ServiceResult<LoginResponseDto>.Ok(new LoginResponseDto
        {
            Token = token,
            Expira = expira,
            Usuario = usuario.ToDto()
        }, "Inicio de sesión correcto.");
    }
}
