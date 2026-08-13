using ProdigioApp.Models;

namespace ProdigioApp.Services;

public class FacturaService
{
    private List<Factura> _facturas = new();
    private int _nextId = 1;
    private int _nextItemId = 1;

    public FacturaService()
    {
        // Datos de ejemplo
        var clientes = new[]
        {
            new Cliente { Id = 1, Nombre = "Tech Solutions SRL", Email = "tech@solutions.com", Telefono = "809-555-0101", Direccion = "Av. 27 de Febrero #305, Santo Domingo", RNC = "1-31-12345-6" },
            new Cliente { Id = 2, Nombre = "Innovatech Corp", Email = "info@innovatech.com", Telefono = "809-555-0202", Direccion = "Calle El Conde #10, Zona Colonial", RNC = "1-30-98765-4" },
            new Cliente { Id = 3, Nombre = "Digital Masters SA", Email = "contacto@digitalmasters.do", Telefono = "849-555-0303", Direccion = "Av. Abraham Lincoln #456, Piantini", RNC = "1-01-55555-7" },
        };

        _facturas.Add(new Factura
        {
            Id = _nextId++,
            Numero = "FAC-2026-001",
            Cliente = clientes[0],
            Fecha = new DateTime(2026, 6, 1),
            FechaVencimiento = new DateTime(2026, 6, 30),
            Estado = EstadoFactura.Pagada,
            Notas = "Pago recibido. Gracias por su preferencia.",
            Items = new List<ItemFactura>
            {
                new() { Id = _nextItemId++, Descripcion = "Reparación pantalla iPhone 14 Pro", Cantidad = 1, PrecioUnitario = 8500 },
                new() { Id = _nextItemId++, Descripcion = "Protector de pantalla templado", Cantidad = 2, PrecioUnitario = 350 },
            }
        });

        _facturas.Add(new Factura
        {
            Id = _nextId++,
            Numero = "FAC-2026-002",
            Cliente = clientes[1],
            Fecha = new DateTime(2026, 6, 10),
            FechaVencimiento = new DateTime(2026, 7, 10),
            Estado = EstadoFactura.Pendiente,
            Notas = "Pendiente de aprobación.",
            Items = new List<ItemFactura>
            {
                new() { Id = _nextItemId++, Descripcion = "Samsung Galaxy S24 Ultra 256GB", Cantidad = 2, PrecioUnitario = 89500 },
                new() { Id = _nextItemId++, Descripcion = "Funda protectora premium", Cantidad = 2, PrecioUnitario = 1200 },
                new() { Id = _nextItemId++, Descripcion = "Cargador inalámbrico 45W", Cantidad = 1, PrecioUnitario = 3500 },
            }
        });

        _facturas.Add(new Factura
        {
            Id = _nextId++,
            Numero = "FAC-2026-003",
            Cliente = clientes[2],
            Fecha = new DateTime(2026, 6, 15),
            FechaVencimiento = new DateTime(2026, 6, 20),
            Estado = EstadoFactura.Cancelada,
            Notas = "Cliente solicitó cancelación.",
            Items = new List<ItemFactura>
            {
                new() { Id = _nextItemId++, Descripcion = "Servicio técnico placa base", Cantidad = 1, PrecioUnitario = 5500 },
            }
        });

        _facturas.Add(new Factura
        {
            Id = _nextId++,
            Numero = "FAC-2026-004",
            Cliente = clientes[0],
            Fecha = new DateTime(2026, 6, 18),
            FechaVencimiento = new DateTime(2026, 7, 18),
            Estado = EstadoFactura.Pendiente,
            Notas = "",
            Items = new List<ItemFactura>
            {
                new() { Id = _nextItemId++, Descripcion = "Mantenimiento preventivo x3 equipos", Cantidad = 3, PrecioUnitario = 2500 },
                new() { Id = _nextItemId++, Descripcion = "Limpieza ultrasónica", Cantidad = 3, PrecioUnitario = 800 },
            }
        });
    }

    public List<Factura> GetAll() => _facturas.OrderByDescending(f => f.Fecha).ToList();

    public Factura? GetById(int id) => _facturas.FirstOrDefault(f => f.Id == id);

    public void Crear(Factura factura)
    {
        factura.Id = _nextId++;
        // Asignar IDs a los items
        foreach (var item in factura.Items)
            item.Id = _nextItemId++;
        _facturas.Add(factura);
    }

    public void Actualizar(Factura factura)
    {
        var index = _facturas.FindIndex(f => f.Id == factura.Id);
        if (index >= 0)
        {
            foreach (var item in factura.Items.Where(i => i.Id == 0))
                item.Id = _nextItemId++;
            _facturas[index] = factura;
        }
    }

    public void Eliminar(int id)
    {
        var factura = _facturas.FirstOrDefault(f => f.Id == id);
        if (factura != null)
            _facturas.Remove(factura);
    }

    public string GenerarNumero()
    {
        int num = _facturas.Count + 1;
        return $"FAC-{DateTime.Today.Year}-{num:D3}";
    }

    // Dashboard stats
    public int TotalFacturas => _facturas.Count;
    public decimal TotalCobrado => _facturas.Where(f => f.Estado == EstadoFactura.Pagada).Sum(f => f.Total);
    public decimal TotalPendiente => _facturas.Where(f => f.Estado == EstadoFactura.Pendiente).Sum(f => f.Total);
    public int FacturasPagadas => _facturas.Count(f => f.Estado == EstadoFactura.Pagada);
    public int FacturasPendientes => _facturas.Count(f => f.Estado == EstadoFactura.Pendiente);
    public int FacturasCanceladas => _facturas.Count(f => f.Estado == EstadoFactura.Cancelada);
}
