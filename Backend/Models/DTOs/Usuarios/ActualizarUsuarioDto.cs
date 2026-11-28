using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Usuarios;

public class ActualizarUsuarioDto
{
    [Range(1, int.MaxValue, ErrorMessage = "El número de empleado debe ser mayor a 0.")]
    public int NumEmpleado { get; set; }

    [Required, StringLength(50)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido paterno es obligatorio."), StringLength(50)]
    public string ApellidoP { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido materno es obligatorio."), StringLength(50)]
    public string ApellidoM { get; set; } = string.Empty;

    [Required, EmailAddress(ErrorMessage = "El correo no es válido."), StringLength(100)]
    public string Correo { get; set; } = string.Empty;

    // Opcional al editar. Si viene vacío o null, se conserva la contraseña actual.
    [StringLength(72, MinimumLength = 8,
        ErrorMessage = "La contraseña debe tener entre 8 y 72 caracteres.")]
    public string? Password { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Selecciona un rol.")]
    public int IdRol { get; set; }

    [RegularExpression("^(Activo|Inactivo)$",
        ErrorMessage = "El estado debe ser 'Activo' o 'Inactivo'.")]
    public string Estado { get; set; } = "Activo";

    [StringLength(100)]
    public string? Departamento { get; set; }

    [StringLength(100)]
    public string? Puesto { get; set; }
}