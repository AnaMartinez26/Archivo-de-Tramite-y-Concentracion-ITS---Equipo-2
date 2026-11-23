namespace Backend.Models.DTOs.Clasificacion;

public class ClasificacionDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public int? IdPadre { get; set; }

    public string? Padre { get; set; }

    public string? Descripcion { get; set; }

    public int? PlazoConservacion { get; set; }

    public string? DestinoFinal { get; set; }

    public string? FundamentoNormativo { get; set; }

    public int CantidadHijas { get; set; }
}