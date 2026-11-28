using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Prestamos;

// Se usa para extender el plazo (prórroga) de un préstamo
public class ActualizarPrestamoDto
{
    [Required(ErrorMessage = "La nueva fecha de regreso es obligatoria.")]
    public DateTime? NuevaFechaRegreso { get; set; }
}
