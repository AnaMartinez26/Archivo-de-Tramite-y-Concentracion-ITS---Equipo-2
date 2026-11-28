
namespace Backend.Models.Entities;

public class Expediente
{
    public int Id { get; set; }
    public string NumeroExpediente { get; set; } = null!;
    public string Titulo { get; set; } = null!;
    public int? IdClasificacion { get; set; }
    public int? IdCaja { get; set; }

    public DateTime? FechaApertura { get; set; }
    public DateTime? FechaCierre { get; set; }
    
    public string Estado { get; set; } = "Activo";

    public DateTime FechaCreacion { get; set; }

    public Clasificacion? Clasificacion { get; set; }

    public Caja? Caja { get; set; }
}
