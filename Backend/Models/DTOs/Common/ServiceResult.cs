namespace Backend.Models.DTOs.Common;

// Resultado de una operación de servicio: datos o un error con su código HTTP
public class ServiceResult<T>
{
    public bool Exito { get; private init; }
    public T? Data { get; private init; }
    public string Mensaje { get; private init; } = string.Empty;
    public int StatusCode { get; private init; } = 200;

    public static ServiceResult<T> Ok(T data, string mensaje = "OK", int statusCode = 200) =>
        new() { Exito = true, Data = data, Mensaje = mensaje, StatusCode = statusCode };

    public static ServiceResult<T> Error(string mensaje, int statusCode = 400) =>
        new() { Exito = false, Mensaje = mensaje, StatusCode = statusCode };
}
