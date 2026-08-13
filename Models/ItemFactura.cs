namespace ProdigioApp.Models;

public class ItemFactura
{
    public int Id { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int Cantidad { get; set; } = 1;
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal => Cantidad * PrecioUnitario;
}
