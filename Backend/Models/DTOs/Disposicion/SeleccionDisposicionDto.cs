using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Disposicion;

public class SeleccionDisposicionDto
{
    [Required(ErrorMessage = "Debes seleccionar al menos una disposición.")]
    [MinLength(1, ErrorMessage = "Debes seleccionar al menos una disposición.")]
    public List<int> Ids { get; set; } = new();
}