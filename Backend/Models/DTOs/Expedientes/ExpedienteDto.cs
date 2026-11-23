
namespace Backend.Models.DTOs.Expedientes;

public class ExpedienteDto
{
    public int Id { get; set; }

    public string NumeroExpediente { get; set; } = string.Empty;

    public string Titulo { get; set; } = string.Empty;

    public string CodigoEtiqueta { get; set; } = string.Empty;

    public int? IdClasificacion { get; set; }

    public string? Clasificacion { get; set; }

    public int? CajaNumero { get; set; }

    public DateTime? FechaApertura { get; set; }

    public DateTime? FechaCierre { get; set; }

    public string Estado { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; }
}
