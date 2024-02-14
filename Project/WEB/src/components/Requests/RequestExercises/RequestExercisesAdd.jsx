import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';

export default function RequestExercisesAdd({ exercise }) {


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!exercise.name  || exercise.muscles.length === 0 || !exercise.type || !exercise.preparation || !exercise.indications || !exercise.difficulty) { 
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
        <button type="submit" className='add_button'>Añadir a la base de datos</button>
      </form>
    </div>
  );
}
