# SGDA – Instituto Tecnológico de Saltillo

**Para usar el sistema:** abre `sgda-itsaltillo.html` con doble clic en cualquier navegador. No requiere terminal ni internet.

## Estructura del código (`src/`)

```
src/
├── main.jsx · App.jsx            Arranque y rutas
├── core/                         Piezas compartidas (menú, tablas, formularios, router, iconos)
│   ├── ModulePage.jsx            Pantalla genérica que se arma con la config de cada módulo
│   └── helpers.js                f() = campo de formulario, c() = columna de tabla
├── paginas/
│   ├── login/                    Iniciar sesión
│   └── inicio/                   Pantalla de inicio
├── modulos/                      UNA CARPETA POR MÓDULO
│   ├── index.js                  Orden de los módulos en el menú lateral
│   ├── usuarios/                 Gestión de Usuarios
│   ├── clasificacion/            Jerarquización de Información  (+ TreeView.jsx)
│   ├── etiquetado/               Clasificación y Etiquetado     (+ Marbete.jsx)
│   ├── prestamos/                Trazabilidad y Control de Salidas
│   ├── digitalizacion/           Digitalización y Resguardo     (+ FileUpload.jsx, PDFPreview.jsx)
│   ├── almacenamiento/           Almacenamiento Sistematizado   (+ StorageMap.jsx)
│   ├── workflow/                 Control de Flujo de Información (+ Timeline.jsx)
│   ├── vigencias/                Vigencias Documentales         (+ Legend.jsx)
│   ├── auditoria/                Aseguramiento y Cumplimiento   (+ Integrity.jsx)
│   ├── disposicion/              Disposición Documental
│   └── configuracion/            Configuración
├── assets/ · styles/
```

Cada carpeta de módulo tiene su `<modulo>.config.js` (campos, columnas y botones) y, si lo necesita, sus componentes propios.
