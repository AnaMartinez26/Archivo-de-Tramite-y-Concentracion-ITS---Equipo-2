using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Vigencias;

public class ActualizarVigenciaDto
{
    [Required(ErrorMessage = "El número de expediente es obligatorio.")]
    [StringLength(30, ErrorMessage = "El número de expediente no puede pasar de 30 caracteres.")]
    public string NumeroExpediente { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de inicio es obligatoria.")]
    public DateTime? FechaInicio { get; set; }

    [Required(ErrorMessage = "La fecha de vencimiento es obligatoria.")]
    public DateTime? FechaVencimiento { get; set; }
}
