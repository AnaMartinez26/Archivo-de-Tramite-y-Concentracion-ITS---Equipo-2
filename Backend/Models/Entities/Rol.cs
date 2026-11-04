namespace Backend.Models.Entities;

public class Rol
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;

    public List<Usuario> Usuarios { get; set; } = new();
}
