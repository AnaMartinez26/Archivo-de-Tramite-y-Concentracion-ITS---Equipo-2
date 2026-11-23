using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.Almacenamiento;

public class CrearCajaDto
{
    [Range(1, int.MaxValue, ErrorMessage = "El número de caja debe ser mayor a 0.")]
    public int CajaNumero { get; set; }

    [Required(ErrorMessage = "El código de etiqueta es obligatorio.")]
    [StringLength(50)]
    public string CodigoEtiqueta { get; set; } = string.Empty;

    [Required(ErrorMessage = "La ubicación física es obligatoria.")]
    [StringLength(100, ErrorMessage = "La ubicación no puede pasar de 100 caracteres.")]
    public string UbicacionPasilloEstanteBateria { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "La capacidad no puede ser un número negativo.")]
    public int? Capacidad { get; set; }

    [Required]
    [RegularExpression("^(Activo|Inactivo)$", ErrorMessage = "El estado debe ser Activo o Inactivo.")]
    public string Estado { get; set; } = "Activo";
}