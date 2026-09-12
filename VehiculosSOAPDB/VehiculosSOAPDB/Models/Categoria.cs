using System.ComponentModel.DataAnnotations;

namespace VehiculosSOAPDB.Models
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public bool Estado { get; set; }
    }
}