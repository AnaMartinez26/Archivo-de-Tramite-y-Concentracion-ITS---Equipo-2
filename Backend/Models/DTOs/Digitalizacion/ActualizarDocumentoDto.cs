using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Digitalizacion;

public class ActualizarDocumentoDto
{
    [Required, StringLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [StringLength(50)]
    public string? TipoDocumento { get; set; }

    [StringLength(30)]
    public string? NumeroExpediente { get; set; }

    public DateTime? FechaCreacion { get; set; }
}