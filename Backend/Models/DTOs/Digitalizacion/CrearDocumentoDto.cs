using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Digitalizacion;

public class CrearDocumentoDto
{
    [Required, StringLength(30)]
    public string Folio { get; set; } = String.Empty;

    [Required, StringLength(200)]
    public string Titulo { get; set; } = String.Empty;

    [StringLength(50)]
    public string? TipoDocumento { get; set; }

    [StringLength(30)]
    public string? NumeroExpediente { get; set; }

    public DateTime? FechaCreacion { get; set; }
}