import React, { useState } from 'react';
import { ExerciseCard } from "../../DATA_EXERCISES";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import RequestExercisesEdit from './RequestExercisesEdit';


export default function RequestExercises() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
  
    const filteredExercises = ExerciseCard.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (exercise) => {
      if (expandedRow === exercise.id) {
        setExpandedRow(null);
        setEditingExercise(null);
        setSelectedExercise(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingExercise && editingExercise.id === exercise.id) {
          setEditingExercise(null); // Si el formulario de edición está abierto, ciérralo
        }
        setEditingExercise(null);
        setExpandedRow(exercise.id);
        setSelectedExercise(exercise); // Selecciona la fila al hacer clic
      }
    };
    
    const handleEditClick = (exercise) => {
      if (editingExercise && editingExercise.id === exercise.id) {
        setEditingExercise(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== exercise.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedExercise(null);
        }
        setExpandedRow(null);
        setSelectedExercise(null);
        setEditingExercise(exercise); // Muestra el formulario de edición para el ejercicio seleccionado
      }
    };
    
    return (
      <div className="container2">
          <ul className='cardcontainer'>
            {filteredExercises.map((exercise) => (
              <li key={exercise.id} className={`row ${((selectedExercise && selectedExercise.id === exercise.id) || (editingExercise && editingExercise.id === exercise.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(exercise)} className={`row_header ${((selectedExercise && selectedExercise.id === exercise.id) || (editingExercise && editingExercise.id === exercise.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{exercise.name}</div>
                    <div className='row_description'>{exercise.muscles.join(" - ")}</div>
                  </div>
                  <div className='row_buttons'>
                    <div className="row_edit">
                      <i className="bi bi-database-add" onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-trash" onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-pencil-square" onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                    </div>
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
                {editingExercise && editingExercise.id === exercise.id && (
                  <>
                    <RequestExercisesEdit exercise={editingExercise} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}