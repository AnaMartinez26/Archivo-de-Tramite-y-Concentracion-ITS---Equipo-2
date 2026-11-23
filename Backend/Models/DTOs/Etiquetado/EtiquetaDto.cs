namespace Backend.Models.DTOs.Etiquetado;

public class EtiquetaDto
{
    public int Id { get; set; }
    public int IdExpediente { get; set; }
    public string NumeroExpediente { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string CodigoEtiqueta { get; set; } = string.Empty;
    public DateTime FechaGeneracion { get; set; }
}