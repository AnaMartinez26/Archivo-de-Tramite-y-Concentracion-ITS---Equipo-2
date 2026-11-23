using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class EtiquetaConfiguration : IEntityTypeConfiguration<Etiqueta>
{
    public void Configure(EntityTypeBuilder<Etiqueta> builder)
    {
        builder.ToTable("etiquetas");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.IdExpediente)
            .HasColumnName("id_expediente")
            .IsRequired();

        builder.Property(e => e.FechaGeneracion)
            .HasColumnName("fecha_generacion")
            .HasColumnType("datetime2(7)")
            .HasDefaultValueSql("SYSDATETIME()");

        builder.HasOne(e => e.Expediente)
            .WithMany()
            .HasForeignKey(e => e.IdExpediente)
            .OnDelete(DeleteBehavior.Restrict);
    }
}