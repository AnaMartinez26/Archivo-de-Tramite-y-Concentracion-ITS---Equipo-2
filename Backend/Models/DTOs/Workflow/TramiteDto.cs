namespace Backend.Models.DTOs.Workflow;

public class TramiteDto
{
    public int Id { get; set; }
    public string Folio { get; set; } = string.Empty;
    public int IdExpediente { get; set; }
    public string NumeroExpediente { get; set; } = string.Empty;
    public int IdSolicitante { get; set; }
    public int NumEmpleadoSolicitante { get; set; }
    public string NombreSolicitante { get; set; } = string.Empty;
    public string? Solicitud { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
    public bool TieneFirma { get; set; }
    public int? IdUsuarioRevisa { get; set; }
    public string? UsuarioRevisa { get; set; }
    public DateTime FechaIngreso { get; set; }
    public DateTime? FechaResolucion { get; set; }
}
