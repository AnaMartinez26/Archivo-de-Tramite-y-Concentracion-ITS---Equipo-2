using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Disposicion;

public class CrearDisposicionDto
{
    [Range(1, int.MaxValue, ErrorMessage = "El expediente no es válido.")]
    public int IdExpediente { get; set; }

    [Required(ErrorMessage = "El tipo de disposición es obligatorio.")]
    [StringLength(30)]
    [RegularExpression(
        "^(Transferencia Histórica|Transferencia Secundaria|Baja Documental)$",
        ErrorMessage = "El tipo de disposición no es válido.")]
    public string TipoDisposicion { get; set; } = string.Empty;

    public DateTime? FechaDisposicion { get; set; }

    [RegularExpression(
        "^(Conservación Permanente|Destrucción)$",
        ErrorMessage = "El destino final no es válido.")]
    public string? DestinoFinal { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }
}