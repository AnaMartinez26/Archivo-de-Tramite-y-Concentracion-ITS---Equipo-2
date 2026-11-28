using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Auditoria;

public class CrearAuditoriaDto
{
    [Required(ErrorMessage = "La acción es obligatoria.")]
    [MaxLength(30)]
    public string Accion { get; set; } = "Revisión";

    [MaxLength(100)]
    public string? Periodo { get; set; }

    [Required(ErrorMessage = "Los comentarios o descripción son obligatorios.")]
    [MaxLength(1000)]
    public string Descripcion { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? TablaAfectada { get; set; }

    [MaxLength(50)]
    public string? IdRegistro { get; set; }
}
