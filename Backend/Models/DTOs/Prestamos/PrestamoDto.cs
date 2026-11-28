namespace Backend.Models.DTOs.Prestamos;

public class PrestamoDto
{
    public int Id { get; set; }
    public string FolioPaseSalida { get; set; } = string.Empty;
    public int IdExpediente { get; set; }
    public string NumeroExpediente { get; set; } = string.Empty;
    public int NumeroEmpleado { get; set; }
    public string NombreSolicitante { get; set; } = string.Empty;
    public string TipoMovimiento { get; set; } = string.Empty;
    public DateTime FechaSalida { get; set; }
    public DateTime? FechaRegreso { get; set; }
    public DateTime? FechaDevolucion { get; set; }
    public string? Motivo { get; set; }
    public string Estado { get; set; } = string.Empty;   // "Vencido" se calcula al consultar
}