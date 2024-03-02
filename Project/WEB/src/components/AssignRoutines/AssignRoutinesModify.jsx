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
      <div key={exerciseIndex}>
        <div>{exercise.name}</div>
        {exercise.sets.map((setGroup, groupIndex) =>
          setGroup.map((set, setIndex) => (
            <div key={setIndex}>
              {exercise.type !== "Cardiovascular" ? (
                <>
                Repeticiones:
                  <NumberInput
                    label="Repeticiones"
                    value={set.reps}
                    onChange={(value) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'reps', value)}
                  />
                  Peso:
                  <NumberInput
                    label="Peso"
                    value={set.weight}
                    onChange={(value) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'weight', value)}
                  />
                </>
              ) : (
                <div>
                Tiempo
                <NumberInput
                  label="Tiempo"
                  value={set.time}
                  onChange={(value) => handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, 'time', value)}
                />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    ));
  }




  const handleSetChange = (dayIndex, exerciseIndex, groupIndex, setIndex, field, value) => {
    let newUpdatedRoutine = JSON.parse(JSON.stringify(updatedRoutine));
  
    let targetSet = newUpdatedRoutine.days[dayIndex].exercises[exerciseIndex].sets[groupIndex][setIndex];
  
    if (field === 'time') {
      targetSet.time = Number(value);
    } else {
      targetSet[field] = Number(value);
    }
    setUpdatedRoutine(newUpdatedRoutine);
  };
  

  return (
    <div className='add_header2'>
    <div className='container3'>
      <div className='modify-header'>
        <button className="back_icon2 card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i></button>
        <h5 className='MainTitle'>Asignar valores a {updatedRoutine.name}</h5>
      </div>
      <div className='days-main-container2'>
      <div>
      <div className='routine-selection'>
        {updatedRoutine?.days.map((day, index) => (
          <div key={index} className="day-container2">
            <h3 className="day-title">Día {index + 1} {day.dayName}:</h3>
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
