using ProdigioApp.Models;

namespace ProdigioApp.Services;

public class EmpresaInstitucionalService
{
    private static readonly EmpresaInstitucional Datos = new()
    {
        Lema = "Donde tú eres el valor",
        Mision = "Brindar soluciones tecnológicas accesibles y de la más alta calidad en reparación y comercialización de dispositivos móviles, colocando siempre al cliente en el centro de todas nuestras decisiones bajo el lema: \"Donde tú eres el valor\".",
        Vision = "Ser reconocidos en el año 2030 como la cadena de centros de servicio técnico y venta de móviles más confiable, innovadora y sostenible del país, destacándonos por la excelencia técnica y una atención humana e impecable.",
        Valores = new List<ValorEmpresa>
        {
            new("Transparencia", "Mostramos diagnósticos honestos y justos. El cliente siempre sabe exactamente qué paga y por qué.", "🤝"),
            new("Excelencia", "Buscamos la perfección en cada soldadura, cada reparación de pantalla y cada interacción con el cliente.", "🏆"),
            new("Agilidad", "Valoramos tu tiempo. Optimizamos nuestros flujos de trabajo para entregar soluciones rápidas.", "⚡"),
            new("Sostenibilidad", "Fomentamos la reparación y el reciclaje inteligente para reducir la basura electrónica global.", "🌱"),
            new("Compromiso", "Cumplimos cada promesa: garantía escrita, plazos de entrega y precios claros desde el primer contacto.", "💪"),
            new("Innovación", "Adoptamos las mejores herramientas y técnicas del mercado para ofrecer servicios de vanguardia.", "💡")
        }
    };

    public EmpresaInstitucional Obtener() => Datos;

    public string ObtenerCodigoFuente() =>
        """
        // Models/EmpresaInstitucional.cs
        namespace ProdigioApp.Models;

        public record ValorEmpresa(string Nombre, string Descripcion, string Emoji);

        public class EmpresaInstitucional
        {
            public string Lema { get; set; } = "Donde tú eres el valor";
            public string Mision { get; set; } = string.Empty;
            public string Vision { get; set; } = string.Empty;
            public List<ValorEmpresa> Valores { get; set; } = new();
        }

        // Services/EmpresaInstitucionalService.cs
        public class EmpresaInstitucionalService
        {
            public EmpresaInstitucional Obtener()
            {
                return new EmpresaInstitucional
                {
                    Mision = "Brindar soluciones tecnológicas accesibles...",
                    Vision = "Ser reconocidos en el año 2030...",
                    Valores = new List<ValorEmpresa>
                    {
                        new("Transparencia", "Diagnósticos honestos...", "🤝"),
                        new("Excelencia", "Perfección en cada reparación...", "🏆"),
                        new("Agilidad", "Soluciones rápidas...", "⚡"),
                        new("Sostenibilidad", "Reparación y reciclaje...", "🌱")
                    }
                };
            }
        }
        """;
}
