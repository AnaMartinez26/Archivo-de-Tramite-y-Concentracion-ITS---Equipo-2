using Backend.Data;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;

    public UsuarioRepository(AppDbContext db) => _db = db;

    public Task<List<Usuario>> ObtenerTodosAsync() =>
        _db.Usuarios.AsNoTracking()
                    .Include(u => u.Rol)
                    .OrderBy(u => u.Nombre)
                    .ToListAsync();

    public Task<Usuario?> ObtenerPorIdAsync(int id) =>
        _db.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Id == id);

    public Task<Usuario?> ObtenerPorCorreoAsync(string correo) =>
        _db.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Correo == correo);

    public Task<Usuario?> ObtenerPorNumEmpleadoAsync(int numEmpleado) =>
        _db.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.NumEmpleado == numEmpleado);

    public Task<bool> ExisteCorreoAsync(string correo) =>
        _db.Usuarios.AnyAsync(u => u.Correo == correo);

    public Task<bool> ExisteNumEmpleadoAsync(int numEmpleado) =>
        _db.Usuarios.AnyAsync(u => u.NumEmpleado == numEmpleado);

    public Task<bool> ExisteRolAsync(int idRol) =>
        _db.Roles.AnyAsync(r => r.Id == idRol);

    public Task<List<Rol>> ObtenerRolesAsync() =>
        _db.Roles.AsNoTracking().OrderBy(r => r.Id).ToListAsync();

    public async Task AgregarAsync(Usuario usuario) =>
        await _db.Usuarios.AddAsync(usuario);

    public Task GuardarCambiosAsync() => _db.SaveChangesAsync();
}
