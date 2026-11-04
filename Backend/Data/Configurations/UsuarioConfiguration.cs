using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

// Mapeo de la tabla usuarios
public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> e)
    {
        e.ToTable("usuarios");
        e.HasKey(u => u.Id);

        e.Property(u => u.Id).HasColumnName("id");
        e.Property(u => u.NumEmpleado).HasColumnName("num_empleado");
        e.Property(u => u.Nombre).HasMaxLength(50).IsRequired();
        e.Property(u => u.ApellidoP).HasColumnName("Apellido_p").HasMaxLength(50).IsRequired();
        e.Property(u => u.ApellidoM).HasColumnName("Apellido_m").HasMaxLength(50).IsRequired();
        e.Property(u => u.Correo).HasColumnName("Correo_I").HasMaxLength(100).IsRequired();
        e.Property(u => u.Pass).HasMaxLength(255).IsRequired();
        e.Property(u => u.IdRol).HasColumnName("id_rol");
        e.Property(u => u.Estado).HasMaxLength(10).IsRequired();
        e.Property(u => u.UltimoLogin).HasColumnName("ultimo_login");
        e.Property(u => u.FechaCreacion).HasColumnName("fecha_creacion")
                                        .HasDefaultValueSql("SYSDATETIME()");

        e.HasIndex(u => u.NumEmpleado).IsUnique();
        e.HasIndex(u => u.Correo).IsUnique();

        // Llave foránea usuarios.id_rol -> roles.id
        e.HasOne(u => u.Rol)
         .WithMany(r => r.Usuarios)
         .HasForeignKey(u => u.IdRol);
    }
}
