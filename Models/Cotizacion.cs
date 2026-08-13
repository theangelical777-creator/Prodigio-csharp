using System;

namespace ProdigioApp.Models
{
    public class Cotizacion
    {
        public int Id { get; set; }
        public string Folio { get; set; } = $"PT-{Random.Shared.Next(100000, 999999)}";
        public string ClienteNombre { get; set; } = "";
        public string ClienteTelefono { get; set; } = "";
        public string EquipoMarca { get; set; } = "";
        public string EquipoModelo { get; set; } = "";
        public string TipoReparacion { get; set; } = "";
        public decimal CostoRepuesto { get; set; }
        public decimal CostoManoObra { get; set; }
        public decimal Total => CostoRepuesto + CostoManoObra;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public string Estado { get; set; } = "Pendiente";
    }
}
