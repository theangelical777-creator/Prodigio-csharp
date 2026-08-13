namespace ProdigioApp.Models
{
    public class EquipoInventario
    {
        public int Id { get; set; }
        public string Marca { get; set; } = "";
        public string Modelo { get; set; } = "";
        public string Capacidad { get; set; } = "";
        public string Color { get; set; } = "";
        public string Estado { get; set; } = "";
        public decimal PrecioRD { get; set; }
        public bool Disponible { get; set; }
        public string Imagen { get; set; } = "";
        public int AnioLanzamiento { get; set; } = 2023;
    }
}
