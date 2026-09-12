using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VehiculosREST.Models;

public class Categoria
{
    [Key]
    public int IdCategoria { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public bool Estado { get; set; }

    [JsonIgnore]
    public ICollection<Vehiculo> Vehiculos { get; set; } = new List<Vehiculo>();
}