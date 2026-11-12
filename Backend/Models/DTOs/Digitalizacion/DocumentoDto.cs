namespace Backend.Models.DTOs.Digitalizacion;

public class DocumentoDto
{
    public int Id { get; set; }
    public string Folio { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string? TipoDocumento { get; set; }
    public int? IdExpediente { get; set; }
    public string? NumeroExpediente { get; set; }
    public string? RutaArchivo { get; set; }
    public string? Formato { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime FechaDigitalizacion { get; set; }
    public string? UsuarioDigitalizo { get; set; }
}