namespace ProdigioApp.Models;

public enum EstadoFactura
{
    Pendiente,
    Pagada,
    Cancelada
}

public class Factura
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public Cliente Cliente { get; set; } = new();
    public DateTime Fecha { get; set; } = DateTime.Today;
    public DateTime? FechaVencimiento { get; set; }
    public List<ItemFactura> Items { get; set; } = new();
    public EstadoFactura Estado { get; set; } = EstadoFactura.Pendiente;
    public string Notas { get; set; } = string.Empty;
    public decimal Subtotal => Items.Sum(i => i.Subtotal);
    public decimal ITBIS => Subtotal * 0.18m;
    public decimal Total => Subtotal + ITBIS;
}
