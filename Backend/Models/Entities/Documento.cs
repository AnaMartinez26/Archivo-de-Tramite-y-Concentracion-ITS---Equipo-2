namespace Backend.Models.Entities;

public class Documento
{
    public int Id { get; set; }
    public string Folio { get; set; } = null!;
    public string Titulo { get; set; } = null!;
    public string? TipoDocumento { get; set; }
    public int? IdExpediente { get; set; }
    public string? RutaArchivo { get; set; }
    public string? Formato { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime FechaDigitalizacion { get; set; }
    public int? IdUsuarioDigitalizo { get; set; }

    // Navegación (opcionales por ahora, Expediente aún no tiene entidad)
    public Usuario? UsuarioDigitalizo { get; set; }
}