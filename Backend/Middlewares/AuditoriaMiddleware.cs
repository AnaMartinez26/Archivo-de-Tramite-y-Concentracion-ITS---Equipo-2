using System.Security.Claims;
using Backend.Services.Interfaces;

namespace Backend.Middlewares;

public class AuditoriaMiddleware
{
    private readonly RequestDelegate _next;
    public AuditoriaMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, IAuditoriaService auditoriaService)
    {
        await _next(context);

        var path = context.Request.Path.Value ?? string.Empty;
        var method = context.Request.Method;
        var status = context.Response.StatusCode;

        if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) || status < 200 || status >= 300)
            return;

        if (path.StartsWith("/api/auditoria", StringComparison.OrdinalIgnoreCase))
            return;

        bool esDescargaPdf = method == "GET" && path.EndsWith("/archivo", StringComparison.OrdinalIgnoreCase);
        if (method == "GET" && !esDescargaPdf)
            return;

        string accion = method switch
        {
            "POST" when path.Contains("/login", StringComparison.OrdinalIgnoreCase) => "Inicio de Sesión",
            "POST" => "Creación",
            "PUT" or "PATCH" => "Modificación",
            "DELETE" => "Eliminación",
            "GET" when esDescargaPdf => "Descarga",
            _ => method
        };

        var segmentos = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        string? tabla = segmentos.Length >= 2 ? segmentos[1] : null;
        string? idRegistro = segmentos.Length >= 3 && int.TryParse(segmentos[2], out _) ? segmentos[2] : null;

        int? idUsuario = int.TryParse(context.User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : null;
        string? ip = context.Connection.RemoteIpAddress?.ToString();
        string descripcion = $"{accion} en módulo '{tabla ?? "sistema"}' ({method} {path})";

        await auditoriaService.RegistrarEventoAsync(idUsuario, accion, tabla, idRegistro, descripcion, ip);
    }
}
