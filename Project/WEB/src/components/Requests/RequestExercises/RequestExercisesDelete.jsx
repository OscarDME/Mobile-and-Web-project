import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';

export default function RequestExercisesDelete({ exercise }) {

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
                        <div className="exercise-info-row">Dificultad: {exercise.difficulty}</div>
                        <div className="exercise-info-row">Tipo de ejercicio: {exercise.type}</div>
                        <div className="exercise-info-row">Indicaciones: {exercise.indications}</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Material: {exercise.material.join(" - ")}</div>
                        <div className="exercise-info-row">Posición inicial: {exercise.preparation}</div>
                      </div>
                    </div>
        </div>
            <div className='add_exercise_rows2'>
              Razón de rechazo:
              <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange} ></textarea>
            </div>
        <button type="submit" className='add_button'>Rechazar solicitud</button>
      </form>
    </div>
  );
}
