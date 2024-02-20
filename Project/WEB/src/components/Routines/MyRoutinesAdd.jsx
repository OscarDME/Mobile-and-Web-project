import React, { useState, useEffect} from 'react';
import '../../styles/Management.css';
import NumberInput from '../NumberInput';
import Dropdown from '../DropDown';
import { ExerciseCard } from '../DATA_EXERCISES';


export default function MyRoutinesAdd({ onBackToList }) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const [routineName, setRoutineName] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState(1);
    const initialState = Array.from({ length: daysPerWeek }, () => ([]));
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

  const addExercise = (dayIndex, exerciseType = 'Pesas') => {
    let newExercise = {
      sets: [], // Inicializar sets vacío
      rest: 0,
      isSuperset: false,
    };
  
    // Añadir un set inicial basado en el tipo de ejercicio
    if (exerciseType === 'Cardiovascular') {
      newExercise.sets.push({ time: 0 }); // Para cardio, inicializar con tiempo
    } else {
      newExercise.sets.push({ reps: 0, weight: 0 }); // Para pesas, inicializar con reps y weight
    }

    setExercises(exercises => 
      exercises.map((day, index) => 
        index === dayIndex ? [...day, newExercise] : day
      )
    );
};
  
  
  
// Función para añadir sets a un ejercicio existente
const addSetToExercise = (dayIndex, exerciseIndex, exerciseType) => {
  setExercises(currentExercises =>
    currentExercises.map((day, dIndex) => {
      if (dIndex === dayIndex) {
        return day.map((exercise, eIndex) => {
          if (eIndex === exerciseIndex) {
            const newSet = exerciseType === 'Cardiovascular' ? { time: 0 } : { reps: 0, weight: 0 };
            return { ...exercise, sets: [...exercise.sets, newSet] };
          }
          return exercise;
        });
      }
      return day;
    })
  );
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
    return exercises[dayIndex].map((exercise, exerciseIndex) => (
      <div key={exerciseIndex} className={`routine-exercise-row ${exerciseIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
        <div className='routine-exercise-header'>
          <Dropdown
            options={ExerciseCard.map(ex => ex.name)}
            selectedOption={exercise.name}
            onChange={(e) => handleExerciseTypeChange(e.target.value, dayIndex, exerciseIndex)}
          />
          <i className="bi bi-trash exercise-btn-delete" onClick={() => removeExercise(dayIndex, exerciseIndex)}></i> 
        </div>
  
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="set-container">
            {exercise.type !== "Cardiovascular" ? (
              <>
                Repeticiones:
                <NumberInput
                  value={set.reps || 0}
                  onChange={(event) => handleSetChange(dayIndex, exerciseIndex, setIndex, 'reps', event.target.value)}
                />
                Peso:
                <NumberInput
                  value={set.weight || 0}
                  onChange={(event) => handleSetChange(dayIndex, exerciseIndex, setIndex, 'weight', event.target.value)}
                />
              </>
            ) : (
              <>
                Tiempo:
                <NumberInput
                  value={set.time || 0}
                  onChange={(event) => handleSetChange(dayIndex, exerciseIndex, setIndex, 'time', event.target.value)}
                />
              </>
            )}
            {exercise.type !== "Cardiovascular" && (
            <button className="btn-remove-set" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              removeSetFromExercise(dayIndex, exerciseIndex, setIndex);
            }}>
              Eliminar Set
            </button>
            )}
          </div>
        ))}
        
        {exercise.type !== "Cardiovascular" && (
          <button type="button" onClick={(e) => {
             e.stopPropagation();
            addSetToExercise(dayIndex, exerciseIndex, exercise.type);
            }}>
              Añadir Set
          </button>
        )}
      </div>
    ));
  }
  
  
  const handleSetChange = (dayIndex, exerciseIndex, setIndex, field, value) => {
    // Actualiza el estado de los ejercicios con el nuevo valor del set
    setExercises(currentExercises =>
      currentExercises.map((dayExercises, dIndex) =>
        dIndex === dayIndex
          ? dayExercises.map((exercise, eIndex) =>
              eIndex === exerciseIndex
                ? {
                    ...exercise,
                    sets: exercise.sets.map((set, sIndex) =>
                      sIndex === setIndex ? { ...set, [field]: Number(value) } : set
                    ),
                  }
                : exercise
            )
          : dayExercises
      )
    );
  };
  

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
  if (selectedName === "none") {
    return;
  }
  const selectedExercise = ExerciseCard.find(exercise => exercise.name === selectedName);
  setExercises(currentExercises => 
    currentExercises.map((dayExercises, dIndex) => {
      if (dIndex === dayIndex) {
        const updatedExercises = [...dayExercises];
        const updatedExercise = {
          ...updatedExercises[exerciseIndex],
          type: selectedExercise.type, 
          exerciseId: selectedExercise.id,
          name: selectedExercise.name,
          sets: selectedExercise.type === 'Cardiovascular' ? [{ time: 0 }] : updatedExercises[exerciseIndex].sets
        };
        // Si es cardiovascular y ya tiene más de 1 set, se resetea a solo 1 set
        if (selectedExercise.type === 'Cardiovascular' && updatedExercise.sets.length > 1) {
          updatedExercise.sets = [{ time: 0 }]; // Resetear a 1 set con tiempo
        }
        updatedExercises[exerciseIndex] = updatedExercise;
        return updatedExercises;
      }
      return dayExercises;
    })
  );
};

const removeSetFromExercise = (dayIndex, exerciseIndex, setIndex) => {
  setExercises(currentExercises =>
    currentExercises.map((dayExercises, dIndex) =>
      dIndex === dayIndex
        ? dayExercises.map((exercise, eIndex) =>
            eIndex === exerciseIndex
              ? {
                  ...exercise,
                  sets: exercise.sets.length > 1 ? exercise.sets.filter((_, sIndex) => sIndex !== setIndex) : exercise.sets,
                }
              : exercise
          )
        : dayExercises
    )
  );
};


  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    setExercises(currentExercises =>
      currentExercises.map((dayExercises, idx) =>
        idx === dayIndex
          ? dayExercises.map((exercise, exIdx) =>
              exIdx === exerciseIndex ? { ...exercise, [field]: Number(value) } : exercise
            )
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
    onBackToList();
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