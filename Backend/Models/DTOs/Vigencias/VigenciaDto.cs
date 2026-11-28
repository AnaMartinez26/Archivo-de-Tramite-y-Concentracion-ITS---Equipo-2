namespace Backend.Models.DTOs.Vigencias;

public class VigenciaDto
{
    public int Id { get; set; }
    public string NumeroExpediente { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public string Estado { get; set; } = string.Empty;   // Vigente / Próximo a vencer / Vencido
    public int? DiasParaVencer { get; set; }             // negativo = ya venció
}

public class VigenciaResumenDto
{
    public int Vigentes { get; set; }
    public int ProximosAVencer { get; set; }
    public int Vencidos { get; set; }
    public List<string> NumerosVencidos { get; set; } = new();   // máximo 10
}
