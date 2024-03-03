import React, { useEffect, useState } from 'react';
import { ToolTipInfo } from '../ToolTipInfo';
import NumberInput from '../NumberInput';

export default function AssignRoutinesModify({ onBackToList, selectedUser ,selectedRoutine, onRoutineUpdate }) {

  const [updatedRoutine, setUpdatedRoutine] = useState(selectedRoutine);


  useEffect(()=>{
    setUpdatedRoutine(selectedRoutine);
  }, [])

  useEffect(() => {
    setUpdatedRoutine(null);
}, [selectedUser]);


  useEffect(() => {
    setUpdatedRoutine(updatedRoutine);
  }, [updatedRoutine]);

  useEffect(() => {
    if (updatedRoutine) {
      onRoutineUpdate(updatedRoutine);
    }
  }, [updatedRoutine, onRoutineUpdate]);
  
  function renderExercises(day, dayIndex) {
    return day.exercises.map((exercise, exerciseIndex) => (
      <div key={exerciseIndex} className='exercise-not-superserie'>
          {
            exerciseIndex > 0 && updatedRoutine.days[dayIndex].exercises[exerciseIndex - 1].isSuperSet ? (
              <>
                <div className="red-element bar-top"></div>
                <div className="red-element dot-top"></div>
              </>
            ) : null
          }
        <h4>{exercise.exerciseToWork.name}</h4>
        {exercise.sets.map((setGroup, groupIndex) =>
          setGroup.map((set, setIndex) => (
            <div key={setIndex} className='set-container-modify'>
              {exercise.exerciseToWork.type !== "Cardiovascular" ? (
                <>
                <div className='set-info'>
                  {setIndex === 0 ? ( "Set " + (groupIndex + 1) ): ("Dropset " + (setIndex + 1))}
                </div>
                <div className='container-center'>
                Repeticiones:
                  <NumberInput
                    label="Repeticiones"
                    placeholder="..."
                    value={Number(set.reps)}
                    min={1}
                    max={600}
                    onChange={(event,reps) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'reps', reps)}
                  />
                  </div>
                  <div className='container-center'>
                  Peso (kg):
                  <NumberInput
                    label="Peso"
                    placeholder="..."
                    min={1}
                    max={600}
                    value={Number(set.weight)}
                    onChange={(event,weight) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'weight', weight)}
                  />
                  </div>
                </>
              ) : (
                <>
                <div className='container-center'>
                Tiempo (minutos):
                <NumberInput
                  placeholder="..."
                  label="Tiempo"
                  min={1}
                  max={600}
                  value={Number(set.time)}
                  onChange={(event,time) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'time', time)}
                />
                </div>
                </>
              )}
            </div>
          ))
        )}
        {exercise.isSuperSet ? (
          <>
          <div class="red-element bar-bottom"></div>
         <div class="red-element dot-bottom"></div>
          </>

          ) :<></> }

      </div>
    ));
  }



  const handleSetChange = (dayIndex, exerciseIndex, groupIndex, setIndex, field, value) => {
    // Clonar profundamente updatedRoutine para mantener la inmutabilidad
    let newUpdatedRoutine = { ...updatedRoutine, days: updatedRoutine.days.map(day => ({ ...day })) };
  
    // Acceder directamente al set específico a actualizar
    let targetSet = newUpdatedRoutine.days[dayIndex].exercises[exerciseIndex].sets[groupIndex][setIndex];
  
    // Actualizar el campo específico del set
    if (field === 'time') {
      targetSet.time = Number(value);
    } else {
      // Actualizar otros campos como 'reps' o 'weight'
      targetSet[field] = Number(value);
    }
  
    // Establecer el estado actualizado
    setUpdatedRoutine(newUpdatedRoutine);
  };
  
  
  
  
  

  return (
    <div className='add_header2'>
    <div className='container3'>
      <div className='modify-header'>
        <button className="back_icon2 card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i></button>
        <div className='title-set-modify'>
        <h5 className='MainTitle'>Asignar valores a {updatedRoutine.name}</h5>   
        <ToolTipInfo message={"Las barras rojas conectan ejercicios que tienen superseries."}><i class="bi bi-info-circle-fill info-icon"/></ToolTipInfo>
        </div>
      </div>
      <div className='days-main-container2'>
      <div>
      <div className='routine-selection'>
        {updatedRoutine?.days.map((day, index) => (
          <div key={index} className="day-container2">
          <div>
            <h3 className="day-title">Día {index + 1} - {day.dayName}</h3> 
            </div>
            {renderExercises(day, index)}
            
          </div>
        ))}
      </div>
            </div>
    </div>
    </div>
    </div>
  );
}
