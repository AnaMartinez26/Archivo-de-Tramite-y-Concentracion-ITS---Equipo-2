// Definición de vistas, módulos permitidos e indicadores por rol de usuario
// Basado en el Diagrama de Casos de Uso (pág. 10) y Arquitectura (pág. 11)

export const PERFILES_ROL = {
  Administrador: {
    rol: 'Administrador',
    tituloVista: 'Panel de Administrador del Sistema',
    subtitulo: 'Administración global, estructura archivística y seguridad',
    resumen:
      'Gestiona cuentas y roles del personal, define el Cuadro General de Clasificación Archivística (CGCA), supervisa la trazabilidad, el resguardo digital y la bitácora de auditoría.',
    rutas: [
      '/usuarios',
      '/clasificacion',
      '/prestamos',
      '/digitalizacion',
      '/auditoria',
      '/configuracion'
    ],
    kpis: [
      {
        label: 'Usuarios activos',
        endpoint: '/usuarios',
        calc: d => `${d.filter(u => u.estado === 'Activo').length} / ${d.length}`,
        sub: 'Cuentas habilitadas en el sistema'
      },
      {
        label: 'Niveles / Series CGCA',
        endpoint: '/clasificaciones',
        calc: d => String(d.length),
        sub: 'Estructura jerárquica registrada'
      },
      {
        label: 'Réplicas digitales',
        endpoint: '/digitalizacion',
        calc: d => String(d.length),
        sub: 'Documentos PDF resguardados'
      }
    ]
  },

  'Encargada de Archivo': {
    rol: 'Encargada de Archivo',
    tituloVista: 'Panel de Encargada del Archivo de Concentración',
    subtitulo: 'Coordinación integral del acervo documental físico y digital',
    resumen:
      'Administra la clasificación y etiquetado de expedientes, ubicación en cajas, digitalización, control de entradas y salidas, flujo de aprobación, vigencias (CADIDO) y disposición documental.',
    rutas: [
      '/etiquetado',
      '/prestamos',
      '/digitalizacion',
      '/almacenamiento',
      '/workflow',
      '/vigencias',
      '/disposicion'
    ],
    kpis: [
      {
        label: 'Expedientes registrados',
        endpoint: '/expedientes',
        calc: d => String(d.length),
        sub: 'Acervo documental clasificado'
      },
      {
        label: 'Cajas en archivo físico',
        endpoint: '/almacenamiento/cajas',
        calc: d => String(d.length),
        sub: 'Unidades en estantería'
      },
      {
        label: 'Trámites en atención',
        endpoint: '/workflow',
        calc: d =>
          String(
            d.filter(t => t.estado === 'Pendiente' || t.estado === 'En Revisión por Archivo').length
          ),
        sub: 'Pendientes o en revisión'
      }
    ]
  },

  'Trabajador RRHH': {
    rol: 'Trabajador RRHH',
    tituloVista: 'Portal de Recursos Humanos',
    subtitulo: 'Consulta documental, digitalización y solicitud de préstamos',
    resumen:
      'Consulta réplicas digitales de expedientes laborales del personal, registra documentación digitalizada y gestiona pases de salida y devoluciones de expedientes físicos.',
    rutas: ['/prestamos', '/digitalizacion'],
    kpis: [
      {
        label: 'Documentos disponibles',
        endpoint: '/digitalizacion',
        calc: d => String(d.length),
        sub: 'Réplicas PDF para consulta'
      },
      {
        label: 'Expedientes en acervo',
        endpoint: '/expedientes',
        calc: d => String(d.length),
        sub: 'Memoria laboral registrada'
      },
      {
        label: 'Módulos habilitados',
        valorFijo: '2',
        sub: 'Trazabilidad y Digitalización'
      }
    ]
  },

  'Servicio Social': {
    rol: 'Servicio Social',
    tituloVista: 'Panel Operativo de Servicio Social',
    subtitulo: 'Apoyo en captura, etiquetado, cajas y digitalización',
    resumen:
      'Realiza actividades operativas supervisadas de clasificación y generación de marbetes, asignación de cajas en estantería y carga de réplicas digitales en formato PDF.',
    rutas: ['/etiquetado', '/digitalizacion', '/almacenamiento'],
    kpis: [
      {
        label: 'Expedientes clasificados',
        endpoint: '/expedientes',
        calc: d => String(d.length),
        sub: 'Expedientes y marbetes'
      },
      {
        label: 'Documentos digitalizados',
        endpoint: '/digitalizacion',
        calc: d => String(d.length),
        sub: 'Archivos PDF capturados'
      },
      {
        label: 'Cajas ubicadas',
        endpoint: '/almacenamiento/cajas',
        calc: d => String(d.length),
        sub: 'Almacenamiento sistematizado'
      }
    ]
  },

  Directivo: {
    rol: 'Directivo',
    tituloVista: 'Panel Directivo de Supervisión y Autorización',
    subtitulo: 'Cumplimiento normativo, firma de trámites y disposición final',
    resumen:
      'Supervisa el cumplimiento normativo e integridad del archivo, aprueba o rechaza trámites mediante firma electrónica y autoriza transferencias o bajas documentales.',
    rutas: ['/workflow', '/auditoria', '/disposicion'],
    kpis: [
      {
        label: 'Trámites por dictaminar',
        endpoint: '/workflow',
        calc: d =>
          String(
            d.filter(t => t.estado === 'Pendiente' || t.estado === 'En Revisión por Archivo').length
          ),
        sub: 'Requieren revisión o firma'
      },
      {
        label: 'Disposiciones pendientes',
        endpoint: '/disposicion',
        calc: d => String(d.filter(x => x.estado === 'Pendiente').length),
        sub: 'Por autorizar transferencia/baja'
      },
      {
        label: 'Disposiciones autorizadas',
        endpoint: '/disposicion',
        calc: d => String(d.filter(x => x.estado !== 'Pendiente').length),
        sub: 'Actas y transferencias emitidas'
      }
    ]
  }
};

export function obtenerPerfilRol(rol) {
  return PERFILES_ROL[rol] || null;
}

export function filtrarModulosPorRol(modulos, rol) {
  const perfil = obtenerPerfilRol(rol);
  if (!perfil) return modulos;
  return modulos.filter(m => perfil.rutas.includes(m.path));
}

export function puedeAccederRuta(rol, path) {
  if (!path || path === '/dashboard') return true;
  const perfil = obtenerPerfilRol(rol);
  if (!perfil) return true;
  return perfil.rutas.includes(path);
}
