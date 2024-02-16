import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';


export default function  RequestFoodsDelete({ food }) {
  
  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => setReason(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!food.name  || !food.calories || !food.category || !food.weight || !food.calories || !food.carbohydrates || !food.fats || !food.protein) { 
      alert('El alimento no cuenta con todos los campos necesarios para ser agregado a la base de datos.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    // TODO: refrescar la lista de comidas automaticamente
  };

  return (
    <div className='container-edit'>
      <form onSubmit={handleSubmit}>
        <div className='form_add'>
        <div className="exercise-info">
                   <div className="exercise-info-column">
                     <div className="exercise-info-row">Peso: {food.weight} gramos</div>
                     <div className="exercise-info-row">Calorias totales: {food.calories} kcal</div>
                   </div>
                   <div className="exercise-info-column">
                     <div className="exercise-info-row">Carbohidratos: {food.carbohydrates} kcal</div>
                     <div className="exercise-info-row">Proteína: {food.protein} kcal</div>
                     <div className="exercise-info-row">Grasa: {food.fats} kcal</div>
                   </div>
            </div>
        </div>
        <div className='button_container'>
        <div className='add_exercise_rows2'>
              Razón de rechazo:
              <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange} ></textarea>
            </div>
        <button className='delete_button'>Rechazar solicitud</button>
        </div>
      </form>
    </div>
  );
}