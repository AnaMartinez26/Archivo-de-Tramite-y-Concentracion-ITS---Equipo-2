using Backend.Models.DTOs.Usuarios;

namespace Backend.Models.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expira { get; set; }
    public UsuarioDto Usuario { get; set; } = null!;
}
