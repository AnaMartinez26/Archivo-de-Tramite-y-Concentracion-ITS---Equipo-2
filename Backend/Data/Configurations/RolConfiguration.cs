using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

// Mapeo de la tabla roles
public class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> e)
    {
        e.ToTable("roles");
        e.HasKey(r => r.Id);

        e.Property(r => r.Id).HasColumnName("id");
        e.Property(r => r.Nombre).HasMaxLength(20).IsRequired();

        e.HasIndex(r => r.Nombre).IsUnique();
    }
}
