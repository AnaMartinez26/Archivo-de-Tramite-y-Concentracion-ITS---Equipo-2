using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

// Mapeo de la tabla tramites (Control de Flujo de Información)
public class TramiteConfiguration : IEntityTypeConfiguration<Tramite>
{
    public void Configure(EntityTypeBuilder<Tramite> e)
    {
        e.ToTable("tramites");
        e.HasKey(t => t.Id);

        e.Property(t => t.Id).HasColumnName("id");
        e.Property(t => t.Folio).HasColumnName("folio").HasMaxLength(30).IsRequired();
        e.Property(t => t.IdExpediente).HasColumnName("id_expediente");
        e.Property(t => t.IdSolicitante).HasColumnName("id_solicitante");
        e.Property(t => t.Solicitud).HasColumnName("solicitud").HasMaxLength(200);
        e.Property(t => t.Estado).HasColumnName("estado").HasMaxLength(30).IsRequired();
        e.Property(t => t.Observaciones).HasColumnName("observaciones").HasMaxLength(500);
        e.Property(t => t.FirmaToken).HasColumnName("firma_token").HasMaxLength(255);
        e.Property(t => t.IdUsuarioRevisa).HasColumnName("id_usuario_revisa");
        e.Property(t => t.FechaIngreso).HasColumnName("fecha_ingreso").HasDefaultValueSql("SYSDATETIME()");
        e.Property(t => t.FechaResolucion).HasColumnName("fecha_resolucion");

        e.HasIndex(t => t.Folio).IsUnique();

        e.HasOne(t => t.Expediente).WithMany()
         .HasForeignKey(t => t.IdExpediente).OnDelete(DeleteBehavior.Restrict);

        e.HasOne(t => t.Solicitante).WithMany()
         .HasForeignKey(t => t.IdSolicitante).OnDelete(DeleteBehavior.Restrict);

        e.HasOne(t => t.UsuarioRevisa).WithMany()
         .HasForeignKey(t => t.IdUsuarioRevisa).OnDelete(DeleteBehavior.Restrict);
    }
}
