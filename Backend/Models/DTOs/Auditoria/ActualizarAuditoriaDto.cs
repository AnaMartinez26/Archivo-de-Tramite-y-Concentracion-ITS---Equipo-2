using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Auditoria;

public class ActualizarAuditoriaDto
{
    [Required(ErrorMessage = "Los comentarios o descripción son obligatorios.")]
    [MaxLength(1000)]
    public string Descripcion { get; set; } = string.Empty;
}
