using System.ComponentModel.DataAnnotations;

namespace VehiculosSOAPDB.Models
{
    public class Vehiculo
    {
        [Key]
        public int IdVehiculo { get; set; }

        public string Placa { get; set; } = string.Empty;

        public string Marca { get; set; } = string.Empty;

        public string Modelo { get; set; } = string.Empty;

        public int Anio { get; set; }

        public decimal Precio { get; set; }

        public bool Estado { get; set; }

        public int IdCategoria { get; set; }
    }
}