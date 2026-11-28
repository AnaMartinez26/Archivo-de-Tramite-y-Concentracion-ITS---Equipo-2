using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class AuditoriaConfiguration : IEntityTypeConfiguration<Auditoria>
{
    public void Configure(EntityTypeBuilder<Auditoria> e)
    {
        e.ToTable("auditoria");
        e.HasKey(a => a.Id);

        e.Property(a => a.Id).HasColumnName("id");
        e.Property(a => a.FechaHora).HasColumnName("fecha_hora").HasDefaultValueSql("SYSDATETIME()");
        e.Property(a => a.IdUsuario).HasColumnName("id_usuario");
        e.Property(a => a.Accion).HasColumnName("accion").HasMaxLength(30).IsRequired();
        e.Property(a => a.TablaAfectada).HasColumnName("tabla_afectada").HasMaxLength(50);
        e.Property(a => a.IdRegistro).HasColumnName("id_registro").HasMaxLength(50);
        e.Property(a => a.Descripcion).HasColumnName("descripcion").HasMaxLength(1000);
        e.Property(a => a.Ip).HasColumnName("ip").HasMaxLength(45);

        e.HasOne(a => a.Usuario)
         .WithMany()
         .HasForeignKey(a => a.IdUsuario)
         .OnDelete(DeleteBehavior.SetNull);
    }
}
