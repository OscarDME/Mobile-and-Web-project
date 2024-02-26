import React, { useState } from 'react';
import { RoutineCard } from "../DATA_NEW_ROUTINES";
import '../../styles/Management.css';
import {ToolTip} from '../ToolTip';
import SelectFilter from '../SelectFilter';
import MyRoutinesAdd from './MyRoutinesAdd';
import SearchBar from '../SearchBar';
import MyRoutinesEdit from './MyRoutinesEdit';

export default function MyRoutines() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [daysFilter, setDaysFilter] = useState('');
    const [showAddPage, setShowAddPage] = useState(false);
    const [showEditPage, setShowEditPage] = useState(false);
    const [deleteRoutine, setDeleteRoutine] = useState(null);


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


    const filteredExercises = RoutineCard.filter(routine => {
      return (
        routine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (difficultyFilter ? routine.difficulty === difficultyFilter : true) &&
        (daysFilter ? routine.days.length.toString() === daysFilter : true)
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
        setDeleteRoutine(null);
        setExpandedDay(null);
        setSelectedRoutine(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedDay(null);
        setDeleteRoutine(null);
        setExpandedRow(routine.id);
        setSelectedRoutine(routine); // Selecciona la fila al hacer clic
      }
    };

    const handleDeleteClick = (routine) => {
      if (deleteRoutine && deleteRoutine.id === routine.id) {
        setDeleteRoutine(null); 
      } else {
        if (expandedRow && expandedRow !== routine.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedRoutine(null);
          setExpandedDay(null);
        setExpandedRow(null);
        }
        setExpandedRow(null);
        setExpandedDay(null);
        setSelectedRoutine(null);
        setDeleteRoutine(routine); 
      }
    };

    const handleEditClick = (routine) => {
      setSelectedRoutine(routine);
      setShowEditPage(true); 
    }

    const handleDayClick = (day) => {
      setExpandedDay(expandedDay === day ? null : day);
    };
    
    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowEditPage(false);
        setShowAddPage(false); // Volver a la lista
    };

    const handleDeleteRoutineButton = (routine) =>{

      //TODO: eliminar rutina :)
    }
    
    // Si showAddPage es verdadero, renderiza el componente de agregar 
    if (showAddPage) {
        return <MyRoutinesAdd onBackToList={handleBackToList} />;
    }
    if (showEditPage) {
      return <MyRoutinesEdit onBackToList={handleBackToList} routine={selectedRoutine}/>;
    }

    return (
      <div className="container2">
      <div className="search-bar-container2">
  <div className='search-bar'>
    <div className='addclient'><i className="bi bi-search h4"></i></div>
    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
  </div>
  <div>
    <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
  </div>
  </div>
      
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
                  <div className='row_description'>{routine.days.length.toString()} día(s) a la semana</div>
                </div>
                    <div className="row_edit">
                    <i className={`bi bi-pencil-square card-icon-routine `} onClick={(e) => { e.stopPropagation(); handleEditClick(routine); }}></i>
                      <i className={`bi bi-trash card-icon-routine `} onClick={(e) => { e.stopPropagation(); handleDeleteClick(routine); }}></i>
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

              {deleteRoutine && deleteRoutine.id === routine.id &&(
                <form className='center-delete-routine-btn'>
                  <button type="submit" className='delete_button' onClick={(e) => { e.stopPropagation(); handleDeleteRoutineButton(routine); }}>Eliminar rutina {routine.name}</button>
                  </form>
                )}

            </li>
          ))}
        </ul>
      </div>
    );
}


