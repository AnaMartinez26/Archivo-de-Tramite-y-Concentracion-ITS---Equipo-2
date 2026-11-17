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

    // TODO: agregar NumeroExpediente cuando exista la entidad Expediente
    //       (resolverlo a IdExpediente en DocumentoService).

    public DateTime? FechaCreacion { get; set; }
}