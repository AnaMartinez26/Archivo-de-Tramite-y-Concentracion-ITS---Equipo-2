using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Usuarios;

// Cambio de estado de un usuario (Activo / Inactivo)
public class CambiarEstadoUsuarioDto
{
    [Required(ErrorMessage = "El estado es obligatorio.")]
    [RegularExpression("^(Activo|Inactivo)$", ErrorMessage = "El estado debe ser 'Activo' o 'Inactivo'.")]
    public string Estado { get; set; } = string.Empty;
}
