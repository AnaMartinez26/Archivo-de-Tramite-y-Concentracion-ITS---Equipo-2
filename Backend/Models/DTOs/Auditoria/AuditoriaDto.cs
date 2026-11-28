namespace Backend.Models.DTOs.Auditoria;

public class AuditoriaDto
{
    public long Id { get; set; }
    public DateTime FechaHora { get; set; }
    public int? IdUsuario { get; set; }
    public string Usuario { get; set; } = "Sistema";
    public string Accion { get; set; } = string.Empty;
    public string? TablaAfectada { get; set; }
    public string? IdRegistro { get; set; }
    public string? Descripcion { get; set; }
    public string? Ip { get; set; }
}

public class VerificacionIntegridadDto
{
    public DateTime FechaVerificacion { get; set; }
    public int TotalDocumentos { get; set; }
    public int DocumentosConArchivo { get; set; }
    public int ArchivosEnDisco { get; set; }
    public int ArchivosFaltantes { get; set; }
    public int ArchivosCorruptos { get; set; }
    public string EstadoIntegridadArchivos { get; set; } = string.Empty;
    public string EstadoControlAcceso { get; set; } = string.Empty;
    public string EstadoBitacora { get; set; } = string.Empty;
    public List<string> DetallesIncidencias { get; set; } = new();
}
