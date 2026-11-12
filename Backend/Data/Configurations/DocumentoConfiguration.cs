using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class DocumentoConfiguration : IEntityTypeConfiguration<Documento>
{
    public void Configure(EntityTypeBuilder<Documento> e)
    {
        e.ToTable("documentos");
        e.HasKey(d => d.Id);
        e.Property(d => d.Id).HasColumnName("id");
        e.Property(d => d.Folio).HasColumnName("folio").HasMaxLength(30).IsRequired();
        e.Property(d => d.Titulo).HasColumnName("titulo").HasMaxLength(200).IsRequired();
        e.Property(d => d.TipoDocumento).HasColumnName("tipo_documento").HasMaxLength(50);
        e.Property(d => d.IdExpediente).HasColumnName("id_expediente");
        e.Property(d => d.RutaArchivo).HasColumnName("ruta_archivo").HasMaxLength(500);
        e.Property(d => d.Formato).HasColumnName("formato").HasMaxLength(10);
        e.Property(d => d.FechaCreacion).HasColumnName("fecha_creacion");
        e.Property(d => d.FechaDigitalizacion).HasColumnName("fecha_digitalizacion")
                                              .HasDefaultValueSql("SYSDATETIME()");
        e.Property(d => d.IdUsuarioDigitalizo).HasColumnName("id_usuario_digitalizo");
        e.HasIndex(d => d.Folio).IsUnique();
        e.HasOne(d => d.UsuarioDigitalizo)
         .WithMany()
         .HasForeignKey(d => d.IdUsuarioDigitalizo);
    }
}