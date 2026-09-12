using Microsoft.EntityFrameworkCore;
using VehiculosREST.Models;

namespace VehiculosREST.Data;

public class VehiculosDbContext : DbContext
{
    public VehiculosDbContext(DbContextOptions<VehiculosDbContext> options)
        : base(options)
    {
    }

    public DbSet<Categoria> Categorias => Set<Categoria>();

    public DbSet<Vehiculo> Vehiculos => Set<Vehiculo>();

    public DbSet<Mantenimiento> Mantenimientos => Set<Mantenimiento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("Categoria");

            entity.HasKey(c => c.IdCategoria);

            entity.Property(c => c.Nombre)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(c => c.Descripcion)
                .HasMaxLength(200)
                .IsRequired();
        });

        modelBuilder.Entity<Vehiculo>(entity =>
        {
            entity.ToTable("Vehiculo");

            entity.HasKey(v => v.IdVehiculo);

            entity.Property(v => v.Placa)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(v => v.Marca)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(v => v.Modelo)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(v => v.Precio)
                .HasColumnType("decimal(10,2)");

            entity.HasOne(v => v.Categoria)
                .WithMany(c => c.Vehiculos)
                .HasForeignKey(v => v.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Vehiculo_Categoria");
        });

        modelBuilder.Entity<Mantenimiento>(entity =>
        {
            entity.ToTable("Mantenimiento");

            entity.HasKey(m => m.IdMantenimiento);

            entity.Property(m => m.Tipo)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(m => m.Descripcion)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(m => m.Costo)
                .HasColumnType("decimal(10,2)");

            entity.Property(m => m.Kilometraje)
                .HasColumnType("decimal(10,2)");

            entity.HasOne(m => m.Vehiculo)
                .WithMany(v => v.Mantenimientos)
                .HasForeignKey(m => m.IdVehiculo)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Mantenimiento_Vehiculo");
        });
    }
}