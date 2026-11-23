namespace Backend.Models.DTOs.Disposicion;

public class ActaBajaDto
{
    public string NumeroActa { get; set; } = string.Empty;
    public DateTime FechaGeneracion { get; set; }
    public List<DisposicionDto> Disposiciones { get; set; } = new();
}