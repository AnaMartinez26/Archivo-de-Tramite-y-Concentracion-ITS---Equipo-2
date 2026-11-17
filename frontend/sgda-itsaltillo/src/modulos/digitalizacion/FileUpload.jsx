import { useState, useRef } from 'react';
import { Icon, Button } from '../../componentes/ui/index.js';

export function FileUpload({ onFile, fileName }) {
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef();

  return (
    <div
      className={'drop' + (arrastrando ? ' on' : '')}
      onDragOver={e => {
        e.preventDefault();
        setArrastrando(true);
      }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={e => {
        e.preventDefault();
        setArrastrando(false);
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <Icon name="UploadCloud" size={36} />
      <p>
        Arrastra un archivo PDF
        <br />o
      </p>
      <input
        id="fu"
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={e => {
          const archivo = e.target.files[0];
          e.target.value = '';
          onFile(archivo);
        }}
      />
      <Button icon="FolderOpen" onClick={() => inputRef.current.click()}>
        Seleccionar archivo
      </Button>
      {fileName && (
        <p className="note" style={{ marginTop: '.6rem' }}>
          Archivo listo: <strong>{fileName}</strong>
        </p>
      )}
    </div>
  );
}
