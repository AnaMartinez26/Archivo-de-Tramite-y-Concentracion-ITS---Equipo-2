import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Field,
  Modal,
  ConfirmDialog,
  SearchBar,
  DataTable,
  useToast
} from '../componentes/ui/index.js';
import { PageTitle } from '../componentes/layout/Layout.jsx';
import { getToken, getUsuario, setUsuario } from '../api/sesion.js';
import { apiFetch } from '../api/cliente.js';
import {
  cargarUsuariosYRoles,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  restablecerPasswordUsuario,
  eliminarUsuario
} from '../modulos/usuarios/usuarios.service.js';
import {
  mapDocumentoDto,
  listarDocumentos,
  crearDocumento,
  actualizarDocumento,
  subirArchivoPdf,
  descargarArchivoPdfBlob,
  descargarPdfEnNavegador,
  eliminarDocumentos
} from '../modulos/digitalizacion/digitalizacion.service.js';
import {
  mapTramiteDto,
  entradaLog,
  construirLogInicial,
  listarTramites,
  crearTramite,
  cambiarEstadoVarios
} from '../modulos/workflow/workflow.service.js';
import { TreeView } from '../modulos/clasificacion/TreeView.jsx';
import {
  listarVigencias,
  obtenerResumenVigencias,
  registrarVigencia,
  actualizarVigencia
} from '../modulos/vigencias/vigencias.service.js';
import {
  listarClasificaciones,
  crearClasificacion,
  actualizarClasificacion,
  eliminarClasificaciones
} from '../modulos/clasificacion/clasificacion.service.js';
import { Marbete } from '../modulos/etiquetado/Marbete.jsx';
import { FileUpload } from '../modulos/digitalizacion/FileUpload.jsx';
import { PDFPreview } from '../modulos/digitalizacion/PDFPreview.jsx';
import { StorageMap } from '../modulos/almacenamiento/StorageMap.jsx';
import { Timeline } from '../modulos/workflow/Timeline.jsx';
import { Legend } from '../modulos/vigencias/Legend.jsx';
import {
  listarPrestamos,
  registrarPrestamo,
  extenderPlazoPrestamo,
  devolverPrestamos,
  imprimirVale
} from '../modulos/prestamos/prestamos.service.js';
//import { Integrity } from '../modulos/auditoria/Integrity.jsx';

// Módulos cuyo comportamiento proviene del segundo ModulePage
const MODULOS_GESTION = ['/clasificacion', '/vigencias', '/prestamos'];

export default function ModulePage({ m }) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [v, setV] = useState({});
  const [err, setErr] = useState({});
  const [q, setQ] = useState('');
  const [fl, setFl] = useState({});
  const [sel, setSel] = useState([]);
  const [open, setOpen] = useState(false);
  const [cf, setCf] = useState(null);
  const [log, setLog] = useState([]);
  const [url, setUrl] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [pwdTarget, setPwdTarget] = useState(null);
  const [nuevaPwd, setNuevaPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [n, setN] = useState(1);
  const editRef = useRef(null); // id del nivel o vigencia que se está modificando
  const [catalogos, setCatalogos] = useState({

  clasificaciones: [],
  cajas: [],
  expedientes: []
});

const reload = async () => {
  if (!m.api?.list) return [];

  const res = await apiFetch(m.api.list);
  const data = Array.isArray(res?.data) ? res.data : [];
  const mapped = data.map(m.api.toRow || (x => x));

  setRows(mapped);
  setSel(s => s.filter(id => mapped.some(r => r.id === id)));

  return mapped;
};

  // Carga inicial según el módulo
  useEffect(() => {
    setPendingFile(null);
    setEditId(null);
    setPwdTarget(null);
    editRef.current = null;
    if (!getToken()) return;
    let active = true;

    if (m.path === '/usuarios') {
      (async () => {
        try {
          const res = await cargarUsuariosYRoles();
          if (!active) return;
          setRows(res.rows);
          setRolesMap(res.rolesMap);
        } catch (ex) {
          if (active && ex?.status === 403) {
            toast('Solo el rol Administrador puede consultar o gestionar usuarios', 'err');
          }
        }
      })();
    } else if (m.path === '/digitalizacion') {
      (async () => {
        try {
          const docs = await listarDocumentos();
          if (!active) return;
          setRows(docs);
        } catch (ex) {
          if (active) toast(ex?.message || 'Error al cargar documentos', 'err');
        }
      })();
    } else if (m.path === '/clasificacion') {
      (async () => {
        try {
          const niveles = await listarClasificaciones();
          if (!active) return;
          setRows(niveles);
        } catch (ex) {
          if (active) toast(ex?.message || 'Error al cargar la estructura archivística', 'err');
        }
      })();
    } else if (m.path === '/prestamos') {
      (async () => {
        try {
          const prestamos = await listarPrestamos();
          if (!active) return;
          setRows(prestamos);
        } catch (ex) {
          if (active) toast(ex?.message || 'Error al cargar los préstamos', 'err');
        }
      })();
    } else if (m.path === '/vigencias') {
      (async () => {
        try {
          const vigencias = await listarVigencias();
          if (!active) return;
          setRows(vigencias);
        } catch (ex) {
          if (active) toast(ex?.message || 'Error al cargar las vigencias', 'err');
        }
      })();
    } else if (m.path === '/workflow') {
      (async () => {
        try {
          const tramites = await listarTramites();
          if (!active) return;
          setRows(tramites);
          setLog(construirLogInicial(tramites));
        } catch (ex) {
          if (active) toast(ex?.message || 'Error al cargar trámites', 'err');
        }
      })();
    } else if (m.api?.list) {
      (async () => {
        try {
          await reload();
          if (!active) return;

          if (m.path === '/etiquetado') {
            const [clasificaciones, cajas] = await Promise.all([
              apiFetch('/clasificaciones'),
              apiFetch('/almacenamiento/cajas')
            ]);

            if (!active) return;

            setCatalogos({
              clasificaciones: clasificaciones?.data || [],
              cajas: cajas?.data || [],
              expedientes: []
            });
          }

          if (m.path === '/disposicion') {
            const expedientes = await apiFetch('/expedientes');

            if (!active) return;

            setCatalogos(s => ({
              ...s,
              expedientes: expedientes?.data || []
            }));
          }
        } catch (ex) {
          if (active) {
            toast(ex?.message || 'Error al cargar información del módulo', 'err');
          }
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [m.path]);

  // Vista previa automática al seleccionar un documento en Digitalización
  useEffect(() => {
    if (m.path !== '/digitalizacion') return;
    if (!sel.length) {
      setUrl('');
      return;
    }
    setPendingFile(null);
    const doc = rows.find(r => r.id === sel[0]);
    if (!doc || !doc.ruta_archivo || doc.ruta_archivo === '—') {
      setUrl('');
      return;
    }
    let active = true;
    setUrl('');
    (async () => {
      try {
        const blob = await descargarArchivoPdfBlob(sel[0]);
        if (!active) return;
        setUrl(URL.createObjectURL(blob));
      } catch (ex) {
        if (active) toast(ex?.message || 'No se pudo cargar la vista previa del PDF', 'err');
      }
    })();
    return () => {
      active = false;
    };
  }, [sel, m.path]);

  // Liberar el blob URL anterior para no acumular memoria
  useEffect(
    () => () => {
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    },
    [url]
  );

  const now = () => new Date().toLocaleString('es-MX');
  const reset = () => {
    editRef.current = null;
    setV({});
    setErr({});
    setEditId(null);
    setOpen(false);
  };

  const seleccionarPrestamo = fila => {
  if (m.path !== '/prestamos') return;

  setSel([fila.id]);
  setErr({});

  setV({
    folio_pase_salida: fila.folio_pase_salida || '',
    numero_expediente: fila.numero_expediente || '',
    numero_empleado: fila.numero_empleado || '',
    tipo_movimiento: fila.tipo_movimiento || '',
    fecha_salida: fila.fecha_salida || '',
    fecha_regreso: fila.fecha_regreso || '',
    motivo: fila.motivo || '',
    estado: fila.estado || ''
  });
};

const seleccionarExpedienteEtiquetado = fila => {
  if (m.path !== '/etiquetado') return;

  const clasificacion = catalogos.clasificaciones.find(x =>
    x.id === fila.id_clasificacion ||
    x.nombre === fila.clasificacion
  );

  const caja = catalogos.cajas.find(x =>
    String(x.cajaNumero) === String(fila.caja)
  );

  setSel([fila.id]);
  setErr({});
  setEditId(null);

  setV({
    numero_expediente: fila.numero_expediente || '',
    titulo: fila.titulo || '',
    codigo_etiqueta: fila.codigo_etiqueta || '',
    clasificacion: clasificacion?.id ?? '',
    caja: caja?.cajaNumero ?? '',
    fecha_apertura: fila.fecha_apertura || '',
    estado: fila.estado || 'Activo'
  });

  toast('Expediente seleccionado. El marbete se actualizó automáticamente.', 'info');
};

const seleccionarCajaAlmacenamiento = fila => {
  if (m.path !== '/almacenamiento') return;

  setSel([fila.id]);
  setErr({});
  setEditId(null);

  setV({
    numero_caja: fila.numero_caja ?? '',
    codigo_etiqueta: fila.codigo_etiqueta ?? '',
    ubicacion: fila.ubicacion ?? '',
    capacidad: fila.capacidad ?? '',
    estado: fila.estado || 'Activo'
  });
};

  const save = async () => {
    const errores = {};
    m.fields.forEach(f => {
      const clave = f.k || f.name;
      const valor = v[clave];
      const vacio = Array.isArray(valor) ? !valor.length : !String(valor || '').trim();
      const omitirReq = m.path === '/usuarios' && editId && clave === 'contrasena';
      if ((f.req || f.required) && !omitirReq && vacio) {
        errores[clave] = 'Este campo es obligatorio.';
      }
    });
    setErr(errores);
    if (Object.keys(errores).length) return toast('Completa los campos obligatorios', 'err');
    if (!m.cols) return toast('Configuración guardada (solo en esta sesión)');

    if (m.path === '/usuarios' && getToken()) {
      try {
        if (editId) {
          const { dto, fila, message } = await actualizarUsuario(editId, v, rolesMap);
          if (fila) setRows(r => r.map(x => (x.id === editId ? fila : x)));
          if (dto && getUsuario()?.id === editId) setUsuario(dto);
          reset();
          return toast(message);
        }
        const { fila, message } = await crearUsuario(v, rolesMap);
        if (fila) setRows(r => [...r, fila]);
        reset();
        return toast(message);
      } catch (ex) {
        return toast(
          ex?.message || (editId ? 'Error al actualizar usuario' : 'Error al registrar usuario'),
          'err'
        );
      }
    }

    if (m.path === '/digitalizacion' && getToken()) {
      if (
        editId &&
        rows.find(x => x.id === editId)?.folio === String(v.folio || '').trim().toUpperCase()
      ) {
        return toast(
          'Estás editando un documento existente: pulsa "Guardar Cambios" o "Limpiar Lote"',
          'info'
        );
      }
      try {
        const res = await crearDocumento(v);
        if (res?.data) {
          let docFinal = res.data;
          let msg = res?.message || 'Documento registrado correctamente';
          let errSubida = null;

          if (pendingFile) {
            try {
              const up = await subirArchivoPdf(res.data.id, pendingFile);
              if (up?.data) {
                docFinal = up.data;
                msg = 'Documento y archivo PDF registrados correctamente';
              } else {
                errSubida = 'El servidor no confirmó la carga del PDF';
              }
            } catch (exUp) {
              errSubida = exUp?.message || 'Error al subir el PDF';
            }
          }

          setRows(r => [mapDocumentoDto(docFinal), ...r]);
          setSel([docFinal.id]);
          setPendingFile(null);
          reset();
          if (errSubida) {
            return toast(`Documento registrado, pero falló el PDF: ${errSubida}`, 'err');
          }
          return toast(msg);
        }
        reset();
        return toast(res?.message || 'Documento registrado correctamente');
      } catch (ex) {
        return toast(ex?.message || 'Error al registrar documento', 'err');
      }
    }

    if (m.path === '/workflow' && getToken()) {
      try {
        const res = await crearTramite(v);
        if (res?.data) {
          const fila = mapTramiteDto(res.data);
          setRows(r => [fila, ...r]);
          setLog(l => [entradaLog(fila, `Trámite registrado (${fila.folio_pase_salida})`), ...l]);
        }
        reset();
        return toast(res?.message || 'Trámite registrado correctamente');
      } catch (ex) {
        return toast(ex?.message || 'Error al registrar trámite', 'err');
      }
    }

    if (m.path === '/prestamos' && getToken()) {
      try {
        const res = await registrarPrestamo(v);
        setRows(await listarPrestamos());
        reset();
        return toast(res?.message || 'Salida registrada');
      } catch (ex) {
        return toast(ex?.message || 'Error al registrar la salida', 'err');
      }
    }

    if (m.path === '/vigencias' && getToken()) {
      const editando = editRef.current;
      try {
        const res = editando
          ? await actualizarVigencia(editando, v)
          : await registrarVigencia(v);
        setRows(await listarVigencias());
        setSel([]);
        reset();
        return toast(res?.message || 'Vigencia guardada');
      } catch (ex) {
        return toast(ex?.message || 'Error al guardar la vigencia', 'err');
      }
    }

    if (m.path === '/clasificacion' && getToken()) {
      const editando = editRef.current;
      try {
        const res = editando
          ? await actualizarClasificacion(editando, v, rows)
          : await crearClasificacion(v, rows);
        // Se recarga todo: si se renombró un nivel, sus hijos deben mostrar el nombre nuevo
        setRows(await listarClasificaciones());
        setSel([]);
        reset();
        return toast(res?.message || 'Estructura archivística actualizada');
      } catch (ex) {
        return toast(ex?.message || 'Error al guardar el nivel archivístico', 'err');
      }
    }

    if (m.api?.create && getToken()) {
      try {
        const body = m.api.toBody ? m.api.toBody(v) : v;

        const res = await apiFetch(m.api.create, {
          method: 'POST',
          body: JSON.stringify(body)
        });

        if (res?.data) {
          const fila = m.api.toRow
            ? m.api.toRow(res.data)
            : res.data;

          setRows(r => [fila, ...r]);

          // Permite generar la etiqueta del expediente recién creado.
          if (m.path === '/etiquetado') {
            setSel([res.data.id]);
          }
        }

        reset();
        return toast(res?.message || 'Registro guardado correctamente');
      } catch (ex) {
        return toast(ex?.message || 'Error al guardar el registro', 'err');
      }
    }

    setRows(r => [
      ...r,
      {
        id: n,
        ingreso: new Date().toLocaleDateString('es-MX'),
        ...v,
        ...(m.derive ? m.derive(v) : {})
      }
    ]);
    setN(n + 1);
    reset();
    toast('Registro agregado');
  };

  const needSel = () => {
    if (!sel.length) {
      toast('Selecciona al menos un registro de la tabla', 'err');
      return false;
    }
    return true;
  };

  const run = b => {
    const go = () => {
      if (b.a === 'save' && (m.path === '/clasificacion' || m.path === '/vigencias')) {
        editRef.current = null; // "Agregar" siempre crea
      }
      if (b.a === 'save' || b.a === 'cfg') return save();
      if (b.a === 'open') {
        if (MODULOS_GESTION.includes(m.path)) return setOpen(true);
        setEditId(null);
        setV({});
        setErr({});
        return setOpen(true);
      }
      if (b.a === 'saveUserBtn' && m.path === '/usuarios') {
        if (editId) return save();
        return toast('Pulsa "Editar" en la fila del usuario que deseas modificar', 'info');
      }
      if (b.a === 'cancel') {
        reset();
        if (MODULOS_GESTION.includes(m.path)) return toast('Cambios cancelados', 'info');
        setQ('');
        setFl({});
        return toast('Cambios y filtros restablecidos', 'info');
      }
      if (b.a === 'flag') {
        const clave = b.l.includes('QR') ? 'QR' : b.l.includes('Barras') ? 'Bar' : 'Et';
        setFl(f => ({ ...f, [clave]: 1 }));
        return toast(b.l + ': listo (vista previa)');
      }
      if (b.a === 'pick') return document.getElementById('fu')?.click();

      if (b.l && b.l.includes('Sincronizar') && m.path === '/digitalizacion' && getToken()) {
        (async () => {
          try {
            const docs = await listarDocumentos();
            setRows(docs);
            toast('Resguardo digital sincronizado con el servidor');
          } catch (ex) {
            toast(ex?.message || 'Error al sincronizar', 'err');
          }
        })();
        return;
      }

      if (b.a === 'update' && m.path === '/digitalizacion' && getToken()) {
        const idDoc = editId || (sel.length === 1 ? sel[0] : null);
        if (!idDoc) {
          return toast(
            sel.length > 1
              ? 'Selecciona un solo documento para editar'
              : 'Pulsa "Editar" en la fila del documento que deseas modificar',
            'err'
          );
        }
        if (!String(v.titulo || '').trim()) {
          setErr({ titulo: 'Este campo es obligatorio.' });
          return toast('Ingresa el título del documento antes de guardar cambios', 'err');
        }
        (async () => {
          try {
            const res = await actualizarDocumento(idDoc, v);
            let docFinal = res?.data;
            let msg = res?.message || 'Documento actualizado correctamente';

            if (pendingFile && docFinal) {
              const up = await subirArchivoPdf(idDoc, pendingFile);
              if (up?.data) {
                docFinal = up.data;
                msg = 'Documento y archivo PDF actualizados correctamente';
              }
              setPendingFile(null);
            }

            if (docFinal) {
              setRows(r => r.map(x => (x.id === idDoc ? mapDocumentoDto(docFinal) : x)));
            }
            reset();
            toast(msg);
          } catch (ex) {
            toast(ex?.message || 'Error al actualizar el documento', 'err');
          }
        })();
        return;
      }

      if (b.a === 'devolver' && m.path === '/prestamos' && getToken()) {
        if (!needSel()) return;
        const ids = [...sel];
        (async () => {
          const { hechos, errorMensaje } = await devolverPrestamos(ids, rows);
          try {
            setRows(await listarPrestamos());
          } catch {
            // se conserva la tabla actual
          }
          setSel(s => s.filter(id => !hechos.includes(id)));
          if (hechos.length === ids.length) return toast('Devolución registrada correctamente');
          toast(`Se registraron ${hechos.length} de ${ids.length}. ${errorMensaje}`.trim(), 'err');
        })();
        return;
      }

      if (b.a === 'vale' && m.path === '/prestamos') {
        if (!needSel()) return;
        if (sel.length > 1) return toast('Selecciona un solo préstamo para imprimir su vale', 'err');
        const fila = rows.find(r => r.id === sel[0]);
        if (!fila) return;
        if (!imprimirVale(fila)) {
          return toast('El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes e inténtalo de nuevo.', 'err');
        }
        return toast('Vale de préstamo listo para imprimir', 'info');
      }

      if (b.a === 'edit' && m.path === '/vigencias') {
        if (!needSel()) return;
        if (sel.length > 1) return toast('Selecciona una sola vigencia para modificarla', 'err');
        const fila = rows.find(r => r.id === sel[0]);
        if (!fila) return;
        if (editRef.current === fila.id) return save(); // segunda pulsación: guarda los cambios
        editRef.current = fila.id;
        setErr({});
        setV({
          numero_expediente: fila.numero_expediente,
          fecha_inicio: fila.fecha_inicio,
          fecha_vencimiento: fila.fecha_vencimiento
        });
        return toast(
          'Datos cargados en el formulario. Modifícalos y vuelve a presionar "Modificar Vigencia" para guardar.',
          'info'
        );
      }

      if ((b.a === 'alertas' || b.a === 'vencidos') && m.path === '/vigencias') {
        if (!getToken()) return toast('Inicia sesión para consultar las alertas', 'err');
        (async () => {
          try {
            const [lista, resumen] = await Promise.all([listarVigencias(), obtenerResumenVigencias()]);
            setRows(lista);
            if (b.a === 'alertas') {
              return toast(
                `Alertas: ${resumen.vencidos} vencido(s), ${resumen.proximos} próximo(s) a vencer, ${resumen.vigentes} vigente(s)`,
                resumen.vencidos ? 'err' : 'info'
              );
            }
            if (!resumen.vencidos) return toast('No hay expedientes vencidos', 'info');
            const resto = resumen.vencidos > resumen.numerosVencidos.length ? ', …' : '';
            toast(`Expedientes vencidos (${resumen.vencidos}): ${resumen.numerosVencidos.join(', ')}${resto}`, 'err');
          } catch (ex) {
            toast(ex?.message || 'Error al consultar las alertas', 'err');
          }
        })();
        return;
      }

      if (b.a === 'edit' && m.path === '/clasificacion') {
        if (!needSel()) return;
        if (sel.length > 1) return toast('Selecciona un solo nivel para modificarlo', 'err');
        const fila = rows.find(r => r.id === sel[0]);
        if (!fila) return;
        if (editRef.current === fila.id) return save(); // segunda pulsación: guarda los cambios
        editRef.current = fila.id;
        setErr({});
        setV({
          nombre: fila.nombre,
          padre: fila.padre,
          descripcion: fila.descripcion,
          plazo: fila.plazo === '' ? '' : String(fila.plazo),
          destino: fila.destino,
          fundamento: fila.fundamento
        });
        return toast(
          'Datos cargados en el formulario. Modifícalos y vuelve a presionar "Modificar Estructura" para guardar.',
          'info'
        );
      }

      if (b.a === 'sync' && m.path === '/clasificacion') {
        if (!getToken()) return toast('Inicia sesión para sincronizar con el servidor', 'err');
        (async () => {
          try {
            setRows(await listarClasificaciones());
            toast('Árbol archivístico sincronizado con el servidor');
          } catch (ex) {
            toast(ex?.message || 'Error al sincronizar el árbol archivístico', 'err');
          }
        })();
        return;
      }

      if (b.a === 'del' || b.a === 'clear') {
        // En Digitalización "Limpiar Lote" solo limpia el formulario: nunca borra en el servidor
        if (b.a === 'clear' && m.path === '/digitalizacion') {
          setV({});
          setErr({});
          setEditId(null);
          setSel([]);
          setUrl('');
          setPendingFile(null);
          return toast('Lote limpiado', 'info');
        }
        const ids = b.a === 'clear' ? rows.map(r => r.id) : sel;
        if (!ids.length) {
          return toast(
            MODULOS_GESTION.includes(m.path)
              ? 'No hay registros para quitar'
              : 'Selecciona al menos un registro para eliminar',
            'err'
          );
        }
        return setCf({
          msg: '¿Quitar el/los registro(s) seleccionado(s)?',
          ok: async () => {
            if (m.path === '/clasificacion' && getToken()) {
              const { eliminados, errorMensaje } = await eliminarClasificaciones(ids, rows);
              try {
                setRows(await listarClasificaciones());
              } catch {
                setRows(r => r.filter(x => !eliminados.includes(x.id)));
              }
              setSel(s => s.filter(id => !eliminados.includes(id)));
              if (eliminados.length === ids.length) return toast('Nivel(es) eliminado(s) correctamente');
              return toast(
                `Se eliminaron ${eliminados.length} de ${ids.length}. ${errorMensaje}`.trim(),
                'err'
              );
            }

            if (m.path === '/digitalizacion' && getToken()) {
              const { eliminados, errorMensaje } = await eliminarDocumentos(ids);
              setRows(r => r.filter(x => !eliminados.includes(x.id)));
              setSel(s => s.filter(id => !eliminados.includes(id)));
              if (eliminados.includes(sel[0])) setUrl('');
              if (eliminados.includes(editId)) reset();
              if (eliminados.length === ids.length) {
                return toast('Documento(s) eliminado(s) del servidor');
              }
              return toast(
                `Se eliminaron ${eliminados.length} de ${ids.length}. ${errorMensaje}`.trim(),
                'err'
              );
            }

            setRows(r => r.filter(x => !ids.includes(x.id)));
            setSel([]);
            if (b.a === 'clear') setUrl('');
          }
        });
      }

      if (b.a === 'reload' && m.path === '/workflow' && getToken()) {
        (async () => {
          try {
            const tramites = await listarTramites();
            setRows(tramites);
            setSel(s => s.filter(id => tramites.some(t => t.id === id)));
            toast('Lista de trámites actualizada');
          } catch (ex) {
            toast(ex?.message || 'Error al actualizar trámites', 'err');
          }
        })();
        return;
      }

      if (b.a === 'status') {
        if (!needSel()) return;
        if (b.s === 'Aprobado' && !String(v.firma || '').trim()) {
          return toast('Ingresa la firma electrónica / token para aprobar', 'err');
        }
        if (b.s === 'Rechazado' && !String(v.motivo || '').trim()) {
          return toast('Escribe las observaciones/correcciones para rechazar', 'err');
        }

        if (m.path === '/workflow' && getToken()) {
          (async () => {
            const ids = [...sel];
            const { actualizados, errores } = await cambiarEstadoVarios(ids, {
              estado: b.s,
              observaciones: v.motivo,
              firma: v.firma
            });
            if (actualizados.length) {
              const porId = Object.fromEntries(actualizados.map(t => [t.id, t]));
              setRows(r => r.map(x => porId[x.id] || x));
              setLog(l => [
                ...actualizados.map(t => entradaLog(t, `${b.l} (${t.folio_pase_salida})`)),
                ...l
              ]);
              setSel([]);
              setV(s => ({ ...s, firma: '', motivo: '' }));
            }
            if (errores.length) {
              const ok = actualizados.length;
              return toast(
                ok ? `Se actualizaron ${ok} de ${ids.length}. ${errores[0]}` : errores[0],
                'err'
              );
            }
            toast(`${b.l}: ${actualizados.length} trámite(s) actualizado(s)`);
          })();
          return;
        }

        setRows(r => r.map(x => (sel.includes(x.id) ? { ...x, estado: b.s } : x)));
        setLog(l => [{ t: b.l, d: now() }, ...l]);
        return toast(b.l + ': registrado');
      }

      if (b.a === 'custom') {
        if (b.need && !needSel()) return;

        if (typeof b.run !== 'function') {
          return toast('Esta acción no tiene una función configurada', 'err');
        }

        return b.run({
          rows,
          sel,
          v,
          setV,
          setSel,
          setFl,
          toast,
          apiFetch,
          reload
        });
      }

      if (b.a === 'need' && !needSel()) return;

      toast(
        MODULOS_GESTION.includes(m.path)
          ? b.l + ': se ejecutará al conectar el backend'
          : b.l + ': acción todavía no implementada',
        'info'
      );
    };

    b.c ? setCf({ msg: `¿Confirmas la acción "${b.l}"?`, ok: go }) : go();
  };

  const act = (a, r) => {
    const accion = typeof a === 'string' ? a : a?.label || '';

    if (m.path === '/prestamos' && getToken() && (accion === 'Registrar Devolución' || accion === 'Extender Plazo')) {
      if (accion === 'Registrar Devolución') {
        return setCf({
          msg: `¿Confirmas la devolución del folio ${r.folio_pase_salida}?`,
          ok: async () => {
            const { hechos, errorMensaje } = await devolverPrestamos([r.id], rows);
            try {
              setRows(await listarPrestamos());
            } catch {
              // se conserva la tabla actual
            }
            if (hechos.length) return toast('Devolución registrada correctamente');
            toast(errorMensaje, 'err');
          }
        });
      }

      if (!String(v.fecha_regreso || '').trim()) {
        return toast('Captura la nueva Fecha de Regreso en el formulario y vuelve a presionar "Extender Plazo".', 'err');
      }
      return (async () => {
        try {
          const res = await extenderPlazoPrestamo(r.id, v.fecha_regreso);
          setRows(await listarPrestamos());
          setV(s => ({ ...s, fecha_regreso: '' }));
          toast(res?.message || 'Plazo extendido');
        } catch (ex) {
          toast(ex?.message || 'Error al extender el plazo', 'err');
        }
      })();
    }

    if (m.path === '/digitalizacion') {
      if (accion === 'Editar') {
        setEditId(r.id);
        setSel([r.id]);
        setErr({});
        setV({
          folio: r.folio || '',
          titulo: r.titulo || '',
          tipo_documento: r.tipo_documento || '',
          numero_expediente: r.numero_expediente || '',
          fecha_creacion: r.fecha_creacion || ''
        });
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
        return toast(`Editando "${r.folio}". Modifica los campos y pulsa "Guardar Cambios".`, 'info');
      }

      if (accion === 'Descargar PDF') {
        (async () => {
          try {
            await descargarPdfEnNavegador(r.id, r.folio);
            toast(`Descargando ${r.folio}.pdf`);
          } catch (ex) {
            toast(ex?.message || 'No se pudo descargar el PDF', 'err');
          }
        })();
        return;
      }

      if (accion === 'Eliminar') {
        return setCf({
          msg: `¿Confirmas eliminar el documento "${r.folio} — ${r.titulo}"?`,
          ok: async () => {
            if (!getToken()) return;
            const { eliminados, errorMensaje } = await eliminarDocumentos([r.id]);
            if (eliminados.includes(r.id)) {
              setRows(x => x.filter(y => y.id !== r.id));
              setSel(s => s.filter(id => id !== r.id));
              if (sel[0] === r.id) setUrl('');
              if (editId === r.id) reset();
              toast('Documento eliminado del servidor');
            } else {
              toast(errorMensaje || 'No se pudo eliminar el documento', 'err');
            }
          }
        });
      }
    }

    if (m.path === '/usuarios') {
      if (accion === 'Editar') {
        setEditId(r.id);
        setErr({});
        setV({
          nombre: r.nombre_pila || r.nombre || '',
          apellido_p: r.apellido_p || '',
          apellido_m: r.apellido_m || '',
          correo: r.correo || '',
          contrasena: '',
          rol: r.rol || '',
          estado: r.estado || 'Activo',
          numero_empleado: String(r.numero_empleado ?? ''),
          departamento:
            r.departamento_raw !== undefined ? r.departamento_raw : r.departamento || '',
          puesto: r.puesto || ''
        });
        return setOpen(true);
      }

      if (accion === 'Restablecer contraseña') {
        setPwdTarget(r);
        setNuevaPwd('');
        setConfPwd('');
        return;
      }

      if (accion === 'Eliminar') {
        return setCf({
          msg: `¿Confirmas eliminar al usuario "${r.nombre}"? Si tiene documentos o trámites asociados, usa "Desactivar".`,
          ok: async () => {
            if (!getToken()) return;
            try {
              const { message } = await eliminarUsuario(r.id);
              setRows(x => x.filter(y => y.id !== r.id));
              toast(message);
            } catch (ex) {
              toast(ex?.message || 'No se pudo eliminar el usuario', 'err');
            }
          }
        });
      }
    }

    const esCambioEstadoUsuario =
      m.path === '/usuarios' && (accion === 'Desactivar' || accion === 'Activar');

    if (!esCambioEstadoUsuario) {
      return toast(`${accion}: se ejecutará al conectar el backend`, 'info');
    }

    setCf({
      msg: `¿Confirmas ${accion.toLowerCase()} al usuario "${r.nombre}"?`,
      ok: async () => {
        if (!getToken()) return;
        const nuevoEstado = accion === 'Desactivar' ? 'Inactivo' : 'Activo';
        try {
          const { fila, message } = await cambiarEstadoUsuario(r.id, nuevoEstado);
          setRows(x =>
            x.map(y => (y.id === r.id ? fila || { ...y, estado: nuevoEstado } : y))
          );
          toast(message);
        } catch (ex) {
          toast(ex?.message || 'Error al cambiar el estado del usuario', 'err');
        }
      }
    });
  };

  const fil = rows.filter(
    r =>
      (!q ||
        Object.values(r)
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (m.filters || []).every(
        f =>
          !fl[f.k] ||
          (f.type === 'select'
            ? r[f.k] === fl[f.k]
            : f.on
              ? String(r[f.on] || '').startsWith(fl[f.k])
              : true)
      )
  );

  const take = async f => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      return toast('Solo se admiten archivos PDF o PDF/A', 'err');
    }

    // Si no hay fila seleccionada, deja el PDF en espera para subirlo al registrar el documento
    if (!sel.length) {
      setPendingFile(f);
      setUrl(URL.createObjectURL(f));
      return toast(
        `PDF "${f.name}" listo. Completa el formulario y haz clic en "Registrar Documento", o marca una fila de la tabla.`
      );
    }

    const idSel = sel[0];
    if (m.path === '/digitalizacion' && getToken()) {
      try {
        const res = await subirArchivoPdf(idSel, f);
        if (res?.data) {
          setRows(x => x.map(r => (r.id === idSel ? mapDocumentoDto(res.data) : r)));
          setPendingFile(null);
          setUrl(URL.createObjectURL(f));
          return toast(res?.message || 'Réplica digital asociada correctamente');
        }
        return toast('El servidor no confirmó la carga del archivo', 'err');
      } catch (ex) {
        return toast(ex?.message || 'Error al subir el archivo PDF', 'err');
      }
    }

    setRows(x =>
      x.map(r =>
        r.id === sel[0]
          ? { ...r, ruta_archivo: f.name, formato: 'PDF', fecha_digitalizacion: now() }
          : r
      )
    );
    setUrl(URL.createObjectURL(f));
    toast('Réplica digital asociada');
  };

  const form = (
    <div className="grid2">
      {m.fields.map(f => {
        let options = f.options;

        if (f.dyn) {
          // Los módulos de gestión usan el nombre como valor; los demás usan el id
          options =
            MODULOS_GESTION.includes(m.path)
              ? rows.map(r => r.nombre)
              : rows.map(r => ({ value: r.id, label: r.nombre }));
        }

        if (f.catalog === 'clasificaciones') {
          options = catalogos.clasificaciones.map(x => ({
            value: x.id,
            label: x.nombre
          }));
        }

        if (f.catalog === 'cajas') {
          options = catalogos.cajas.map(x => ({
            value: x.cajaNumero,
            label: `Caja ${x.cajaNumero} — ${x.ubicacionPasilloEstanteBateria}`
          }));
        }

        if (f.catalog === 'expedientes') {
          options = catalogos.expedientes.map(x => ({
            value: x.id,
            label: `${x.numeroExpediente} — ${x.titulo}`
          }));
        }

        const esPwdEdicion = m.path === '/usuarios' && editId && f.k === 'contrasena';
        const campoConfig = esPwdEdicion
          ? { ...f, options, req: 0, ph: 'Opcional: dejar vacío para mantener actual' }
          : { ...f, options };

        return (
          <Field
            key={f.k}
            f={campoConfig}
            value={v[f.k]}
            error={err[f.k]}
            onChange={x => {
              if (m.path === '/digitalizacion' && editId && f.k === 'folio') {
                return toast(
                  'El folio no es modificable al editar. Usa "Limpiar Lote" para crear otro.',
                  'info'
                );
              }
              setV(s => ({ ...s, [f.k]: x }));
            }}
          />
        );
      })}
    </div>
  );
  
  const inline = m.modal ? null : (
    <div className="card pad">
      <h3>Formulario</h3>
      {form}
    </div>
  );

  return (
    <>
      <PageTitle cu={m.cu} title={m.title} sub={m.sub} />
      {m.extra === 'badges' && <Legend />}
      {m.extra === 'label' ? (
        <div className="grid2 top">
          {inline}
          <Marbete v={v} fl={fl} />
        </div>
      ) : m.extra === 'upload' ? (
        <div className="grid2 top">
          {inline}
          <FileUpload onFile={take} fileName={pendingFile?.name} />
        </div>
      ) : (
        inline
      )}
      {m.extra === 'upload' && <PDFPreview url={url} />}
      {m.extra === 'tree' && <TreeView rows={rows} />}
      {m.extra === 'map' && <StorageMap rows={rows} />}
      <div className="card pad">
        <div className="row wrap">
          {m.btns.map(b => (
            <Button key={b.l} p={b.p} d={b.d} i={b.i} onClick={() => run(b)}>
              {b.l}
            </Button>
          ))}
        </div>
      </div>
      {(m.search || m.filters) && m.cols && (
        <div className="card pad filt">
          <SearchBar value={q} onChange={setQ} ph={m.search} />
          {(m.filters || []).map(f => (
            <Field
              key={f.k}
              f={f}
              value={fl[f.k]}
              onChange={x => setFl(s => ({ ...s, [f.k]: x }))}
            />
          ))}
        </div>
      )}
      {m.cols && (
        <DataTable
          caption={m.sub || m.title}
          cols={m.cols}
          rows={fil}
          acts={m.acts}
          select={m.select}
          sel={sel}
          setSel={setSel}
          onAct={act}
          onRowClick={
  m.path === '/prestamos'
    ? seleccionarPrestamo
    : m.path === '/etiquetado'
      ? seleccionarExpedienteEtiquetado
      : m.path === '/almacenamiento'
        ? seleccionarCajaAlmacenamiento
        : undefined
}
selectedRowId={
  ['/prestamos', '/etiquetado', '/almacenamiento'].includes(m.path) &&
  sel.length === 1
    ? sel[0]
    : null
}
        />
      )}
      {m.extra === 'timeline' && <Timeline log={log} />}
      {open && (
        <Modal
          title={m.path === '/usuarios' && editId ? 'Editar Usuario' : m.modal}
          onClose={reset}
        >
          {form}
          <div className="row end">
            <Button onClick={reset}>Cancelar</Button>
            <Button p i="Save" onClick={save}>
              {m.path === '/usuarios' && editId ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </div>
        </Modal>
      )}
      {pwdTarget && (
        <Modal
          title={`Restablecer contraseña — ${pwdTarget.nombre}`}
          onClose={() => setPwdTarget(null)}
        >
          <div className="grid2">
            <Field
              f={{
                k: 'nueva_pwd',
                label: 'Nueva Contraseña',
                type: 'password',
                req: 1,
                ph: 'Mínimo 8 caracteres'
              }}
              value={nuevaPwd}
              onChange={setNuevaPwd}
            />
            <Field
              f={{
                k: 'conf_pwd',
                label: 'Confirmar Contraseña',
                type: 'password',
                req: 1,
                ph: 'Repite la contraseña'
              }}
              value={confPwd}
              onChange={setConfPwd}
            />
          </div>
          <div className="row end">
            <Button onClick={() => setPwdTarget(null)}>Cancelar</Button>
            <Button
              p
              i="Save"
              onClick={async () => {
                if (nuevaPwd.length < 8) {
                  return toast('La nueva contraseña debe tener al menos 8 caracteres', 'err');
                }
                if (nuevaPwd !== confPwd) {
                  return toast('Las contraseñas no coinciden', 'err');
                }
                try {
                  const { message } = await restablecerPasswordUsuario(pwdTarget.id, nuevaPwd);
                  setPwdTarget(null);
                  setNuevaPwd('');
                  setConfPwd('');
                  toast(message);
                } catch (ex) {
                  toast(ex?.message || 'No se pudo restablecer la contraseña', 'err');
                }
              }}
            >
              Guardar Contraseña
            </Button>
          </div>
        </Modal>
      )}
      {cf && <ConfirmDialog msg={cf.msg} onOk={cf.ok} onClose={() => setCf(null)} />}
    </>
  );
}
