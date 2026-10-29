namespace Backend.Models.DTOs.Usuarios;

// Lo que la API regresa de un usuario (nunca incluye la contraseña)
public class UsuarioDto
{
    public int Id { get; set; }
    public int NumEmpleado { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string ApellidoP { get; set; } = string.Empty;
    public string ApellidoM { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public int IdRol { get; set; }
    public string Rol { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime? UltimoLogin { get; set; }
    public DateTime FechaCreacion { get; set; }
}
