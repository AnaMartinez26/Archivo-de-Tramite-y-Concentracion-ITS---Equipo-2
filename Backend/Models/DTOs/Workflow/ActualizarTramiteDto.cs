using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Workflow;

// Cambio de estado del trámite (aprobar, rechazar, reenviar a revisión)
public class ActualizarTramiteDto
{
    [Required(ErrorMessage = "El estado es obligatorio."), StringLength(30)]
    public string Estado { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Observaciones { get; set; }

    [StringLength(255)]
    public string? FirmaToken { get; set; }
}
