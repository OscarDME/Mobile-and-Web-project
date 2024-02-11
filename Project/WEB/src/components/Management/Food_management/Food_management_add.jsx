import React, { useState} from 'react';
import '../../../styles/Management.css';
import NumberInput from '../../NumberInput';
import Dropdown from '../../DropDown';

export default function Food_management_add({ onBackToList }) {

    const [FoodName, setFoodName] = useState('');
    const [calories, setFoodCalories] = useState('');
    const [weight, setFoodWeight] = useState('');
    const [category, setFoodCategory] = useState('');
    const [carbohydrates, setFoodCarbohydrates] = useState('');
    const [fats, setFoodFats] = useState('');
    const [protein, setFoodProtein] = useState('');

    const categoria = ["Fruta", "Grano", "Lácteo", "Proteina"];


  const handleFoodNameChange = (event) => setFoodName(event.target.value);

  const handleFoodCategoryChange = (event) => setFoodCategory(event.target.value);


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!FoodName  || !calories || !category || !weight || !calories || !carbohydrates || !fats || !protein) { 
      alert('Por favor completa todos los campos.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    // TODO: refrescar la lista de comidas automaticamente
    onBackToList();
  };

  return (
<div className='container'>
      <div className='add_header'>
        <button className="back_icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Añadir un alimento nuevo</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
          <div>
            <div className='add_exercise_rows'>
              ¿Cuál es el nombre del alimento? 
              <input type="text" className='add_exercise_input' value={FoodName} onChange={handleFoodNameChange}  />
            </div>
            <div className='add_exercise_rows'>
              ¿Cómo se clasifica? <Dropdown options={categoria} selectedOption={category} onChange={handleFoodCategoryChange}  />
            </div>
            <div className='add_exercise_rows'>
            ¿Cuánto pesa? {"(en gramos)"}
            <NumberInput
                placeholder="…"
                value={Number(weight)}
                min={0}
                max={5000}
                onChange={(event, weight) => setFoodWeight(weight)}
                />
            </div>
            <div className='add_exercise_rows'>
              ¿Cúantas calorías tiene el alimento?
              <NumberInput
                placeholder="…"
                value={Number(calories)}
                min={0}
                max={5000}
                onChange={(event, calories) => setFoodCalories(calories)}
                />
            </div>
          </div>
          <div>
            <div className='add_exercise_rows'>
            ¿Cúantas calorías tiene el alimento de carbohidratos?
                <NumberInput
                placeholder="…"
                value={Number(carbohydrates)}
                min={0}
                max={5000}
                onChange={(event, carbohydrates) => setFoodCarbohydrates(carbohydrates)}
                />
            </div>
            <div className='add_exercise_rows'>
            ¿Cúantas calorías tiene el alimento de proteínas? 
            <NumberInput
                placeholder="…"
                value={Number(protein)}
                min={0}
                max={5000}
                onChange={(event, protein) => setFoodProtein(protein)}
                />
            </div>
              <div className='add_exercise_rows'>
              ¿Cúantas calorías tiene el alimento de grasas? 
              <NumberInput
                placeholder="…"
                value={Number(fats)}
                min={0}
                max={5000}
                onChange={(event, fats) => setFoodFats(fats)}
                />
              </div>
          </div>
        </div>
        <button className='add_button'>Agregar alimento</button>
      </form>
    </div>
  )
}


