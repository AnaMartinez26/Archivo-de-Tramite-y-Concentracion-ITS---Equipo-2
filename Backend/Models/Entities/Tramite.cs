namespace Backend.Models.Entities;

public class Tramite
{
    public int Id { get; set; }
    public string Folio { get; set; } = null!;
    public int IdExpediente { get; set; }
    public int IdSolicitante { get; set; }
    public string? Solicitud { get; set; }
    public string Estado { get; set; } = "Pendiente";
    public string? Observaciones { get; set; }
    public string? FirmaToken { get; set; }      // se guarda como hash BCrypt
    public int? IdUsuarioRevisa { get; set; }
    public DateTime FechaIngreso { get; set; }
    public DateTime? FechaResolucion { get; set; }

    // Navegación
    public Expediente Expediente { get; set; } = null!;
    public Usuario Solicitante { get; set; } = null!;
    public Usuario? UsuarioRevisa { get; set; }
}
