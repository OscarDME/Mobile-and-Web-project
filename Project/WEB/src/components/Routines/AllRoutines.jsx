import React, { useState, useEffect } from 'react';
import { RoutineCard } from "../DATA_NEW_ROUTINES";
import '../../styles/Management.css';
import {ToolTip} from '../ToolTip';
import SelectFilter from '../SelectFilter';
import SearchBar from '../SearchBar';
import config from "../../utils/conf";


export default function AllRoutines() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [daysFilter, setDaysFilter] = useState('');
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const loadRoutines = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/rutinacompleta`);
                if (response.ok) {
                    const data = await response.json();
                    setRoutines(data);
                } else {
                    console.error('Respuesta fallida al cargar las rutinas:', response.status);
                }
            } catch (error) {
                console.error('Error al cargar las rutinas:', error);
            }
        };
        loadRoutines();
    }, []);

    const difficultyOptions = [
      { value: 'Baja', label: 'Fácil' },
      { value: 'Media', label: 'Medio' },
      { value: 'Alta', label: 'Difícil' }
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

    const filteredExercises = routines.filter(routine => {
        return (
            (routine.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || "") &&
            (difficultyFilter ? routine.dificultad === difficultyFilter : true) &&
            (daysFilter ? routine.diasEntreno.length.toString() === daysFilter : true)
        );
    });

    

    
    const getDifficultyClass = (difficulty) => {
      switch(difficulty) {
        case 'Baja':
          return 'row-easy';
        case 'Media':
          return 'row-medium';
        case 'Alta':
          return 'row-hard';
        default:
          return '';
      }
    };
    
    const handleRowClick = (routine) => {
      if (expandedRow === routine.ID_Rutina) {
        setExpandedRow(null);
        setExpandedDay(null);
        setSelectedRoutine(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedDay(null);
        setExpandedRow(routine.ID_Rutina);
        setSelectedRoutine(routine); // Selecciona la fila al hacer clic
      }
    };

    const handleDayClick = (day) => {
      setExpandedDay(expandedDay === day ? null : day);
    };
    


    return (
      <div className="container2">
      <div className="search-bar-container2">
      <div className='search-bar'>
    <div className='addclient'><i className="bi bi-search h4"></i></div>
    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
            <li key={routine.ID_Rutina} className={`row ${getDifficultyClass(routine.dificultad)} ${((selectedRoutine && selectedRoutine.ID_Rutina === routine.ID_Rutina)) ? 'selected' : ''}`}>
                    <div onClick={() => handleRowClick(routine)} className={`row_header ${((selectedRoutine && selectedRoutine.ID_Rutina === routine.ID_Rutina)) ? 'selected' : ''}`}>
                <div>
                  <div className='row_name'>{routine.nombre}</div>
                  <div className='row_description'>{routine.dificultad}</div>
                  <div className='row_description'>{routine.diasEntreno.length} día(s) a la semana</div>
                </div>
              </div>
              
              {expandedRow === routine.ID_Rutina && (
  <div className="routine-info">
{routine.diasEntreno.map((day) => (
      <div key={day.ID_Dias_Entreno} className={`routine-day-info ${day.ID_Dias_Entreno % 2 === 0 ? 'day-even' : 'day-odd'}`}>
        <div className={`routine-day ${expandedDay === day.ID_Dias_Entreno ? 'selected' : ''}`} onClick={() => handleDayClick(day.ID_Dias_Entreno)}>
          <i className={`bi ${expandedDay === day.ID_Dias_Entreno ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} day-icon`}></i>
          {day.NombreDia}
        </div>
        {expandedDay === day.ID_Dias_Entreno && (
          <div className='day-block'>
          {day.ejercicios.map((exercise, exerciseIndex) => (
  <div key={exercise.ID_Ejercicio} className='exercise-block'>
    <ul className={`exercise-list ${exerciseIndex % 2 === 0 ? 'exercise-even' : 'exercise-odd'}`}>
      <li className='exercise-row'>
        <div className='exercise-name'>
          <h5>{exercise.ejercicio}</h5>
          {/* Asumiendo que ToolTip y la información de ejercicio a mostrar se ajustan a tus necesidades */}
          <ToolTip muscles={exercise.Musculo} difficulty={exercise.Dificultad} material={exercise.Equipo} type={exercise.Tipo_Ejercicio}>
            <i className="bi bi-info-circle-fill info-icon"></i>
          </ToolTip>
        </div>

        {/* Mostrando información de descanso, ajustado para usar la propiedad directamente desde 'exercise' */}
        <div>
          {exercise.DescansoEnSegundos} segundos de descanso entre sets
        </div>

        {/* Iterar sobre los sets y los drop sets */}
        {exercise.bloqueSets.flatMap((bloque, bloqueIndex) =>
  bloque.conjuntoSeries.flatMap((conjunto, conjuntoIndex) => (
    conjunto.series.map((serie, serieIndex) => {
      // Determinar si es un drop set basado en si tiene ID_SeriePrincipal
      const isDropSet = !!serie.ID_SeriePrincipal;
      // Calcular el número de set, teniendo en cuenta si es un drop set
      const setNumber = isDropSet ? `1` : `${conjuntoIndex + 1}`;
      // Mostrar 'Drop-Set' para drop sets, 'Set' para sets normales
      const setText = isDropSet ? `Drop-Set ${setNumber}` : `Set ${setNumber}`;

      return (
        <div key={`${bloqueIndex}-${conjuntoIndex}-${serieIndex}`} className='set-text'>
          {setText}: {serie.repeticiones} repeticiones {serie.peso ? `con ${serie.peso} kg` : ''}
        </div>
      );
    })
  ))
)}
        <div className='superset-text'> {exercise.superset ? "Sí" : "No"} hace superserie con el siguiente ejercicio.</div>
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


