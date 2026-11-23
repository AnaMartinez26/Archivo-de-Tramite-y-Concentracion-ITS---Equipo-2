namespace Backend.Models.Entities;

public class Etiqueta
{
    public int Id { get; set; }
    public int IdExpediente { get; set; }
    public DateTime FechaGeneracion { get; set; }

    public Expediente Expediente { get; set; } = null!;
}