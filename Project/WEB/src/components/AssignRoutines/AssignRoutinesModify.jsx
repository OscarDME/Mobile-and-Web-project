import React from 'react'

export default function AssignRoutinesModify({ onBackToList, selectedRoutine }) {


  return (
    <div className='add_header2'>
    <div  className='modify-header'>
    <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
    <h5 className='MainTitle'>Asignar valores a la rutina</h5>
    </div>

    </div>
  )
}
