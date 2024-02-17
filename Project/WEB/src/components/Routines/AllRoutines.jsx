import React, { useState } from 'react';
import { RoutinesCard } from "../DATA_ROUTINES";
import '../../styles/Management.css';
import {ToolTip} from '../ToolTip';
import SelectFilter from '../SelectFilter';

export default function AllRoutines() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [daysFilter, setDaysFilter] = useState('');

    const difficultyOptions = [
      { value: 'Fácil', label: 'Fácil' },
      { value: 'Medio', label: 'Medio' },
      { value: 'Difícil', label: 'Difícil' }
    ];

    const daysPerWeekOptions = [
      {value: '1', label: '1'},
      {value: '2', label: '2'},
      {value: '3', label: '3'},
      {value: '4', label: '4'},
      {value: '5', label: '5'},
      {value: '6', label: '6'},
      {value: '7', label: '7'},
    ];

    const filteredExercises = RoutinesCard.filter(routine => {
      return (
        routine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (difficultyFilter ? routine.difficulty === difficultyFilter : true) &&
        (daysFilter ? routine.daysPerWeek.toString() === daysFilter : true)
      );
    });
    

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
        setExpandedDay(null);
        setSelectedRoutine(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedDay(null);
        setExpandedRow(routine.id);
        setSelectedRoutine(routine); // Selecciona la fila al hacer clic
      }
    };

    const handleDayClick = (day) => {
      setExpandedDay(expandedDay === day ? null : day);
    };
    


    return (
      <div className="container2">
          <div className="filters-container">
          <div className='filter-row'>
          Filtrar por dificultad: 
          <SelectFilter
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            options={difficultyOptions}
            defaultOption="Todas las dificultades"
          />
          </div>
          <div className='filter-row'>
          Filtrar por días por semana:
          <SelectFilter
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
            options={daysPerWeekOptions}
            defaultOption="Todos los días"
          />
          </div>

    </div>
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
                  {Object.entries(routine.dailyRoutines).map(([day, dayInfo], index) => (
                    <div key={day} className={`routine-day-info ${index % 2 === 0 ? 'day-even' : 'day-odd'}`}>
                      <div className={`routine-day ${expandedDay === day ? 'selected' : ''}`} onClick={() => handleDayClick(day)}>
                        <i className={`bi ${expandedDay === day ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} day-icon`}></i>
                        {day}
                      </div>
                      {expandedDay === day && (
                        <div className='day-block'>
                          {dayInfo.blocks.map((block, blockIndex) => (
                            <div key={blockIndex} className='exercise-block'>
                              <ul className={`exercise-list ${blockIndex % 2 === 0 ? 'exercise-even' : 'exercise-odd'}`}>
                                {block.exercises.map((exercise, exerciseIndex) => (
                                  <li key={exerciseIndex} className='exercise-row'>
                                  <div className='exercise-name'><h5>{exercise.exerciseId.name}</h5><ToolTip muscles={exercise.exerciseId.muscles} difficulty={exercise.exerciseId.difficulty} material={exercise.exerciseId.material} type={exercise.exerciseId.type}>
                                  <i class="bi bi-info-circle-fill info-icon"></i>
                                  </ToolTip> 
                                  </div>
                                    {(exercise.exerciseId.type === "Pesas" || exercise.exerciseId.type === "Peso corporal") && (
                                      <div>
                                      {exercise.sets} Sets, {exercise.reps} Repticiones, {exercise.restBetweenSets} segundos de descanso
                                      </div>
                                  )}

                                  {exercise.exerciseId.type === "Cardiovascular" && (
                                      <div>
                                      {exercise.time} minutos
                                      </div>
                                  )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
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


