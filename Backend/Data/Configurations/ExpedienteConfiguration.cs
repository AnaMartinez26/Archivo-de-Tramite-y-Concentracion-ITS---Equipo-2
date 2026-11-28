using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class ExpedienteConfiguration : IEntityTypeConfiguration<Expediente>
{
    public void Configure(EntityTypeBuilder<Expediente> e)
    {
        e.ToTable("expedientes");
        e.HasKey(x => x.Id);

        e.Property(x => x.Id)
            .HasColumnName("id");

        e.Property(x => x.NumeroExpediente)
            .HasColumnName("numero_expediente")
            .HasMaxLength(30)
            .IsRequired();

        e.Property(x => x.Titulo)
            .HasColumnName("titulo")
            .HasMaxLength(200)
            .IsRequired();

        e.Property(x => x.IdClasificacion)
            .HasColumnName("id_clasificacion");

        e.Property(x => x.IdCaja)
            .HasColumnName("id_caja");

        e.Property(x => x.FechaApertura)
            .HasColumnName("fecha_apertura")
            .HasColumnType("date");

        e.Property(x => x.FechaCierre)
            .HasColumnName("fecha_cierre")
            .HasColumnType("date");

        e.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasMaxLength(10)
            .IsRequired();

        e.Property(x => x.FechaCreacion)
            .HasColumnName("fecha_creacion")
            .HasDefaultValueSql("SYSDATETIME()");

        e.HasIndex(x => x.NumeroExpediente)
            .IsUnique();

        e.HasOne(x => x.Caja)
            .WithMany(c => c.Expedientes)
            .HasForeignKey(x => x.IdCaja)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
