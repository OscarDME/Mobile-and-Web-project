import React, { useState, useEffect} from 'react';
import '../../styles/Management.css';
import NumberInput from '../NumberInput';
import Dropdown from '../DropDown';
import { ExerciseCard } from '../DATA_EXERCISES';
import Switch from '@mui/material/Switch';
import {ToolTipInfo} from '../ToolTipInfo';


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

  
  const addExercise = (dayIndex, type) => {
    let newSet = { time: null, reps: null, weight: null };
  
    let newExercise = {
      sets: [[newSet]], 
      rest: 0,
      isSuperset: false,
    };
  
    setExercises(exercises => 
      exercises.map((day, index) => 
        index === dayIndex ? [...day, newExercise] : day
      )
    );
  };
  
  const addDropSetToSet = (dayIndex, exerciseIndex, groupIndex, newSet) => {
    setExercises(currentExercises => {
      return currentExercises.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          return day.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              let updatedSets = [...exercise.sets];
              if (updatedSets[groupIndex] !== undefined) {
                updatedSets[groupIndex] = [...updatedSets[groupIndex], newSet];
              } else {
                updatedSets[groupIndex] = [newSet];
              }
              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          });
        }
        return day;
      });
    });
  };
  

  const addSetToExercise = (dayIndex, exerciseIndex, newSet) => {
    setExercises(currentExercises => {
      return currentExercises.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          return day.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              const updatedSets = [...exercise.sets, [newSet]];
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
          <i className="bi bi-plus-circle add-routine-icon"></i> Añadir un ejercicio para el día {i + 1} ({selectedDays[i]})
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
  
    return exercises[dayIndex].map((exercise, exerciseIndex) => {
      const exerciseSelected = exercise.name && exercise.name !== "N/A";
  
      return (
        <>
        <div key={exerciseIndex} className={`routine-exercise-row ${exerciseIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
          <div className='routine-exercise-header'>
            <Dropdown
              options={ExerciseCard.map(ex => ({ label: ex.name, value: ex.id }))}
              selectedOption={exercise.name}
              onChange={(e) => handleExerciseTypeChange(e.target.value, dayIndex, exerciseIndex)}
            />
            <i className="bi bi-trash exercise-btn-delete" onClick={() => removeExercise(dayIndex, exerciseIndex)}></i> 
          </div>
          {/* Verifica si se ha seleccionado un ejercicio antes de mostrar los detalles de los sets */}
          {exerciseSelected && (
            <div>
              {/* Aquí va la lógica para mostrar los detalles de los sets, como el número de sets, repeticiones, peso, etc. */}
              {/* Ejemplo: */}
              <div className='all-sets-container'>
                {/* Itera sobre cada grupo de sets */}
                {exercise.sets.map((setGroup, groupIndex) => (
                  <div key={groupIndex} className="set-group-container">
                    {setGroup.map((set, setIndex) => (
                      <div key={setIndex} className="set-details">
                        {/* Detalles del set como repeticiones, peso, etc. */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </>
      );
    });
  }
  
  function renderExercises(dayIndex) {
    // Verificación existente para asegurarse de que hay ejercicios en el día especificado.
    if (!exercises[dayIndex]) {
      return <></>;
    }
  
    return exercises[dayIndex].map((exercise, exerciseIndex) => {
      // Solo muestra los detalles si se ha seleccionado un ejercicio (es decir, el nombre del ejercicio no está vacío).
      const exerciseSelected = exercise.name && exercise.name !== "N/A";
      return (
        <div key={exerciseIndex} className={`routine-exercise-row ${exerciseIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
          <div className='routine-exercise-header'>
            <Dropdown
              options={ExerciseCard.map(ex => ex.name)}
              selectedOption={exercise.name}
              onChange={(e) => handleExerciseTypeChange(e.target.value, dayIndex, exerciseIndex)}
            />
            <i className="bi bi-trash exercise-btn-delete" onClick={() => removeExercise(dayIndex, exerciseIndex)}></i>
          </div>
          {exerciseSelected && (
            <>
            <div className='routine-exercise-header'>
{exercise.type !== "Cardiovascular" && (
  <>
  <div>
        ¿Es superserie? <ToolTipInfo message={"Al seleccionar esta opción, se iniciará la primera serie de un ejercicio y, tras finalizarla, comenzará la primera serie del ejercicio siguiente, continuando así hasta completar todas las series."}><i class="bi bi-info-circle-fill info-icon"/></ToolTipInfo>
        <Switch
                checked={exercise.isSuperset}
                onChange={(e) => handleIsSupersetChange(dayIndex, exerciseIndex, 'isSuperset', e.target.checked)}
                disabled={
                // Verifica si el siguiente ejercicio existe y es cardiovascular
                  (exerciseIndex < exercises[dayIndex].length - 1 && exercises[dayIndex][exerciseIndex + 1].type === "Cardiovascular") ||
                  // Verifica si es el último ejercicio del día
                  exerciseIndex === exercises[dayIndex].length - 1
                  }
                inputProps={{ 'aria-label': 'controlled' }}
        />
        </div>
        <div className="exercise-time-input">
    <label>Descanso entre sets (segundos) </label>
    <NumberInput
      placeholder="Tiempo en segundos"
      value={Number(exercise.rest)}
      min={1}
      max={600}
      onChange={(event, rest) => handleExerciseChange(dayIndex, exerciseIndex, 'rest', rest)}
    />
  </div>
  </>

)}
</div>
        <div className='all-sets-container'>
        {exercise.type !== "Cardiovascular" && (
          <button type="button" className='btn-add-exercise-set' onClick={(e) => {
             e.stopPropagation();
             const newSet = { time: null, reps: null, weight: null };
            addSetToExercise(dayIndex, exerciseIndex,newSet); 
            }}>
            <i className="bi bi-plus-circle add-routine-icon"></i> Añadir un Set para {exercise.name}
          </button>
        )}
        {exercise.sets.map((setGroup, groupIndex) => (
  <div key={groupIndex} className="set-group-container">
    {setGroup.map((set, setIndex) => (
      <div key={setIndex} className="set-container">
        {exercise.type !== "Cardiovascular" ? (
          <>
            {setIndex === 0 ? ( // Solo para el primer set del grupo
              <div className='routine-exercise-container'>
                <div className='routine-superset-box'>
                  <div className={`${exerciseIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
                    Set {groupIndex + 1}
                    {exercise.type !== "Cardiovascular" && (
                      <i className='bi bi-eraser-fill exercise-btn-delete' onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); 
                        removeSetFromExercise(dayIndex, exerciseIndex, groupIndex, setIndex);
                      }} ></i>
                    )}
                    <button onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); 
                      const newSet = { time: null, reps: null, weight: null };
                      addDropSetToSet(dayIndex, exerciseIndex, groupIndex, newSet);
                    }}>
                      <i className="bi bi-plus-circle add-routine-icon"></i>
                      Añadir dropset
                    </button>
                  </div>
                </div>
                <div>
                  <div>Repeticiones:</div>
                  <NumberInput
                    placeholder="..."
                    value={set.reps}
                    min={1}
                    max={1000}
                    onChange={(event, reps) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'reps', reps)}
                  />
                </div>
              </div>
            ) : ( // Solo muestra el input para los dropsets adicionales
              <div className='routine-exercise-dropset-container'>
                <div>Dropset {setIndex + 1} Repeticiones:</div>
                <NumberInput
                  placeholder="..."
                  value={set.reps}
                  min={1}
                  max={1000}
                  onChange={(event, reps) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'reps', reps)}
                />
              </div>
            )}
          </>
        ):(
          <>
          <div className='routine-exercise-container'>
                Tiempo:
                <NumberInput
                placeholder="..."
                value={set.time}
                min={1}
                max={1000}
                  onChange={(event, time) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'time', time)}
                  />
              </div>
          </>
        )}
      </div>
    ))}
  </div>
))}

        </div>
            </>
          )}
        </div>
      );
    });
  }

  
const handleSetChange = (dayIndex, exerciseIndex, groupIndex, setIndex, field, value) => {
  setExercises(currentExercises =>
    currentExercises.map((dayExercises, dIndex) => {
      if (dIndex === dayIndex) {
        return dayExercises.map((exercise, eIndex) => {
          if (eIndex === exerciseIndex) {
            // Actualiza el set específico dentro del subarray correcto
            const updatedSets = exercise.sets.map((setGroup, gIndex) => {
              if (gIndex === groupIndex) {
                return setGroup.map((set, sIndex) => {
                  if (sIndex === setIndex) {
                    if (exercise.type === 'Cardiovascular' && field === 'time') {
                      return { ...set, time: Number(value) };
                    } else {
                      return { ...set, [field]: Number(value) };
                    }
                  }
                  return set;
                });
              }
              return setGroup;
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
    currentExercises.map((dayExercises, dIdx) => {
      if (dIdx === dayIndex) {
        // Copia los ejercicios para el día especificado antes de hacer cambios
        const updatedDayExercises = [...dayExercises];

        // Elimina el ejercicio seleccionado
        updatedDayExercises.splice(exerciseIndex, 1);

        // Si el ejercicio eliminado no es el primero, actualiza el ejercicio anterior
        if (exerciseIndex > 0 && updatedDayExercises[exerciseIndex - 1]) {
          updatedDayExercises[exerciseIndex - 1] = {
            ...updatedDayExercises[exerciseIndex - 1],
            isSuperset: false,
          };
        }

        return updatedDayExercises;
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

  // Actualizar el estado de isSuperset del ejercicio anterior al cambiar de ejercicio
  // Solo si no es el primer ejercicio de la lista
  if (exerciseIndex > 0) {
    const previousExerciseIndex = exerciseIndex - 1;
    const previousExercise = exercises[dayIndex][previousExerciseIndex];
    if (previousExercise && previousExercise.isSuperset) {
      setExercises(currentExercises =>
        currentExercises.map((dayExercises, dIdx) =>
          dIdx === dayIndex
            ? dayExercises.map((exercise, eIdx) =>
                eIdx === previousExerciseIndex ? { ...exercise, isSuperset: false } : exercise
              )
            : dayExercises
        )
      );
    }
  }

  setExercises(currentExercises =>
    currentExercises.map((dayExercises, dIndex) =>
      dIndex === dayIndex
        ? dayExercises.map((exercise, eIndex) =>
            eIndex === exerciseIndex
              ? {
                  ...exercise,
                  type: selectedExercise.type,
                  isSuperset: false, 
                  exerciseId: selectedExercise.id,
                  name: selectedExercise.name,
                  rest: exercise.type === 'Cardiovascular' ? 0 : exercise.rest,
                  sets: [[{ reps: null, weight: null, time: null }]], // Restablecer sets al cambiar de ejercicio
                }
              : exercise
          )
        : dayExercises
    )
  );
};




const removeSetFromExercise = (dayIndex, exerciseIndex, groupIndex, setIndex) => {
  setExercises(currentExercises =>
    currentExercises.map((dayExercises, dIndex) => {
      if (dIndex === dayIndex) {
        return dayExercises.map((exercise, eIndex) => {
          if (eIndex === exerciseIndex) {
            // Copia los grupos de sets actuales
            let updatedSetGroups = [...exercise.sets];
            // Calcula el total de sets en el ejercicio
            const totalSets = updatedSetGroups.reduce((acc, group) => acc + group.length, 0);

            // Solo permite la eliminación si hay más de un set en total
            if (totalSets > 1) {
              // Verifica si el grupo de sets y el set específico existen
              if (updatedSetGroups[groupIndex] && updatedSetGroups[groupIndex][setIndex] !== undefined) {
                // Elimina el set específico del grupo específico
                updatedSetGroups[groupIndex] = updatedSetGroups[groupIndex].filter((_, sIndex) => sIndex !== setIndex);
                // Si después de eliminar el set, el grupo queda vacío, también se podría optar por eliminar el grupo
                if (updatedSetGroups[groupIndex].length === 0) {
                  updatedSetGroups = updatedSetGroups.filter((_, gIndex) => gIndex !== groupIndex);
                }
              }
            }
            // Actualiza el ejercicio con los sets modificados
            return { ...exercise, sets: updatedSetGroups };
          }
          return exercise;
        });
      }
      return dayExercises;
    })
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

  const handleIsSupersetChange = (dayIndex, exerciseIndex, field, value) => {
    setExercises(currentExercises =>
      currentExercises.map((dayExercises, idx) =>
        idx === dayIndex
          ? dayExercises.map((exercise, exIdx) =>
              exIdx === exerciseIndex ? { ...exercise, [field]: value } : exercise
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