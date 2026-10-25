# Uso de Inteligencia Artificial en el proyecto SGDA – ITS Saltillo

## 1. Contexto

El equipo ya contaba con el código base del Sistema de Gestión Digital de Archivos (SGDA), desarrollado en React con Vite (`npm install` y `npm run dev` para ejecutarlo). La IA no generó el sistema desde cero: se usó para adaptar y reorganizar un código que ya teníamos.

- **IA utilizada:** Claude (Anthropic), modelo Sonnet 5.5.
- **Fecha de uso:** 20 de octubre de 2026.

## 2. ¿Por qué se pidió así?

El proyecto original solo funcionaba desde la terminal, porque necesitaba instalar dependencias y levantar un servidor local. Eso es un problema en la práctica:

- Para presentarlo o revisarlo en cualquier computadora había que tener Node.js y npm instalados.
- Si alguien (la ingeniera, un compañero) quería ver el sistema, tenía que saber usar la terminal.
- Aún no existe backend, así que no hacía falta un servidor para que el sistema funcione.

Por eso se pidió convertirlo a un archivo HTML que se abra sin terminal.

Después se pidió separar el código por carpetas de módulo, porque el código estaba muy condensado (una sola línea muy larga por archivo) y era difícil de leer y de repartir entre integrantes del equipo.

## 3. Usos de la IA 

| Uso permitido | ¿Se usó? | En qué |
|---|---|---|
| Generar código base | Parcial | No se generó el sistema; se generó el código de adaptación (mini-router, script de compilación, archivos por módulo). |
| Explicar fragmentos de código | Sí | Se revisó cómo funcionaba el código original (rutas, módulos, componentes) para poder adaptarlo. |
| Detectar errores | Sí | Se detectó que `react-router-dom` con rutas normales no funciona al abrir un HTML directo (`file://`) y se corrigió. |
| Generar documentación | Sí | Se generó el `README.md` con la estructura de carpetas y las instrucciones. |

## 4. Prompts utilizados

**Prompt 1 – Conversión a HTML**

> Puedes convertir el siguiente código a que sea compatible sólo con html, sin entrar a la terminal para ejecutar el código.

*(Se adjuntó el proyecto completo `gestion-archivo-its-is.zip`.)*

**Prompt 2 – Separar por módulos**

> Se puede pasar cada módulo a una carpeta distinta, como un código dividido en carpetas donde están los módulos del sistema

## 5. Código generado por la IA

### 5.1 Entrega 1: archivo único `sgda-itsaltillo.html`

- Se compiló todo el proyecto React en **un solo archivo HTML** (JavaScript, estilos y logo incluidos), que se abre directamente en el navegador.
- Se cambió el sistema de rutas a rutas con `#` (por ejemplo `archivo.html#/usuarios`), porque las rutas normales no funcionan al abrir un archivo local. Para ello se creó un mini-router propio (`src/core/router.jsx`) que sustituye a `react-router-dom`.
- Se redujo el logo de 494 KB a 104 KB para aligerar el archivo.
- Los iconos se tomaron de otro paquete (`react-icons`, set Lucide), porque `lucide-react` no se pudo instalar en el entorno donde trabajó la IA. Son los mismos iconos.

### 5.2 Entrega 2: proyecto dividido por módulos (`sgda-itsaltillo-modular.zip`)

```
src/
├── main.jsx · App.jsx
├── core/                 Piezas compartidas (menú, tablas, formularios, router, iconos)
├── paginas/              login/ e inicio/
└── modulos/              UNA CARPETA POR MÓDULO
    ├── usuarios/
    ├── clasificacion/    (+ TreeView.jsx)
    ├── etiquetado/       (+ Marbete.jsx)
    ├── prestamos/
    ├── digitalizacion/   (+ FileUpload.jsx, PDFPreview.jsx)
    ├── almacenamiento/   (+ StorageMap.jsx)
    ├── workflow/         (+ Timeline.jsx)
    ├── vigencias/        (+ Legend.jsx)
    ├── auditoria/        (+ Integrity.jsx)
    ├── disposicion/
    └── configuracion/
```

- Cada módulo tiene su archivo `<modulo>.config.js` con sus campos, columnas y botones.
- Se agregó `build.js` y `package.json` para volver a generar el HTML cuando se modifique el código (`npm install` y `npm run build`).

## 6. Ajustes realizados por el equipo

> Completar con lo que realmente hizo el equipo.

- [Revisión y prueba del HTML generado en nuestros navegadores: Chrome / Edge / otro]
- [Cambios al diseño, textos o colores: ...]
- [Correcciones en campos, botones o validaciones de algún módulo: ...]
- [Módulos que cada integrante revisó o modificó: ...]
- [Errores que encontramos y cómo los resolvimos: ...]
- [Cualquier otra modificación hecha después de recibir el código de la IA]
