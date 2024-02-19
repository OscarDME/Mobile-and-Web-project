import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';

export default function RequestTrainersNutricionistDelete({ user }) {

    const [reason, setReason] = useState('');

    const handleReasonChange = (event) => setReason(event.target.value);


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!reason) { 
      alert('Tiene que escribir una razon para rechazar la solicitud.');
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
                        <div className="exercise-info-row">{}</div>{/*Foto de perfil*/}
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Certificado: {}</div>
                        <div className="exercise-info-row">Experiencia: {}</div>
                      </div>
                    </div>
                    </div>
            <div className='add_exercise_rows2'>
              Razón de rechazo:
              <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange} ></textarea>
            </div>
        <button type="submit" className='delete_button'>Rechazar solicitud</button>
      </form>
    </div>
  );
}
