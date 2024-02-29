import React, {useEffect, useState} from 'react'
import { RoutineCard } from '../DATA_NEW_ROUTINES'
import AssignRoutinesModify from './AssignRoutinesModify';
import SearchBar from '../SearchBar';
import { ToolTip } from '../ToolTip';

export default function AssingRoutinesList() {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [showUpdateRoutinePage, setUpdateRoutinePage] = useState(false);

    const filteredExercises = RoutineCard.filter(routine => {
        return (
          routine.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      const handleUpdateClick = () => {
        setUpdateRoutinePage(true); 
      };

      const handleDayClick = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
      };

      const handleBackToList = () => {
        setUpdateRoutinePage(false);
    };

    if (showUpdateRoutinePage) {
        return <AssignRoutinesModify onBackToList={handleBackToList} />;
    }

    return (
        <div className="container2">
              <h2 className='MainTitle'>Lista de rutinas</h2>
        <div className="search-bar-container2">
    <div className='search-bar'>
      <div className='addclient'><i className="bi bi-search h4"></i></div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
    </div>
          <ul className='cardcontainer-colors2'>
            {filteredExercises.map((routine) => (
              <li key={routine.id} className={`row ${getDifficultyClass(routine.difficulty)} ${((selectedRoutine && selectedRoutine.id === routine.id)) ? 'selected' : ''}`}>
                      <div onClick={() => handleRowClick(routine)} className={`row_header ${((selectedRoutine && selectedRoutine.id === routine.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{routine.name}</div>
                    <div className='row_description'>{routine.difficulty}</div>
                    <div className='row_description'>{routine.days.length.toString()} día(s) a la semana</div>
                  </div>
                      <div className="row_edit">
                      <button className='btn-select-routine' onClick={(e) => { e.stopPropagation(); handleUpdateClick(routine); }}>Elegir</button>
                      </div>
                </div>
                
                {expandedRow === routine.id && (
                  <div className="routine-info">
                  {routine.days.map((day, dayIndex) => (
                      <div key={day.id} className={`routine-day-info ${dayIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
                        <div className={`routine-day ${expandedDay && expandedDay.id === day.id ? 'selected' : ''}`} onClick={() => handleDayClick(day)}>
                          <i className={`bi ${expandedDay && expandedDay.id === day.id ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} day-icon`}></i>
                          {day.dayName}
                        </div>
                        {expandedDay && expandedDay.id === day.id && (
                          <div className='day-block'>
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <div key={exercise.id} className='exercise-block'>
                                <ul className={`exercise-list ${exerciseIndex % 2 === 0 ? 'exercise-even' : 'exercise-odd'}`}>
                                  <li className='exercise-row'>
                                    <div className='exercise-name'>
                                      <h5>{exercise.exerciseToWork.name}</h5>
                                      <ToolTip muscles={exercise.exerciseToWork.muscles} difficulty={exercise.exerciseToWork.difficulty} material={exercise.exerciseToWork.material} type={exercise.exerciseToWork.type}>
                                        <i className="bi bi-info-circle-fill info-icon"></i>
                                      </ToolTip>
                                    </div>
  
                                    {(exercise.exerciseToWork.type === "Pesas" || exercise.exerciseToWork.type === "Peso corporal") && (
                                        <div>
                                        {exercise.rest} segundos de descanso entre sets
                                        </div>
                                    )}
                                    {exercise.sets.map((set, setIndex) => (
                                      <>
                                      {set.map((individualSet, individualSetIndex)=> (
  
                                        <div className='set-text'>
                                        Set {setIndex + 1} {(individualSetIndex !== 0) && (
                                          <>
                                          / Drop-Set {individualSetIndex + 1} 
                                          </>
                                          )} - {individualSet.reps.toString()} Repeticiones
                                        </div>
                                      ))}
                                    </>
                                    ))}
                                    <div className='superset-text'> {exercise.isSuperSet ? "Sí":"No"} hace superserie con el siguiente ejercicio.
                                    </div>
                                  </li>
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
