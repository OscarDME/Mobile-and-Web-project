import React, { useState } from 'react';
import { ExerciseCard } from "../DATA_EXERCISES";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';

export default function CurrentExercises() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
  
    const filteredExercises = ExerciseCard.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (exercise) => {
      if (expandedRow === exercise.id) {
        setExpandedRow(null);
        setSelectedExercise(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedRow(exercise.id);
        setSelectedExercise(exercise); // Selecciona la fila al hacer clic
      }
    };

    return (
      <div className="container2">
          <ul className='cardcontainer'>
            {filteredExercises.map((exercise) => (
              <li key={exercise.id} className={`row ${((selectedExercise && selectedExercise.id === exercise.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(exercise)} className={`row_header ${((selectedExercise && selectedExercise.id === exercise.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{exercise.name}</div>
                    <div className='row_description'>{exercise.muscles.join(" - ")}</div>
                  </div>
                </div>
                {expandedRow === exercise.id && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Dificultad: {exercise.difficulty}</div>
                        <div className="exercise-info-row">Indicaciones: {exercise.indications}</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Material: {exercise.material.join(" - ")}</div>
                        <div className="exercise-info-row">Posición inicial: {exercise.preparation}</div>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}