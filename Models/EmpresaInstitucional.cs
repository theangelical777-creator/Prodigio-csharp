namespace ProdigioApp.Models;

public record ValorEmpresa(string Nombre, string Descripcion, string Emoji);

public class EmpresaInstitucional
{
    public string Lema { get; set; } = "Donde tú eres el valor";
    public string Mision { get; set; } = string.Empty;
    public string Vision { get; set; } = string.Empty;
    public List<ValorEmpresa> Valores { get; set; } = new();
}
