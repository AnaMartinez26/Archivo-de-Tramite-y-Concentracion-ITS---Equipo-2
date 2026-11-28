using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class ClasificacionConfiguration : IEntityTypeConfiguration<Clasificacion>
{
    public void Configure(EntityTypeBuilder<Clasificacion> builder)
    {
        builder.ToTable("clasificaciones");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("id");

        builder.Property(c => c.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(c => c.IdPadre)
            .HasColumnName("id_padre")
            .IsRequired(false);

        builder.Property(c => c.Descripcion)
            .HasColumnName("descripcion")
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(c => c.PlazoConservacion)
            .HasColumnName("plazo_conservacion")
            .IsRequired(false);

        builder.Property(c => c.DestinoFinal)
            .HasColumnName("destino_final")
            .HasMaxLength(30)
            .IsRequired(false);

        builder.Property(c => c.FundamentoNormativo)
            .HasColumnName("fundamento_normativo")
            .HasMaxLength(255)
            .IsRequired(false);

        // Relación jerárquica: una clasificación puede tener varias hijas.
        builder.HasOne(c => c.Padre)
            .WithMany(c => c.Hijas)
            .HasForeignKey(c => c.IdPadre)
            .OnDelete(DeleteBehavior.Restrict);

        // Una clasificación puede estar asociada a varios expedientes.
        builder.HasMany(c => c.Expedientes)
            .WithOne(e => e.Clasificacion)
            .HasForeignKey(e => e.IdClasificacion)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
