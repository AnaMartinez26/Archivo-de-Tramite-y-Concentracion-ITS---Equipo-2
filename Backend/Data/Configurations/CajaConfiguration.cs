using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class CajaConfiguration : IEntityTypeConfiguration<Caja>
{
    public void Configure(EntityTypeBuilder<Caja> builder)
    {
        builder.ToTable("cajas");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("id");

        builder.Property(c => c.CajaNumero)
            .HasColumnName("numero_caja")
            .IsRequired();

        builder.Property(c => c.CodigoEtiqueta)
            .HasColumnName("codigo_etiqueta")
            .HasMaxLength(50)
            .IsRequired(false);

        builder.Property(c => c.UbicacionPasilloEstanteBateria)
            .HasColumnName("ubicacion")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.Capacidad)
            .HasColumnName("capacidad")
            .IsRequired(false);

        builder.Property(c => c.Estado)
            .HasColumnName("estado")
            .HasMaxLength(10)
            .IsRequired();

        builder.HasIndex(c => c.CajaNumero)
            .IsUnique();
    }
}