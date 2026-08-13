using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProdigioApp.Models;

namespace ProdigioApp.Services
{
    public class ProdigioDatabaseService
    {
        private readonly List<Cotizacion> _cotizaciones = new();
        private readonly List<TasacionPago> _tasaciones = new();
        private readonly List<EquipoInventario> _inventario = new()
        {
            new EquipoInventario { Id = 1, Marca = "Apple", Modelo = "iPhone 15 Pro Max", Capacidad = "256 GB", Color = "Titanio Natural", Estado = "Como Nuevo", PrecioRD = 62500, Disponible = true, Imagen = "/iphone15promax.png", AnioLanzamiento = 2023 },
            new EquipoInventario { Id = 2, Marca = "Apple", Modelo = "iPhone 14 Pro", Capacidad = "128 GB", Color = "Morado Oscuro", Estado = "Excelente", PrecioRD = 44900, Disponible = true, Imagen = "/iphone14pro.png", AnioLanzamiento = 2022 },
            new EquipoInventario { Id = 3, Marca = "Apple", Modelo = "iPhone 13", Capacidad = "128 GB", Color = "Azul Medianoche", Estado = "Como Nuevo", PrecioRD = 29500, Disponible = true, Imagen = "/iphone13.png", AnioLanzamiento = 2021 },
            new EquipoInventario { Id = 4, Marca = "Samsung", Modelo = "Galaxy S24 Ultra", Capacidad = "512 GB", Color = "Titanium Gray", Estado = "Sellado", PrecioRD = 68000, Disponible = true, Imagen = "/s24ultra.png", AnioLanzamiento = 2024 },
            new EquipoInventario { Id = 5, Marca = "Samsung", Modelo = "Galaxy S23 FE", Capacidad = "256 GB", Color = "Verde Menta", Estado = "Como Nuevo", PrecioRD = 28900, Disponible = true, Imagen = "/s23fe.png", AnioLanzamiento = 2023 },
            new EquipoInventario { Id = 6, Marca = "Xiaomi", Modelo = "Xiaomi 13T Pro", Capacidad = "512 GB", Color = "Negro", Estado = "Sellado", PrecioRD = 33000, Disponible = true, Imagen = "/xiaomi13t.png", AnioLanzamiento = 2023 },
            new EquipoInventario { Id = 7, Marca = "Google", Modelo = "Pixel 8 Pro", Capacidad = "128 GB", Color = "Bay Blue", Estado = "Como Nuevo", PrecioRD = 39900, Disponible = true, Imagen = "/pixel8pro.png", AnioLanzamiento = 2023 },
            new EquipoInventario { Id = 8, Marca = "Motorola", Modelo = "Edge 40 Neo", Capacidad = "256 GB", Color = "Caneel Bay", Estado = "Como Nuevo", PrecioRD = 16800, Disponible = true, Imagen = "/motorolaedge.png", AnioLanzamiento = 2023 }
        };

        public string MySqlConnectionString { get; set; } = "Server=localhost;Database=prodigio_tech;Uid=root;Pwd=;";

        public Task<List<EquipoInventario>> ObtenerInventarioAsync()
        {
            return Task.FromResult(_inventario.ToList());
        }

        public Task<bool> AgregarEquipoAsync(EquipoInventario equipo)
        {
            equipo.Id = _inventario.Any() ? _inventario.Max(e => e.Id) + 1 : 1;
            _inventario.Add(equipo);
            return Task.FromResult(true);
        }

        public Task<bool> ActualizarEquipoAsync(EquipoInventario equipo)
        {
            var existente = _inventario.FirstOrDefault(e => e.Id == equipo.Id);
            if (existente != null)
            {
                existente.Marca = equipo.Marca;
                existente.Modelo = equipo.Modelo;
                existente.Capacidad = equipo.Capacidad;
                existente.Color = equipo.Color;
                existente.Estado = equipo.Estado;
                existente.PrecioRD = equipo.PrecioRD;
                existente.Disponible = equipo.Disponible;
                existente.Imagen = equipo.Imagen;
                existente.AnioLanzamiento = equipo.AnioLanzamiento;
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<bool> EliminarEquipoAsync(int id)
        {
            var existente = _inventario.FirstOrDefault(e => e.Id == id);
            if (existente != null)
            {
                _inventario.Remove(existente);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<List<Cotizacion>> ObtenerCotizacionesAsync()
        {
            return Task.FromResult(_cotizaciones.OrderByDescending(c => c.FechaCreacion).ToList());
        }

        public Task<bool> GuardarCotizacionAsync(Cotizacion cotizacion)
        {
            cotizacion.Id = _cotizaciones.Count + 1;
            _cotizaciones.Add(cotizacion);
            return Task.FromResult(true);
        }

        public Task<List<TasacionPago>> ObtenerTasacionesAsync()
        {
            return Task.FromResult(_tasaciones.OrderByDescending(t => t.FechaPago).ToList());
        }

        public Task<bool> RegistrarTasacionPagoAsync(TasacionPago pago)
        {
            pago.Id = _tasaciones.Count + 1;
            _tasaciones.Add(pago);
            return Task.FromResult(true);
        }
    }
}
