using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Disposicion;

public class ActualizarDisposicionDto
{
    [StringLength(200)]
    public string? Titulo { get; set; }

    public DateTime? FechaDisposicion { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }
}
