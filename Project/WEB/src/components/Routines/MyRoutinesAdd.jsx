import React, { useState, useEffect} from 'react';
import '../../styles/Management.css';
import NumberInput from '../NumberInput';
import Dropdown from '../DropDown';
import { ExerciseCard } from '../DATA_EXERCISES';
import Switch from '@mui/material/Switch';


export default function MyRoutinesAdd({ onBackToList }) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const [routineName, setRoutineName] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState(1);
    const initialState = Array.from({ length: daysPerWeek }, () => ([]));
    const [exercises, setExercises] = useState(initialState);    
    const [selectedDays, setSelectedDays] = useState(Array(daysPerWeek).fill(''));
    const [checked, setChecked] = useState(false);



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

  
  const addExercise = (dayIndex, type = "Default") => {
    let newSet = { time: null, isDropset: false };
    
    // Si el tipo de ejercicio no es cardiovascular, añade propiedades adicionales
    if (type !== "Cardiovascular") {
      newSet = { ...newSet, reps: null, weight: null };
    }
  
    let newExercise = {
      sets: [newSet], 
      rest: 0,
      isSuperset: false,
    };
  
    setExercises(exercises => 
      exercises.map((day, index) => 
        index === dayIndex ? [...day, newExercise] : day
      )
    );
  };
  


const toggleDropset = (dayIndex, exerciseIndex, setIndex) => {
  setExercises(exercises =>
    exercises.map((day, dIndex) => {
      if (dIndex === dayIndex) {
        return day.map((exercise, eIndex) => {
          if (eIndex === exerciseIndex && exercise.sets.length > setIndex) {
            // Aquí, asegúrate de que el set y el subarray de sets existan
            const updatedSets = exercise.sets.map((setGroup, sGroupIndex) => {
              if (sGroupIndex === setIndex && setGroup.length) {
                // Cambiar isDropset en el último elemento del subarray de sets
                const lastSet = setGroup[setGroup.length - 1];
                return [...setGroup.slice(0, setGroup.length - 1), { ...lastSet, isDropset: !lastSet.isDropset }];
              }
              return setGroup;
            });
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        });
      }
      return day;
    })
  );
};

  
const addSetToExercise = (dayIndex, exerciseIndex, newSet = {}) => {
  setExercises(currentExercises => {
    return currentExercises.map((day, dIndex) => {
      if (dIndex === dayIndex) {
        return day.map((exercise, eIndex) => {
          if (eIndex === exerciseIndex) {
            let setToAdd = { reps: null, weight: null, time: null, isDropset: false };
            // Añade el nuevo set al ejercicio, manteniendo la estructura de datos correcta
            const updatedSets = [...exercise.sets, setToAdd];
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        });
      }
      return day;
    });
  });
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
        <div className='routine-exercise-header'>
{exercise.type !== "Cardiovascular" && (
  <div className="exercise-time-input">
    <label>Tiempo descanso: </label>
    <NumberInput
      placeholder="Tiempo en minutos"
      value={Number(exercise.rest)}
      min={1}
      max={600}
      onChange={(event, rest) => handleExerciseChange(dayIndex, exerciseIndex, 'rest', rest)}
    />
  </div>
)}
</div>
        <div className='all-sets-container'>     
        {exercise.type !== "Cardiovascular" && (
          <button type="button" className='btn-add-exercise-set' onClick={(e) => {
             e.stopPropagation();
            addSetToExercise(dayIndex, exerciseIndex, exercise.type);
            }}>
            <i className="bi bi-plus-circle add-routine-icon"></i> 
              Añadir un Set para {exercise.name}
          </button>
        )}
        {exercise.sets.map((set, setIndex) => (
          <div key={`${exerciseIndex}-${setIndex}`} className="set-container">
            {exercise.type !== "Cardiovascular" ? (
              <>
              <div className='routine-exercise-container'>
              <div className='routine-superset-box'>
              <div className={`${exerciseIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
              <Switch
                defaultChecked={set.isDropset}
                onChange={() => toggleDropset(dayIndex, exerciseIndex, setIndex)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              </div>    
              </div>
              <div>
              Repeticiones:
              </div>
                <NumberInput
                placeholder="..."
                  value={set.reps}
                  min={1}
                  max={1000}
                  onChange={(event, reps) => handleSetChange(dayIndex, exerciseIndex, setIndex, 'reps', reps)}
                />
              </div>
              </>
            ) : (
              <>
              <div className='routine-exercise-container'>
                Tiempo:
                <NumberInput
                placeholder="..."
                value={set.time}
                min={1}
                max={1000}
                  onChange={(event, time) => handleSetChange(dayIndex, exerciseIndex, setIndex, 'time', time)}
                />
                </div>
              </>
            )}
            <div className='routine-exercise-container-delete'>
            {exercise.type !== "Cardiovascular" && (
              <i className='bi bi-trash exercise-btn-delete' onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              removeSetFromExercise(dayIndex, exerciseIndex, setIndex);
            }} ></i>
            )}
            </div>
          </div>
        ))}
      </div>
      </div>
    ));
    
  }
  
  const handleSetChange = (dayIndex, exerciseIndex, setIndex, field, value) => {
    setExercises(currentExercises =>
      currentExercises.map((dayExercises, dIndex) => {
        if (dIndex === dayIndex) {
          return dayExercises.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              // Verificar si el ejercicio es cardiovascular y actualizar el tiempo directamente
              const updatedSets = exercise.sets.map((set, sIndex) => {
                if (sIndex === setIndex) {
                  if (exercise.type === 'Cardiovascular' && field === 'time') {
                    // Actualiza directamente el valor del tiempo para ejercicios cardiovasculares
                    return { ...set, time: Number(value) };
                  } else {
                    // Maneja otros casos como antes (por ejemplo, reps para ejercicios no cardiovasculares)
                    return { ...set, [field]: Number(value) };
                  }
                }
                return set;
              });
              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          });
        }
        return dayExercises;
      })
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
        // Establecer rest en 0 si el tipo es Cardiovascular, de lo contrario, mantener el valor actual
        const restValue = selectedExercise.type === 'Cardiovascular' ? 0 : updatedExercises[exerciseIndex].rest;
        const updatedExercise = {
          ...updatedExercises[exerciseIndex],
          type: selectedExercise.type, 
          exerciseId: selectedExercise.id,
          name: selectedExercise.name,
          rest: restValue, // Actualiza aquí
          sets: [{ reps: null, weight: null, time: null, isDropset: false }]
        };
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