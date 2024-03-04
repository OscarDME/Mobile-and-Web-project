import React from 'react';
import '../../../styles/Management.css';
import { Image } from 'primereact/image';

export default function RequestTrainersNutricionistAdd({ user }) {

  // Función para manejar la descarga del PDF
  const handleDownloadPdf = () => {
    if(user.certificateBlob) {
      // Crear un URL para el Blob
      const url = URL.createObjectURL(user.certificateBlob);
      // Crear un elemento <a> temporal para simular el clic de descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificado-${user.name}.pdf`);
      // Añadir el elemento al DOM, clickearlo y luego removerlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Liberar el objeto URL
      URL.revokeObjectURL(url);
    } else {
      alert('No hay un certificado disponible para descargar.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //TODO: Validate trainers/nutricionist info before adding it to the database
    if (!user.name  || user.role.length === 0 || !user.email) { 
      alert('El ejercicio no cuenta con los campos necesarios.');
      return;
    }
    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    //Mandar a la lista de ejercicios después de guardar uno, TODO: refrescar la lista de ejercicios automaticamente
  };

  return (
    <div className='container-edit'>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
          <div className="exercise-info">
            <div className="exercise-info-column">
              <div className="exercise-info-row"><Image src="" alt="Image" width="250" preview /></div>{/*Foto de perfil*/}
            </div>
            <div className="exercise-info-column">
              <div className="exercise-info-row">Email: {user.email}</div>
              <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
              <div className="exercise-info-row">
                Certificado: <button type="button" className='button-add' onClick={handleDownloadPdf}>Descargar PDF</button>
              </div>
              <div className="exercise-info-row">Experiencia: {}</div>
            </div>
          </div>
        </div>
        <button type="submit" className='add_button'>Aceptar nuevo {user.role.join(" - ")}</button>
      </form>
    </div>
  );
}
