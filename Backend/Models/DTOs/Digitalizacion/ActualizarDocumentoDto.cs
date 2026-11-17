using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Digitalizacion;

public class ActualizarDocumentoDto
{
    [Required, StringLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [StringLength(50)]
    public string? TipoDocumento { get; set; }

    // TODO: agregar NumeroExpediente cuando exista la entidad Expediente.

    public DateTime? FechaCreacion { get; set; }
}