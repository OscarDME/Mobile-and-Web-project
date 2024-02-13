import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import CheckboxList from '../../CheckBox';
import { FoodCard } from "../../DATA_FOOD";


export default function RecipesEdit({recipe}) {
  const [name, setRecipeName] = useState(recipe.name || '');
  const [preparation, setRecipePreparation] = useState(recipe.preparation || '');
  const [link, setRecipeLink] = useState(recipe.link || '');
  const [ingredients, setRecipeIngredients] = useState(recipe.ingredients || []);

  const foodOptions = FoodCard.map(food => food.name); 

useEffect(() => {
  if (recipe) {
    setRecipeName(recipe.name || '');
    setRecipePreparation(recipe.preparation || '');
    setRecipeIngredients(recipe.ingredients || []);
    setRecipeLink(recipe.link || '');
  }
}, [recipe]);

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
};

return (
  <div className='container-edit'>
    <form className='form_add_exercise' onSubmit={handleSubmit}>
      <div className='add_exercise_area'>
        <div>
          <div className='add_exercise_rows'>
            ¿Cuál es el nombre de la receta? 
            <input type="text" className='add_exercise_input' value={name} onChange={handleRecipeNameChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Cuál es la preparación del ejercicio? 
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
      <button type="submit" className='add_button'>Guardar</button>
    </form>
  </div>
);
}