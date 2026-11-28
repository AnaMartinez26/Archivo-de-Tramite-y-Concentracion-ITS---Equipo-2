namespace Backend.Models.Enums;

// Valores exactos permitidos por los CHECK de la tabla prestamos en BD/init.sql
public static class EstadoPrestamo
{
    public const string EnPrestamo = "En Préstamo";
    public const string Devuelto = "Devuelto";
    public const string Vencido = "Vencido";
    public const string EnProrroga = "En Prórroga";
}

public static class TipoMovimientoPrestamo
{
    public const string Prestamo = "Préstamo";
    public const string Devolucion = "Devolución";
    public const string Prorroga = "Prórroga";
}
