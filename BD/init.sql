IF DB_ID(N'SATC-ITS') IS NOT NULL
BEGIN
    PRINT 'La base SATC-ITS ya existe, no se ejecuta el script.';
    SET NOEXEC ON;   -- evita que truene al volver a levantar los contenedores
END
GO
CREATE DATABASE [SATC-ITS];
GO
USE [SATC-ITS];
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auditoria](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[fecha_hora] [datetime2](7) NOT NULL,
	[id_usuario] [int] NULL,
	[accion] [nvarchar](30) NOT NULL,
	[tabla_afectada] [nvarchar](50) NULL,
	[id_registro] [nvarchar](50) NULL,
	[descripcion] [nvarchar](1000) NULL,
	[ip] [nvarchar](45) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cajas]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cajas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_caja] [int] NOT NULL,
	[codigo_etiqueta] [nvarchar](50) NULL,
	[ubicacion] [nvarchar](100) NOT NULL,
	[capacidad] [int] NULL,
	[estado] [nvarchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_cajas_numero] UNIQUE NONCLUSTERED 
(
	[numero_caja] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[clasificaciones]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clasificaciones](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](150) NOT NULL,
	[id_padre] [int] NULL,
	[descripcion] [nvarchar](500) NULL,
	[plazo_conservacion] [int] NULL,
	[destino_final] [nvarchar](30) NULL,
	[fundamento_normativo] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[configuracion]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[configuracion](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[clave] [nvarchar](50) NOT NULL,
	[valor] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_configuracion_clave] UNIQUE NONCLUSTERED 
(
	[clave] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[disposiciones]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[disposiciones](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[tipo_disposicion] [nvarchar](30) NOT NULL,
	[fecha_disposicion] [date] NULL,
	[destino_final] [nvarchar](30) NULL,
	[observaciones] [nvarchar](500) NULL,
	[numero_acta] [nvarchar](50) NULL,
	[id_usuario_autoriza] [int] NULL,
	[fecha_registro] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[folio] [nvarchar](30) NOT NULL,
	[titulo] [nvarchar](200) NOT NULL,
	[tipo_documento] [nvarchar](50) NULL,
	[id_expediente] [int] NULL,
	[ruta_archivo] [nvarchar](500) NULL,
	[formato] [nvarchar](10) NULL,
	[fecha_digitalizacion] [datetime2](7) NOT NULL,
	[id_usuario_digitalizo] [int] NULL,
	[fecha_creacion] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_documentos_folio] UNIQUE NONCLUSTERED 
(
	[folio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[etiquetas]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[etiquetas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[fecha_generacion] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[expedientes]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[expedientes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_expediente] [nvarchar](30) NOT NULL,
	[titulo] [nvarchar](200) NOT NULL,
	[id_clasificacion] [int] NULL,
	[id_caja] [int] NULL,
	[fecha_apertura] [date] NULL,
	[fecha_cierre] [date] NULL,
	[estado] [nvarchar](10) NOT NULL,
	[fecha_creacion] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_expedientes_numero] UNIQUE NONCLUSTERED 
(
	[numero_expediente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prestamos]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prestamos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[folio_pase_salida] [nvarchar](30) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[id_solicitante] [int] NOT NULL,
	[tipo_movimiento] [nvarchar](15) NOT NULL,
	[fecha_salida] [date] NOT NULL,
	[fecha_regreso] [date] NULL,
	[fecha_devolucion] [date] NULL,
	[motivo] [nvarchar](500) NULL,
	[estado] [nvarchar](15) NOT NULL,
	[id_usuario_registra] [int] NULL,
	[fecha_registro] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_prestamos_folio] UNIQUE NONCLUSTERED 
(
	[folio_pase_salida] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tramites]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tramites](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[folio] [nvarchar](30) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[id_solicitante] [int] NOT NULL,
	[solicitud] [nvarchar](200) NULL,
	[estado] [nvarchar](30) NOT NULL,
	[observaciones] [nvarchar](500) NULL,
	[firma_token] [nvarchar](255) NULL,
	[id_usuario_revisa] [int] NULL,
	[fecha_ingreso] [datetime2](7) NOT NULL,
	[fecha_resolucion] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_tramites_folio] UNIQUE NONCLUSTERED 
(
	[folio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 10/28/2026 11:17:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[num_empleado] [int] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[Apellido_p] [varchar](50) NOT NULL,
	[Apellido_m] [varchar](50) NOT NULL,
	[Correo_I] [varchar](100) NOT NULL,
	[Pass] [varchar](255) NOT NULL,
	[id_rol] [int] NOT NULL,
	[Estado] [varchar](10) NOT NULL,
	[ultimo_login] [datetime2](7) NULL,
	[fecha_creacion] [datetime2](7) NOT NULL,
	[departamento] [nvarchar](100) NULL,
	[puesto] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Correo_I] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[num_empleado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[auditoria] ADD  DEFAULT (sysdatetime()) FOR [fecha_hora]
GO
ALTER TABLE [dbo].[cajas] ADD  DEFAULT (N'Activo') FOR [estado]
GO
ALTER TABLE [dbo].[disposiciones] ADD  DEFAULT (sysdatetime()) FOR [fecha_registro]
GO
ALTER TABLE [dbo].[documentos] ADD  DEFAULT (sysdatetime()) FOR [fecha_digitalizacion]
GO
ALTER TABLE [dbo].[etiquetas] ADD  DEFAULT (sysdatetime()) FOR [fecha_generacion]
GO
ALTER TABLE [dbo].[expedientes] ADD  DEFAULT (N'Activo') FOR [estado]
GO
ALTER TABLE [dbo].[expedientes] ADD  DEFAULT (sysdatetime()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[prestamos] ADD  DEFAULT (N'Préstamo') FOR [tipo_movimiento]
GO
ALTER TABLE [dbo].[prestamos] ADD  DEFAULT (N'En Préstamo') FOR [estado]
GO
ALTER TABLE [dbo].[prestamos] ADD  DEFAULT (sysdatetime()) FOR [fecha_registro]
GO
ALTER TABLE [dbo].[tramites] ADD  DEFAULT (N'Pendiente') FOR [estado]
GO
ALTER TABLE [dbo].[tramites] ADD  DEFAULT (sysdatetime()) FOR [fecha_ingreso]
GO
ALTER TABLE [dbo].[usuarios] ADD  DEFAULT ('Activo') FOR [Estado]
GO
ALTER TABLE [dbo].[usuarios] ADD  DEFAULT (sysdatetime()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[auditoria]  WITH CHECK ADD  CONSTRAINT [FK_auditoria_usuario] FOREIGN KEY([id_usuario])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[auditoria] CHECK CONSTRAINT [FK_auditoria_usuario]
GO
ALTER TABLE [dbo].[clasificaciones]  WITH CHECK ADD  CONSTRAINT [FK_clasificaciones_padre] FOREIGN KEY([id_padre])
REFERENCES [dbo].[clasificaciones] ([id])
GO
ALTER TABLE [dbo].[clasificaciones] CHECK CONSTRAINT [FK_clasificaciones_padre]
GO
ALTER TABLE [dbo].[disposiciones]  WITH CHECK ADD  CONSTRAINT [FK_disposiciones_autoriza] FOREIGN KEY([id_usuario_autoriza])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[disposiciones] CHECK CONSTRAINT [FK_disposiciones_autoriza]
GO
ALTER TABLE [dbo].[disposiciones]  WITH CHECK ADD  CONSTRAINT [FK_disposiciones_expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[expedientes] ([id])
GO
ALTER TABLE [dbo].[disposiciones] CHECK CONSTRAINT [FK_disposiciones_expediente]
GO
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [FK_documentos_expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[expedientes] ([id])
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [FK_documentos_expediente]
GO
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [FK_documentos_usuario] FOREIGN KEY([id_usuario_digitalizo])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [FK_documentos_usuario]
GO
ALTER TABLE [dbo].[expedientes]  WITH CHECK ADD  CONSTRAINT [FK_expedientes_caja] FOREIGN KEY([id_caja])
REFERENCES [dbo].[cajas] ([id])
GO
ALTER TABLE [dbo].[expedientes] CHECK CONSTRAINT [FK_expedientes_caja]
GO
ALTER TABLE [dbo].[expedientes]  WITH CHECK ADD  CONSTRAINT [FK_expedientes_clasificacion] FOREIGN KEY([id_clasificacion])
REFERENCES [dbo].[clasificaciones] ([id])
GO
ALTER TABLE [dbo].[expedientes] CHECK CONSTRAINT [FK_expedientes_clasificacion]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [FK_prestamos_expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[expedientes] ([id])
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [FK_prestamos_expediente]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [FK_prestamos_registra] FOREIGN KEY([id_usuario_registra])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [FK_prestamos_registra]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [FK_prestamos_solicitante] FOREIGN KEY([id_solicitante])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [FK_prestamos_solicitante]
GO
ALTER TABLE [dbo].[tramites]  WITH CHECK ADD  CONSTRAINT [FK_tramites_expediente] FOREIGN KEY([id_expediente])
REFERENCES [dbo].[expedientes] ([id])
GO
ALTER TABLE [dbo].[tramites] CHECK CONSTRAINT [FK_tramites_expediente]
GO
ALTER TABLE [dbo].[tramites]  WITH CHECK ADD  CONSTRAINT [FK_tramites_revisa] FOREIGN KEY([id_usuario_revisa])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[tramites] CHECK CONSTRAINT [FK_tramites_revisa]
GO
ALTER TABLE [dbo].[tramites]  WITH CHECK ADD  CONSTRAINT [FK_tramites_solicitante] FOREIGN KEY([id_solicitante])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[tramites] CHECK CONSTRAINT [FK_tramites_solicitante]
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD  CONSTRAINT [FK_usuarios_roles] FOREIGN KEY([id_rol])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[usuarios] CHECK CONSTRAINT [FK_usuarios_roles]
GO
ALTER TABLE [dbo].[cajas]  WITH CHECK ADD  CONSTRAINT [CK_cajas_estado] CHECK  (([estado]=N'Inactivo' OR [estado]=N'Activo'))
GO
ALTER TABLE [dbo].[cajas] CHECK CONSTRAINT [CK_cajas_estado]
GO
ALTER TABLE [dbo].[clasificaciones]  WITH CHECK ADD  CONSTRAINT [CK_clasificaciones_destino] CHECK  (([destino_final]=N'Conservación Permanente' OR [destino_final]=N'Destrucción'))
GO
ALTER TABLE [dbo].[clasificaciones] CHECK CONSTRAINT [CK_clasificaciones_destino]
GO
ALTER TABLE [dbo].[clasificaciones]  WITH CHECK ADD  CONSTRAINT [CK_clasificaciones_plazo] CHECK  (([plazo_conservacion] IS NULL OR [plazo_conservacion]>=(0)))
GO
ALTER TABLE [dbo].[clasificaciones] CHECK CONSTRAINT [CK_clasificaciones_plazo]
GO
ALTER TABLE [dbo].[disposiciones]  WITH CHECK ADD  CONSTRAINT [CK_disposiciones_destino] CHECK  (([destino_final]=N'Conservación Permanente' OR [destino_final]=N'Destrucción'))
GO
ALTER TABLE [dbo].[disposiciones] CHECK CONSTRAINT [CK_disposiciones_destino]
GO
ALTER TABLE [dbo].[disposiciones]  WITH CHECK ADD  CONSTRAINT [CK_disposiciones_tipo] CHECK  (([tipo_disposicion]=N'Transferencia Histórica' OR [tipo_disposicion]=N'Transferencia Secundaria' OR [tipo_disposicion]=N'Baja Documental'))
GO
ALTER TABLE [dbo].[disposiciones] CHECK CONSTRAINT [CK_disposiciones_tipo]
GO
ALTER TABLE [dbo].[expedientes]  WITH CHECK ADD  CONSTRAINT [CK_expedientes_estado] CHECK  (([estado]=N'Inactivo' OR [estado]=N'Activo'))
GO
ALTER TABLE [dbo].[expedientes] CHECK CONSTRAINT [CK_expedientes_estado]
GO
ALTER TABLE [dbo].[expedientes]  WITH CHECK ADD  CONSTRAINT [CK_expedientes_fechas] CHECK  (([fecha_cierre] IS NULL OR [fecha_cierre]>=[fecha_apertura]))
GO
ALTER TABLE [dbo].[expedientes] CHECK CONSTRAINT [CK_expedientes_fechas]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [CK_prestamos_estado] CHECK  (([estado]=N'En Prórroga' OR [estado]=N'Vencido' OR [estado]=N'Devuelto' OR [estado]=N'En Préstamo'))
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [CK_prestamos_estado]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [CK_prestamos_fechas] CHECK  (([fecha_regreso] IS NULL OR [fecha_regreso]>=[fecha_salida]))
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [CK_prestamos_fechas]
GO
ALTER TABLE [dbo].[prestamos]  WITH CHECK ADD  CONSTRAINT [CK_prestamos_tipo] CHECK  (([tipo_movimiento]=N'Prórroga' OR [tipo_movimiento]=N'Devolución' OR [tipo_movimiento]=N'Préstamo'))
GO
ALTER TABLE [dbo].[prestamos] CHECK CONSTRAINT [CK_prestamos_tipo]
GO
ALTER TABLE [dbo].[tramites]  WITH CHECK ADD  CONSTRAINT [CK_tramites_estado] CHECK  (([estado]=N'Rechazado' OR [estado]=N'Aprobado' OR [estado]=N'En Revisión por Archivo' OR [estado]=N'Pendiente'))
GO
ALTER TABLE [dbo].[tramites] CHECK CONSTRAINT [CK_tramites_estado]
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD CHECK  (([Estado]='Inactivo' OR [Estado]='Activo'))
GO