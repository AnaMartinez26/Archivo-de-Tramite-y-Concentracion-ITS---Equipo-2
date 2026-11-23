using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Etiquetado;

public class CrearEtiquetaDto
{
    [Range(1, int.MaxValue, ErrorMessage = "El expediente no es válido.")]
    public int IdExpediente { get; set; }
}