import React, { useEffect, useState } from 'react';

export default function AssignRoutinesModify({ onBackToList, selectedUser ,selectedRoutine, onRoutineUpdate }) {

  const [updatedRoutine, setUpdatedRoutine] = useState(selectedRoutine);


  useEffect(()=>{
    setUpdatedRoutine(selectedRoutine);
  }, [])

  useEffect(() => {
    setUpdatedRoutine(null);
}, [selectedUser]);


  useEffect(() => {
    setUpdatedRoutine(selectedRoutine);
  }, [selectedRoutine]);

  useEffect(() => {
    if (updatedRoutine) {
      onRoutineUpdate(updatedRoutine);
    }
  }, [updatedRoutine, onRoutineUpdate]);


  return (
    <div className='add_header2'>
      <div className='modify-header'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i></button>
        <h5 className='MainTitle'>Asignar valores a la rutina</h5>
      </div>

    </div>
  );
}
