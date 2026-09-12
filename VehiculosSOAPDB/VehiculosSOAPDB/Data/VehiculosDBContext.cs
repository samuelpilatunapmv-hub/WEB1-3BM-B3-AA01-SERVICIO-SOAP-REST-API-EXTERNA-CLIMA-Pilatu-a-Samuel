using Microsoft.EntityFrameworkCore;
using VehiculosSOAPDB.Models;

namespace VehiculosSOAPDB.Data
{
    public class VehiculosDBContext : DbContext
    {
        public VehiculosDBContext(
            DbContextOptions<VehiculosDBContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Vehiculo> Vehiculos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Categoria>()
                .ToTable("Categoria");

            modelBuilder.Entity<Vehiculo>()
                .ToTable("Vehiculo");
        }
    }
}