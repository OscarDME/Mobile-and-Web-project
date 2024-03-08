import React, { useCallback, useState } from 'react';
import '../styles/chat.css';

export default function Chat() {
  const [droppedFiles, setDroppedFiles] = useState([]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault(); // Previene el comportamiento por defecto para permitir soltar.
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files)
                       .filter(file => file.type === "image/jpeg" || file.type === "application/pdf");

    
    setDroppedFiles(files);
  }, []);

  return (
    <>
      <div className='chat-container'>
        <div 
          className='messages-container'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedFiles.map((file, index) => (
            <div key={index}>
              {file.name} - {file.size} bytes
            </div>
          ))}
        </div>
        <div className='input-chat-bar'>
          <input className='input-chat' placeholder='Escriba un mensaje y presione enter para enviarlo...'></input>
        </div>
      </div>
    </>
  );
}
