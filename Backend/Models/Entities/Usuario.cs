namespace Backend.Models.Entities;

public class Usuario
{
    public int Id { get; set; }
    public int NumEmpleado { get; set; }
    public string Nombre { get; set; } = null!;
    public string ApellidoP { get; set; } = null!;
    public string ApellidoM { get; set; } = null!;
    public string Correo { get; set; } = null!;
    public string Pass { get; set; } = null!;   // hash BCrypt, nunca la contraseña en texto plano
    public int IdRol { get; set; }
    public string Estado { get; set; } = "Activo";
    public DateTime? UltimoLogin { get; set; }
    public DateTime FechaCreacion { get; set; }

    public Rol Rol { get; set; } = null!;
}
