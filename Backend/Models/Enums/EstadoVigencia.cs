namespace Backend.Models.Enums;

// Alerta de vencimiento de un expediente (se calcula con la fecha de cierre; no se guarda en la BD)
public static class EstadoVigencia
{
    public const string Vigente = "Vigente";
    public const string ProximoAVencer = "Próximo a vencer";
    public const string Vencido = "Vencido";

    // Días antes del vencimiento en los que el expediente pasa a "Próximo a vencer"
    public const int DiasAviso = 30;

    public static string Calcular(DateTime vencimiento, DateTime hoy)
    {
        var dias = (vencimiento.Date - hoy.Date).Days;
        if (dias < 0) return Vencido;
        if (dias <= DiasAviso) return ProximoAVencer;
        return Vigente;
    }
}
