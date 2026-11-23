using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Clasificacion;

public class ActualizarClasificacionDto
{
    [Required(ErrorMessage = "El nombre de la clasificación es obligatorio.")]
    [StringLength(150)]
    public string Nombre { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "La clasificación padre no es válida.")]
    public int? IdPadre { get; set; }

    [StringLength(500)]
    public string? Descripcion { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El plazo de conservación no puede ser negativo.")]
    public int? PlazoConservacion { get; set; }

    [RegularExpression(
        "^(Conservación Permanente|Destrucción)$",
        ErrorMessage = "El destino final debe ser Conservación Permanente o Destrucción.")]
    public string? DestinoFinal { get; set; }

    [StringLength(255)]
    public string? FundamentoNormativo { get; set; }
}