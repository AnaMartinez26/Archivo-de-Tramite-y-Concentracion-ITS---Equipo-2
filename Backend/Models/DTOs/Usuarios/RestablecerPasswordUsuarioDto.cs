using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Usuarios;

public class RestablecerPasswordUsuarioDto
{
    [Required(ErrorMessage = "La nueva contraseña es obligatoria.")]
    [StringLength(72, MinimumLength = 8,
        ErrorMessage = "La contraseña debe tener entre 8 y 72 caracteres.")]
    public string NuevaPassword { get; set; } = string.Empty;
}