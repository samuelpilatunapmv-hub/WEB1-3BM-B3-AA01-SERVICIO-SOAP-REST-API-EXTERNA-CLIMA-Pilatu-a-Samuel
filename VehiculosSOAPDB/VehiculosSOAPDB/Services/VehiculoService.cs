using System.Collections.Generic;
using System.Linq;
using CoreWCF;
using VehiculosSOAPDB.Data;
using VehiculosSOAPDB.Models;

namespace VehiculosSOAPDB.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    public class VehiculoService : IVehiculoService
    {
        private readonly VehiculosDBContext _vehiculosDBContext;

        public VehiculoService(VehiculosDBContext vehiculosDBContext)
        {
            _vehiculosDBContext = vehiculosDBContext;
        }


        // =====================================================
        // CATEGORIAS
        // =====================================================

        public List<Categoria> ObtenerCategorias()
        {
            return _vehiculosDBContext.Categorias.ToList();
        }

        public Categoria AgregarCategoria(Categoria categoria)
        {
            _vehiculosDBContext.Categorias.Add(categoria);
            _vehiculosDBContext.SaveChanges();

            return categoria;
        }

        public Categoria? ActualizarCategoria(Categoria categoria)
        {
            var categoriaExistente =
                _vehiculosDBContext.Categorias
                .Find(categoria.IdCategoria);

            if (categoriaExistente == null)
                return null;

            categoriaExistente.Nombre = categoria.Nombre;
            categoriaExistente.Descripcion = categoria.Descripcion;
            categoriaExistente.Estado = categoria.Estado;

            _vehiculosDBContext.SaveChanges();

            return categoriaExistente;
        }

        public bool EliminarCategoria(int id)
        {
            var categoria =
                _vehiculosDBContext.Categorias.Find(id);

            if (categoria == null)
                return false;

            // No permite eliminar una categoría
            // si todavía tiene vehículos asociados.
            bool tieneVehiculos =
                _vehiculosDBContext.Vehiculos
                .Any(v => v.IdCategoria == id);

            if (tieneVehiculos)
                return false;

            _vehiculosDBContext.Categorias.Remove(categoria);
            _vehiculosDBContext.SaveChanges();

            return true;
        }


        // =====================================================
        // VEHICULOS
        // =====================================================

        public List<Vehiculo> ObtenerVehiculos()
        {
            return _vehiculosDBContext.Vehiculos.ToList();
        }

        public Vehiculo? ObtenerVehiculo(int id)
        {
            return _vehiculosDBContext.Vehiculos
                .FirstOrDefault(v => v.IdVehiculo == id);
        }

        public Vehiculo AgregarVehiculo(Vehiculo vehiculo)
        {
            _vehiculosDBContext.Vehiculos.Add(vehiculo);
            _vehiculosDBContext.SaveChanges();

            return vehiculo;
        }

        public Vehiculo? ActualizarVehiculo(Vehiculo vehiculo)
        {
            var vehiculoExistente =
                _vehiculosDBContext.Vehiculos
                .Find(vehiculo.IdVehiculo);

            if (vehiculoExistente == null)
                return null;

            vehiculoExistente.Placa = vehiculo.Placa;
            vehiculoExistente.Marca = vehiculo.Marca;
            vehiculoExistente.Modelo = vehiculo.Modelo;
            vehiculoExistente.Anio = vehiculo.Anio;
            vehiculoExistente.Precio = vehiculo.Precio;
            vehiculoExistente.Estado = vehiculo.Estado;
            vehiculoExistente.IdCategoria = vehiculo.IdCategoria;

            _vehiculosDBContext.SaveChanges();

            return vehiculoExistente;
        }

        public bool EliminarVehiculo(int id)
        {
            var vehiculo =
                _vehiculosDBContext.Vehiculos.Find(id);

            if (vehiculo == null)
                return false;

            _vehiculosDBContext.Vehiculos.Remove(vehiculo);
            _vehiculosDBContext.SaveChanges();

            return true;
        }

        public List<Vehiculo> ObtenerVehiculosMarca(string marca)
        {
            return _vehiculosDBContext.Vehiculos
                .Where(v => v.Marca.ToLower() == marca.ToLower())
                .ToList();
        }

        public List<Vehiculo> ObtenerVehiculosPorCategoria(int idCategoria)
        {
            return _vehiculosDBContext.Vehiculos
                .Where(v => v.IdCategoria == idCategoria)
                .ToList();
        }
    }
}