
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Expedientes;

public class CrearExpedienteDto
{
    [Required(ErrorMessage = "El número de expediente es obligatorio.")]
    [StringLength(30)]
    public string NumeroExpediente { get; set; } = string.Empty;

    [Required(ErrorMessage = "El título o asunto es obligatorio.")]
    [StringLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "La clasificación no es válida.")]
    public int? IdClasificacion { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El número de caja debe ser mayor a 0.")]
    public int? CajaNumero { get; set; }

    public DateTime? FechaApertura { get; set; }

    public DateTime? FechaCierre { get; set; }

    [RegularExpression("^(Activo|Inactivo)$",
        ErrorMessage = "El estado debe ser 'Activo' o 'Inactivo'.")]
    public string Estado { get; set; } = "Activo";
}
