import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';


export default function  RequestRecipesAdd({ recipe }) {


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!recipe.name || recipe.ingredients.length === 0 || !recipe.preparation) { 
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
        <button className='add_button'>Guardar en la base de datos</button>
        </div>
      </form>
    </div>
  );
}