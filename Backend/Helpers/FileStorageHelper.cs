namespace Backend.Helpers;

public class FileStorageHelper
{
    // Debe coincidir exactamente con la ruta guardada en BD (Linux distingue mayúsculas)
    private const string Carpeta = "documentos";
    private readonly string _root;

    public FileStorageHelper(IConfiguration config)
    {
        _root = Path.GetFullPath(config["Storage:Root"]
                ?? Path.Combine(Directory.GetCurrentDirectory(), "Storage"));
        Directory.CreateDirectory(_root);
    }

    public async Task<string> GuardarAsync(string folio, Stream contenido, string extension = ".pdf")
    {
        var carpeta = Path.Combine(_root, Carpeta);
        Directory.CreateDirectory(carpeta);

        var nombreArchivo = $"{Sanitizar(folio)}{extension}";
        var rutaArchivo = Path.Combine(carpeta, nombreArchivo);

        await using var fs = new FileStream(rutaArchivo, FileMode.Create);
        await contenido.CopyToAsync(fs);

        return $"{Carpeta}/{nombreArchivo}";
    }

    public string? ObtenerRutaAbsoluta(string rutaRelativa)
    {
        var ruta = Resolver(rutaRelativa);
        return ruta is not null && File.Exists(ruta) ? ruta : null;
    }

    public bool Eliminar(string rutaRelativa)
    {
        var ruta = Resolver(rutaRelativa);
        if (ruta is null || !File.Exists(ruta)) return false;

        File.Delete(ruta);
        return true;
    }

    // Resuelve la ruta y evita que se salga de la carpeta raíz (path traversal)
    private string? Resolver(string rutaRelativa)
    {
        var ruta = Path.GetFullPath(Path.Combine(_root, rutaRelativa));
        return ruta.StartsWith(_root + Path.DirectorySeparatorChar, StringComparison.Ordinal) ? ruta : null;
    }

    // Convierte el folio en un nombre de archivo seguro
    private static string Sanitizar(string nombre)
    {
        var invalidos = Path.GetInvalidFileNameChars().Append('/').Append('\\').ToHashSet();
        var limpio = new string(nombre.Select(c => invalidos.Contains(c) ? '_' : c).ToArray())
                     .Replace("..", "_");
        return string.IsNullOrWhiteSpace(limpio) ? Guid.NewGuid().ToString("N") : limpio;
    }
}
