namespace Backend.Models.Entities;

public class Prestamo
{
    public int Id { get; set; }
    public string FolioPaseSalida { get; set; } = null!;
    public int IdExpediente { get; set; }
    public int IdSolicitante { get; set; }
    public string TipoMovimiento { get; set; } = "Préstamo";
    public DateTime FechaSalida { get; set; }
    public DateTime? FechaRegreso { get; set; }        // fecha límite de regreso
    public DateTime? FechaDevolucion { get; set; }     // día en que realmente se devolvió
    public string? Motivo { get; set; }
    public string Estado { get; set; } = "En Préstamo";
    public int? IdUsuarioRegistra { get; set; }
    public DateTime FechaRegistro { get; set; }

    public Expediente Expediente { get; set; } = null!;
    public Usuario Solicitante { get; set; } = null!;
}
