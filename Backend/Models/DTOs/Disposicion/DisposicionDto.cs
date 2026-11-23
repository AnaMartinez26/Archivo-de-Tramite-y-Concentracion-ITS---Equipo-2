namespace Backend.Models.DTOs.Disposicion;

public class DisposicionDto
{
    public int Id { get; set; }
    public int IdExpediente { get; set; }
    public string NumeroExpediente { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string TipoDisposicion { get; set; } = string.Empty;
    public DateTime? FechaDisposicion { get; set; }
    public string? DestinoFinal { get; set; }
    public string? Observaciones { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string? NumeroActa { get; set; }
    public int? IdUsuarioAutoriza { get; set; }
    public DateTime FechaRegistro { get; set; }
}