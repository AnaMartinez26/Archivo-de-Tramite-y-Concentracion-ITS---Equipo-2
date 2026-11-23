namespace Backend.Models.Entities;

public class Clasificacion
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public int? IdPadre { get; set; }

    public string? Descripcion { get; set; }

    public int? PlazoConservacion { get; set; }

    public string? DestinoFinal { get; set; }

    public string? FundamentoNormativo { get; set; }

    // Relación con la clasificación superior.
    public Clasificacion? Padre { get; set; }

    // Clasificaciones que dependen de esta.
    public ICollection<Clasificacion> Hijas { get; set; } = new List<Clasificacion>();

    // Expedientes que pertenecen a esta clasificación.
    public ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}