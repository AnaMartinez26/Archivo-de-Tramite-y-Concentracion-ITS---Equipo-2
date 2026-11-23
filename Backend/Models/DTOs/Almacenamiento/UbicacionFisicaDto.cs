namespace Backend.Models.DTOs.Almacenamiento;

public class UbicacionFisicaDto
{
    public int Id { get; set; }

    public int CajaNumero { get; set; }

    public string CodigoEtiqueta { get; set; } = string.Empty;

    public string UbicacionPasilloEstanteBateria { get; set; } = string.Empty;

    public int? Capacidad { get; set; }

    public string Estado { get; set; } = string.Empty;

    // Expedientes que hay dentro de la caja.
    public int Ocupacion { get; set; }
}