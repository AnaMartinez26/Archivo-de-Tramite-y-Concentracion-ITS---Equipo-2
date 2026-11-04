using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Helpers;

// Genera los tokens JWT que el frontend manda en el header Authorization: Bearer <token>
public class JwtHelper
{
    private readonly IConfiguration _config;

    public JwtHelper(IConfiguration config) => _config = config;

    public (string Token, DateTime Expira) GenerarToken(Usuario usuario)
    {
        var key = _config["Jwt:Key"]
                  ?? throw new InvalidOperationException("Falta 'Jwt:Key' en appsettings.");
        var minutos = _config.GetValue("Jwt:ExpiraMinutos", 480);
        var expira = DateTime.UtcNow.AddMinutes(minutos);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Name, $"{usuario.Nombre} {usuario.ApellidoP}"),
            new(ClaimTypes.Email, usuario.Correo),
            new(ClaimTypes.Role, usuario.Rol.Nombre),
            new("num_empleado", usuario.NumEmpleado.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var credenciales = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expira,
            signingCredentials: credenciales);

        return (new JwtSecurityTokenHandler().WriteToken(token), expira);
    }
}
