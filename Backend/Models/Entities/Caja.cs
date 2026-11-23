
namespace Backend.Models.Entities;

public class Caja
{
    public int Id { get; set; }

    public int CajaNumero { get; set; }

    public string? CodigoEtiqueta { get; set; }

    public string UbicacionPasilloEstanteBateria { get; set; } = string.Empty;

    public int? Capacidad { get; set; }

    public string Estado { get; set; } = "Activo";

    // Relación con los expedientes almacenados en esta caja.
    public ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();
}
