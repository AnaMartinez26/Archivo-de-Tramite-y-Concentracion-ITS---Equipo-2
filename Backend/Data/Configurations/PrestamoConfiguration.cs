using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

// Mapeo de la tabla prestamos
public class PrestamoConfiguration : IEntityTypeConfiguration<Prestamo>
{
    public void Configure(EntityTypeBuilder<Prestamo> e)
    {
        e.ToTable("prestamos");
        e.HasKey(p => p.Id);

        e.Property(p => p.Id).HasColumnName("id");
        e.Property(p => p.FolioPaseSalida).HasColumnName("folio_pase_salida").HasMaxLength(30).IsRequired();
        e.Property(p => p.IdExpediente).HasColumnName("id_expediente");
        e.Property(p => p.IdSolicitante).HasColumnName("id_solicitante");
        e.Property(p => p.TipoMovimiento).HasColumnName("tipo_movimiento").HasMaxLength(15).IsRequired();
        e.Property(p => p.FechaSalida).HasColumnName("fecha_salida").HasColumnType("date");
        e.Property(p => p.FechaRegreso).HasColumnName("fecha_regreso").HasColumnType("date");
        e.Property(p => p.FechaDevolucion).HasColumnName("fecha_devolucion").HasColumnType("date");
        e.Property(p => p.Motivo).HasColumnName("motivo").HasMaxLength(500);
        e.Property(p => p.Estado).HasColumnName("estado").HasMaxLength(15).IsRequired();
        e.Property(p => p.IdUsuarioRegistra).HasColumnName("id_usuario_registra");
        e.Property(p => p.FechaRegistro).HasColumnName("fecha_registro").HasDefaultValueSql("SYSDATETIME()");

        e.HasIndex(p => p.FolioPaseSalida).IsUnique();

        e.HasOne(p => p.Expediente).WithMany().HasForeignKey(p => p.IdExpediente).OnDelete(DeleteBehavior.NoAction);
        e.HasOne(p => p.Solicitante).WithMany().HasForeignKey(p => p.IdSolicitante).OnDelete(DeleteBehavior.NoAction);
    }
}
