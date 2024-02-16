import React, { useState } from 'react';
import { RoutinesCard } from "../DATA_ROUTINES";
import '../../styles/Management.css';

export default function AllRoutines() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);


    const filteredExercises = RoutinesCard.filter(routine =>
      routine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDifficultyClass = (difficulty) => {
      switch(difficulty) {
        case 'Fácil':
          return 'row-easy';
        case 'Medio':
          return 'row-medium';
        case 'Difícil':
          return 'row-hard';
        default:
          return '';
      }
    };
    
    const handleRowClick = (routine) => {
      if (expandedRow === routine.id) {
        setExpandedRow(null);
        setSelectedRoutine(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedRow(routine.id);
        setSelectedRoutine(routine); // Selecciona la fila al hacer clic
      }
    };

    const handleDayClick = (day) => {
      setExpandedDay(expandedDay === day ? null : day);
    };
    


    return (
      <div className="container2">
        <ul className='cardcontainer-colors'>
          {filteredExercises.map((routine) => (
            <li key={routine.id} className={`row ${getDifficultyClass(routine.difficulty)} ${((selectedRoutine && selectedRoutine.id === routine.id)) ? 'selected' : ''}`}>
                    <div onClick={() => handleRowClick(routine)} className={`row_header ${((selectedRoutine && selectedRoutine.id === routine.id)) ? 'selected' : ''}`}>
                <div>
                  <div className='row_name'>{routine.name}</div>
                  <div className='row_description'>{routine.difficulty}</div>
                  <div className='row_description'>{routine.daysPerWeek} día(s) a la semana</div>
                </div>
              </div>
              {expandedRow === routine.id && (
                <div className="routine-info">
                  {Object.entries(routine.dailyRoutines).map(([day, dayInfo]) => (
                    <div key={day}>
                      <h3>{day}</h3>
                      {dayInfo.blocks.map((block, index) => (
                        <div key={index}>
                          <p>Muscle Group IDs: {block.muscleGroup.join(', ')}</p>
                          <p>Exercises:</p>
                          <ul>
                            {block.exercises.map((exercise, exerciseIndex) => (
                              <li key={exerciseIndex}>
                                Exercise ID: {exercise.exerciseId}, Sets: {exercise.sets}, Reps: {exercise.reps}, Rest Between Sets: {exercise.restBetweenSets} seconds, Rest After Exercise: {exercise.restAfterExercise} seconds
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
}


