import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';


export default function  RequestRecipesDelete({ recipe }) {

  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => setReason(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!reason) { 
      alert('Especifique una razón de rechazo');
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
                        <div className="exercise-info-row">Calorías totales: {recipe.carbohydrates} kcal</div>
                        <div className="exercise-info-row">Carbohidratos: {recipe.carbohydrates} kcal</div>
                        <div className="exercise-info-row">Proteína: {recipe.protein} kcal</div>
                        <div className="exercise-info-row">Grasa: {recipe.fats} kcal</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Ingredientes: {recipe.ingredients.join(" - ")}</div>
                        <div className="exercise-info-row">Preparación: {recipe.preparation}</div>
                        <div className="exercise-info-row">Link de preparación: {recipe.link}</div>
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