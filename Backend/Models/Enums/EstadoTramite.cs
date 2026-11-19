namespace Backend.Models.Enums;

// Valores exactos permitidos por el CHECK CK_tramites_estado en BD/init.sql
public static class EstadoTramite
{
    public const string Pendiente = "Pendiente";
    public const string EnRevision = "En Revisión por Archivo";
    public const string Aprobado = "Aprobado";
    public const string Rechazado = "Rechazado";

    public static readonly string[] Todos = { Pendiente, EnRevision, Aprobado, Rechazado };

    public static bool EsValido(string? estado) =>
        !string.IsNullOrWhiteSpace(estado) && Todos.Contains(estado.Trim(), StringComparer.Ordinal);
}
