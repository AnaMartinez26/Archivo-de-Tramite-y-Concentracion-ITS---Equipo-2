using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Auth;

public class LoginRequestDto
{
    // Acepta el correo institucional o el número de empleado
    [Required(ErrorMessage = "Ingresa tu correo institucional o número de empleado.")]
    public string Usuario { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ingresa tu contraseña.")]
    public string Password { get; set; } = string.Empty;
}
