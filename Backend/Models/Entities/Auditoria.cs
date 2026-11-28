namespace Backend.Models.Entities;

public class Auditoria
{
    public long Id { get; set; }
    public DateTime FechaHora { get; set; }
    public int? IdUsuario { get; set; }
    public string Accion { get; set; } = null!;
    public string? TablaAfectada { get; set; }
    public string? IdRegistro { get; set; }
    public string? Descripcion { get; set; }
    public string? Ip { get; set; }

    // Navegación
    public Usuario? Usuario { get; set; }
}
