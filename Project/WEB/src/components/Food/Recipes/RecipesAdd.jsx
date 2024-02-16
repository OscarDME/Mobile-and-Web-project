import React, { useState} from 'react';
import '../../../styles/Management.css';
import { FoodCard } from "../../DATA_FOOD";
import CheckboxList from '../../CheckBox';

export default function RecipesAdd({ onBackToList }) {

  const [name, setRecipeName] = useState('');
  const [preparation, setRecipePreparation] = useState('');
  const [link, setRecipeLink] = useState('');
  const [ingredients, setRecipeIngredients] = useState([]);

  const foodOptions = FoodCard.map(food => food.name); 


  const handleRecipeNameChange = (event) => setRecipeName(event.target.value);

  const handleRecipePreparationChange= (event) => setRecipePreparation(event.target.value);
  
  const handleRecipeLinkChange = (event) => setRecipeLink(event.target.value);
  
  const handleRecipeIngredientChange = (selectedOptions) => setRecipeIngredients(selectedOptions);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name  || ingredients.length === 0 || !preparation) { 
      alert('Por favor completa todos los campos.');
      return;
    }
  
    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    //Mandar a la lista de ejercicios después de guardar uno
    onBackToList();
  };

  return (
<div className='container2'>
      <div className='add_header2'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Solicitar una receta nueva</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
        <div>
          <div className='add_exercise_rows'>
            ¿Cuál es el nombre de la receta? 
            <input type="text" className='add_exercise_input' value={name} onChange={handleRecipeNameChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Cuál es la preparación de la receta? 
            <textarea className='add_exercise_textarea' value={preparation} onChange={handleRecipePreparationChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Tiene algún link de preparación? 
            <input type="text" className='add_exercise_input' value={link} onChange={handleRecipeLinkChange}  />
          </div>
        </div>
        <div>
          <div className='add_exercise_rows'>
            ¿Qué alimentos necesita la receta?
            <CheckboxList options={foodOptions} selectedOptions={ingredients} onChange={handleRecipeIngredientChange}  idPrefix="food"/>
          </div>
        </div>
      </div>
        <button className='add_button'>Solicitar receta</button>
      </form>
    </div>
  )
}





