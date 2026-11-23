using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class DisposicionConfiguration : IEntityTypeConfiguration<Disposicion>
{
    public void Configure(EntityTypeBuilder<Disposicion> builder)
    {
        builder.ToTable("disposiciones");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .HasColumnName("id");

        builder.Property(d => d.IdExpediente)
            .HasColumnName("id_expediente")
            .IsRequired();

        builder.Property(d => d.TipoDisposicion)
            .HasColumnName("tipo_disposicion")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(d => d.FechaDisposicion)
            .HasColumnName("fecha_disposicion")
            .HasColumnType("date");

        builder.Property(d => d.DestinoFinal)
            .HasColumnName("destino_final")
            .HasMaxLength(30);

        builder.Property(d => d.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(500);

        builder.Property(d => d.NumeroActa)
            .HasColumnName("numero_acta")
            .HasMaxLength(50);

        builder.Property(d => d.IdUsuarioAutoriza)
            .HasColumnName("id_usuario_autoriza");

        builder.Property(d => d.FechaRegistro)
            .HasColumnName("fecha_registro")
            .HasColumnType("datetime2(7)")
            .HasDefaultValueSql("SYSDATETIME()");

        builder.HasOne(d => d.Expediente)
            .WithMany()
            .HasForeignKey(d => d.IdExpediente)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.UsuarioAutoriza)
            .WithMany()
            .HasForeignKey(d => d.IdUsuarioAutoriza)
            .OnDelete(DeleteBehavior.Restrict);
    }
}