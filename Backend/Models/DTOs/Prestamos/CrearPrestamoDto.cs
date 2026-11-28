using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Prestamos;

public class CrearPrestamoDto
{
    [Required(ErrorMessage = "El folio del pase de salida es obligatorio.")]
    [StringLength(30, ErrorMessage = "El folio no puede pasar de 30 caracteres.")]
    public string FolioPaseSalida { get; set; } = string.Empty;

    [Required(ErrorMessage = "El número de expediente es obligatorio.")]
    [StringLength(30, ErrorMessage = "El número de expediente no puede pasar de 30 caracteres.")]
    public string NumeroExpediente { get; set; } = string.Empty;

    [Required(ErrorMessage = "El número de empleado del solicitante es obligatorio.")]
    [StringLength(10, ErrorMessage = "El número de empleado no es válido.")]
    public string NumeroEmpleado { get; set; } = string.Empty;

    public DateTime? FechaSalida { get; set; }      // si no se manda, se usa la fecha de hoy
    public DateTime? FechaRegreso { get; set; }     // fecha límite de regreso (opcional)

    [StringLength(500, ErrorMessage = "El motivo no puede pasar de 500 caracteres.")]
    public string? Motivo { get; set; }
}
