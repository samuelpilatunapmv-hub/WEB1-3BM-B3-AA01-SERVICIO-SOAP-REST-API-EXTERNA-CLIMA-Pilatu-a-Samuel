using System.Collections.Generic;
using CoreWCF;
using VehiculosSOAPDB.Models;

namespace VehiculosSOAPDB.Services
{
    [ServiceContract]
    public interface IVehiculoService
    {
        // ==========================
        // CATEGORIAS
        // ==========================

        [OperationContract]
        List<Categoria> ObtenerCategorias();

        [OperationContract]
        Categoria AgregarCategoria(Categoria categoria);

        [OperationContract]
        Categoria? ActualizarCategoria(Categoria categoria);

        [OperationContract]
        bool EliminarCategoria(int id);


        // ==========================
        // VEHICULOS
        // ==========================

        [OperationContract]
        List<Vehiculo> ObtenerVehiculos();

        [OperationContract]
        Vehiculo? ObtenerVehiculo(int id);

        [OperationContract]
        Vehiculo AgregarVehiculo(Vehiculo vehiculo);

        [OperationContract]
        Vehiculo? ActualizarVehiculo(Vehiculo vehiculo);

        [OperationContract]
        bool EliminarVehiculo(int id);

        [OperationContract]
        List<Vehiculo> ObtenerVehiculosMarca(string marca);

        [OperationContract]
        List<Vehiculo> ObtenerVehiculosPorCategoria(int idCategoria);
    }
}