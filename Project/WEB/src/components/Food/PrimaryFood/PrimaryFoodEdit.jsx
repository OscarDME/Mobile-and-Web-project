import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import NumberInput from '../../NumberInput';
import Dropdown from '../../DropDown';

export default function  PrimaryFoodEdit({ food }) {

    const [FoodName, setFoodName] = useState(food.name || '');
    const [calories, setFoodCalories] = useState(food.calories || '');
    const [weight, setFoodWeight] = useState(food.weight || '');
    const [category, setFoodCategory] = useState(food.category || '');
    const [carbohydrates, setFoodCarbohydrates] = useState(food.carbohydrates || '');
    const [fats, setFoodFats] = useState(food.fats || '');
    const [protein, setFoodProtein] = useState(food.protein || '');

    const categoria = ["Fruta", "Grano", "Lácteo", "Proteina"];

    
  useEffect(() => {
    if (food) {
        setFoodName(food.name || '');
        setFoodCalories(food.calories || '');
        setFoodWeight(food.weight || '');
        setFoodCategory(food.category || '');
        setFoodCarbohydrates(food.carbohydrates || '');
        setFoodFats(food.fats || '');
        setFoodProtein(food.protein || '');
    }
  }, [food]);


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
  };

  return (
    <div className='container-edit'>
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
        <button className='add_button'>Guardar</button>
      </form>
    </div>
  );
}