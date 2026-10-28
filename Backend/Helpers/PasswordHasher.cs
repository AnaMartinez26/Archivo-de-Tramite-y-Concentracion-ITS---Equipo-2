using System.Security.Cryptography;

namespace Backend.Helpers;

// Encapsula BCrypt para no repetirlo en todo el proyecto
public static class PasswordHasher
{
    private const int WorkFactor = 11;

    // Hash BCrypt de una contraseña precalculado una vez; se usa para que el login
    // tarde lo mismo exista o no el usuario (evita adivinar correos por tiempo de respuesta).
    private static readonly string HashFicticio =
        BCrypt.Net.BCrypt.HashPassword(Convert.ToBase64String(RandomNumberGenerator.GetBytes(16)), WorkFactor);

    public static string Hash(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public static bool Verify(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (Exception ex) when (ex is BCrypt.Net.SaltParseException or ArgumentException)
        {
            // La columna Pass no contiene un hash válido (p. ej. se insertó en texto plano)
            return false;
        }
    }

    public static void VerifyFicticio(string password) =>
        BCrypt.Net.BCrypt.Verify(password, HashFicticio);
}
