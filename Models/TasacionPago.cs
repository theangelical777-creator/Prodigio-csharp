using System;

namespace ProdigioApp.Models
{
    public class TasacionPago
    {
        public int Id { get; set; }
        public string Folio { get; set; } = $"TAS-{Random.Shared.Next(100000, 999999)}";
        public string ClienteNombre { get; set; } = "";
        public string ClienteTelefono { get; set; } = "";
        public string Marca { get; set; } = "";
        public string Modelo { get; set; } = "";
        public string EstadoEquipo { get; set; } = "";
        public decimal MontoPagado { get; set; } = 500.00m;
        public string MetodoPago { get; set; } = "Tarjeta";
        public DateTime FechaPago { get; set; } = DateTime.Now;
        public string EstadoProceso { get; set; } = "Asignado a Especialista";
    }
}
