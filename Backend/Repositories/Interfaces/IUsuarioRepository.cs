using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<List<Usuario>> ObtenerTodosAsync();
    Task<Usuario?> ObtenerPorIdAsync(int id);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);
    Task<Usuario?> ObtenerPorNumEmpleadoAsync(int numEmpleado);
    Task<bool> ExisteCorreoAsync(string correo);
    Task<bool> ExisteNumEmpleadoAsync(int numEmpleado);
    Task<bool> ExisteRolAsync(int idRol);
    Task<List<Rol>> ObtenerRolesAsync();
    Task AgregarAsync(Usuario usuario);
    Task GuardarCambiosAsync();
}
