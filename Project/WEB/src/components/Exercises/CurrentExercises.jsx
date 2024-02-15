import React, { useState } from 'react';
import { ExerciseCard } from "../DATA_EXERCISES";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import NewExercises from './NewExercises';

export default function CurrentExercises() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false);
    
  
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

    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de ejercicios
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
    if (showAddPage) {
        return <NewExercises onBackToList={handleBackToList} />;
    }

    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
              <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
          </div>
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