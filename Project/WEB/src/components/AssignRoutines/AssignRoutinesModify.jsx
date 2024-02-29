import React from 'react'

export default function AssignRoutinesModify({ onBackToList }) {

    const handleSubmit = (e) => {  
        
        onBackToList();
    };
  return (
    <div className='add_header2'>
    <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
    <h5 className='mtitle'>Asignar valores a la rutina</h5>
    </div>
  )
}
