namespace Backend.Models.Entities;

public class Disposicion
{
    public int Id { get; set; }
    public int IdExpediente { get; set; }
    public string TipoDisposicion { get; set; } = string.Empty;
    public DateTime? FechaDisposicion { get; set; }
    public string? DestinoFinal { get; set; }
    public string? Observaciones { get; set; }
    public string? NumeroActa { get; set; }
    public int? IdUsuarioAutoriza { get; set; }
    public DateTime FechaRegistro { get; set; }

    public Expediente Expediente { get; set; } = null!;
    public Usuario? UsuarioAutoriza { get; set; }
}