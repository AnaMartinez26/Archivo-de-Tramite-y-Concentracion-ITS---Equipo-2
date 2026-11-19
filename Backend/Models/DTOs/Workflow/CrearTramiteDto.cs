using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Workflow;

public class CrearTramiteDto
{
    [Required(ErrorMessage = "El folio es obligatorio."), StringLength(30)]
    public string Folio { get; set; } = string.Empty;

    [Required(ErrorMessage = "El número de expediente es obligatorio."), StringLength(30)]
    public string NumeroExpediente { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "El número de empleado debe ser mayor a 0.")]
    public int NumEmpleadoSolicitante { get; set; }

    [StringLength(200)]
    public string? Solicitud { get; set; }

    [StringLength(30)]
    public string? Estado { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }

    [StringLength(255)]
    public string? FirmaToken { get; set; }
}
