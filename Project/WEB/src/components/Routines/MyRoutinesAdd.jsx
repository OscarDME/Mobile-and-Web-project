import React, { useState, useEffect} from 'react';
import '../../styles/Management.css';
import NumberInput from '../NumberInput';
import Dropdown from '../DropDown';
import { ExerciseCard } from '../DATA_EXERCISES';


export default function MyRoutinesAdd({ onBackToList }) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const [routineName, setRoutineName] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState(1);
    const initialState = Array.from({ length: daysPerWeek }, () => []);
    const [exercises, setExercises] = useState(initialState);    
    const [selectedDays, setSelectedDays] = useState(Array(daysPerWeek).fill(''));


    useEffect(() => {
      setSelectedDays(prev => {
        const newSize = Array(daysPerWeek).fill('');
        return prev.length < daysPerWeek ? [...prev, ...newSize.slice(prev.length)] : prev.slice(0, daysPerWeek);
      });
    
      setExercises(prev => {
        const newSize = Array.from({ length: daysPerWeek }, () => []);
        return prev.length < daysPerWeek ? [...prev, ...newSize.slice(prev.length)] : prev.slice(0, daysPerWeek);
      });
    }, [daysPerWeek]);
    

  const handleRoutineNameChange = (event) => setRoutineName(event.target.value);

  const addExercise = (dayIndex) => {
    setExercises(currentExercises => 
      currentExercises.map((dayExercises, index) => 
        index === dayIndex 
          ? [...dayExercises, { type: "", time: 0, sets: 0, reps: 0, rest: 0 }] 
          : dayExercises
      )
    );
  };
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!routineName) { 
      alert('Por favor, completa todos los campos.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    // TODO: refrescar la lista de comidas automaticamente
    onBackToList();
  };

  function generateDayContainers(daysCount) {
    let containers = [];
    for (let i = 0; i < daysCount; i++) {
      const availableOptions = days.filter(day => !selectedDays.includes(day) || selectedDays[i] === day);
      containers.push(
        <div key={i} className="day-container">
          <div className="day-title">Día {i + 1}: 
            <Dropdown 
              options={availableOptions}
              selectedOption={selectedDays[i]}
              onChange={(e) => handleDayChange(e.target.value, i)}
            />
          </div>
          <div className='routine-area-add'>
          <button className='btn-add-exercise' type='button' onClick={(e) => { e.stopPropagation(); addExercise(i); }}> 
          <i className="bi bi-plus-circle add-routine-icon"></i> Añadir un ejercicio
          </button>
          {renderExercises(i)}
          {console.log(selectedDays)}
          {console.log(exercises)}
          </div>
        </div>
      );
    }
    return containers;
  }
  
  
  const handleDayChange = (value, dayIndex) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[dayIndex] = value;
    setSelectedDays(newSelectedDays);
  };


  function renderExercises(dayIndex) {
    if (!exercises[dayIndex]) {
      return <></>;
    }
    return exercises[dayIndex].map((exercise, index) => (
    <div key={index} className="routine-exercise-row">
      <Dropdown
        options={ExerciseCard.map(exercise => exercise.name)}
        selectedOption={exercise.name}
        onChange={(e) => handleExerciseTypeChange(e.target.value, dayIndex, index)}
      />
      {exercise.type === "Cardiovascular" && (
        <input
          type="number"
          placeholder="Tiempo (minutos)"
          value={exercise.time}
          onChange={(e) => handleExerciseChange(index, "tie", e.target.value)}
        />
      )}
      {(exercise.type === "Pesas" || exercise.type === "Peso corporal") && (
        <>
          <input
            type="number"
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
          />
          <input
            type="number"
            placeholder="Repeticiones"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
          />
          <input
            type="number"
            placeholder="Descanso (segundos)"
            value={exercise.rest}
            onChange={(e) => handleExerciseChange(index, "rest", e.target.value)}
          />
        </>
      )}
        <i className="bi bi-trash exercise-btn-delete" onClick={() => removeExercise(dayIndex, index)} type="button" ></i> 
    </div>
  ));
}

const removeExercise = (dayIndex, exerciseIndex) => {
  setExercises(currentExercises => 
    currentExercises.map((dayExercises, index) => {
      if (index === dayIndex) {
        return dayExercises.filter((_, idx) => idx !== exerciseIndex);
      }
      return dayExercises;
    })
  );
};



  const handleExerciseTypeChange = (selectedName, dayIndex, exerciseIndex) => {
    const selectedExercise = ExerciseCard.find(exercise => exercise.name === selectedName);
    setExercises(currentExercises => 
      currentExercises.map((dayExercises, index) => {
        if (index === dayIndex) {
          const updatedExercises = [...dayExercises];
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            type: selectedExercise.type, 
            id: selectedExercise.id,
            name: selectedExercise.name
          };
          return updatedExercises;
        }
        return dayExercises;
      })
    );
  };
  



const handleExerciseChange = (exerciseIndex, field, value, dayIndex) => {
  setExercises(currentExercises =>
    currentExercises.map((dayExercises, index) =>
      index === dayIndex
        ? dayExercises.map((exercise, idx) =>
            idx === exerciseIndex ? { ...exercise, [field]: value } : exercise
          )
        : dayExercises
    )
  );
};




  return (
<div className='container2'>
      <div className='add_header2'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Crear una Rutina nueva</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area2'>
        <div className='routine-header-container'>
          <div className='add_exercise_rows2'>
              ¿Cuál es el nombre de la rutina? 
              <input type="text" className='add_exercise_input' value={routineName} onChange={handleRoutineNameChange}  />
            </div>
            <div className='add_exercise_rows2'>
            Días por semana de la rutina
            <NumberInput
                placeholder="…"
                value={Number(daysPerWeek)}
                min={1}
                max={7}
                onChange={(event, days) => setDaysPerWeek(days)}
                />
            </div>
        </div>
            <div className='days-main-container'>
            {generateDayContainers(daysPerWeek)}
            </div>
        </div>
        <button className='add_button'>Guardar Rutina</button>
      </form>
    </div>
  )
}