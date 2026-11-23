using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Almacenamiento;

public class MoverUbicacionDto
{
    [Required(ErrorMessage = "La nueva ubicación es obligatoria."), StringLength(100)]
    public string Ubicacion { get; set; } = string.Empty;
}
