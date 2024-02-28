import React, { useState, useEffect } from 'react';
import { FoodCard } from '../DATA_FOOD';
import { RecipeCard } from '../DATA_RECIPES';
import Dropdown from '../DropDown';
import NumberInput from '../NumberInput';
import { useMsal } from "@azure/msal-react";
import { ToolTipInfo } from '../ToolTipInfo';

export default function AssignDietsCreate( {client, onDietCreate} ) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

    const food = FoodCard.map(f => f.name);
    const recipes = RecipeCard.map(r => r.name);
    const foodOptions = [...food, ...recipes];
    foodOptions.sort()

    useEffect(() => {

      if (activeAccount && activeAccount.idTokenClaims.oid) {
          setDietPlan(prevState => ({
              ...prevState,
              nutritionistId: activeAccount.idTokenClaims.oid ? activeAccount.idTokenClaims.oid : null, 
          }));
      }
  }, []);

    const [dietPlan, setDietPlan] = useState({
        nutritionistId: "", //ID del entrenador
        clientId: null, // Se inicializa sin un ID específico
        name: null,
        totalKcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        startDate: null,
        endDate: null,
        days: [
          { day: "Lunes", meals: [] },
          { day: "Martes", meals: [] },
          { day: "Miércoles", meals: [] },
          { day: "Jueves", meals: [] },
          { day: "Viernes", meals: [] },
          { day: "Sábado", meals: [] },
          { day: "Domingo", meals: [] },
        ],
      });
    
      // Actualiza dietPlan cuando cambia el cliente seleccionado
      useEffect(() => {
        setDietPlan(prevState => ({
          ...prevState,
          clientId: client.id, // Actualiza el clientId con el nuevo cliente seleccionado
          // Reinicia otros valores si es necesario
          name: null,
          totalKcal: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          startDate: null,
          endDate: null,
          days: prevState.days.map(day => ({ ...day, meals: [] })) // Reinicia las comidas para cada día
        }));
      }, [client]);


  const addMeal = (dayOfWeek, mealName) => {

    const updatedDietPlan = { ...dietPlan };
    
    const dayIndex = updatedDietPlan.days.findIndex(day => day.day === dayOfWeek);
    

    if (dayIndex > -1) {
      const newMeal = { mealName, foods: [] }; 
      
      updatedDietPlan.days[dayIndex].meals.push(newMeal);
      
      setDietPlan(updatedDietPlan);
    }
  };

  const removeMeal = (dayOfWeek, mealIndex) => {
    const updatedDietPlan = { ...dietPlan };
  
    const dayIndex = updatedDietPlan.days.findIndex(day => day.day === dayOfWeek);
  

    if (dayIndex > -1 && mealIndex >= 0 && mealIndex < updatedDietPlan.days[dayIndex].meals.length) {
      updatedDietPlan.days[dayIndex].meals.splice(mealIndex, 1);
      setDietPlan(updatedDietPlan);
    }
  };
  
  const handleMealNameChange = (dayOfWeek, mealIndex, newName) => {
    const updatedDietPlan = { ...dietPlan };
  
    const dayIndex = updatedDietPlan.days.findIndex(day => day.day === dayOfWeek);
    if (dayIndex > -1 && mealIndex >= 0 && mealIndex < updatedDietPlan.days[dayIndex].meals.length) {
      updatedDietPlan.days[dayIndex].meals[mealIndex].mealName = newName;

      setDietPlan(updatedDietPlan);
    }
  };
  

  const handleDietNameChange = (event) => {

    setDietPlan({
      ...dietPlan, 
      name: event.target.value 
    });
  };
  

  
  
  
  const handleFoodChange = (dayIndex, mealIndex, foodIndex, field, newValue) => {
    const newDietPlan = { ...dietPlan };
    newDietPlan.days = newDietPlan.days.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          meals: day.meals.map((meal, mIndex) => {
            if (mIndex === mealIndex) {
              return {
                ...meal,
                foods: meal.foods.map((food, fIndex) => {
                  if (fIndex === foodIndex) {
                    return { ...food, [field]: newValue };
                  }
                  return food;
                }),
              };
            }
            return meal;
          }),
        };
      }
      return day;
    });
    setDietPlan(newDietPlan);
  };
  

  const addFoodToMeal = (dayOfWeek, mealIndex, food) => {
    const updatedDietPlan = { ...dietPlan };
    const dayIndex = updatedDietPlan.days.findIndex(day => day.day === dayOfWeek);
  
    if (dayIndex > -1 && mealIndex >= 0 && mealIndex < updatedDietPlan.days[dayIndex].meals.length) {
      const foodWithDefaultName = { ...food, name: food.name || null };
      updatedDietPlan.days[dayIndex].meals[mealIndex].foods.push(foodWithDefaultName);
      setDietPlan(updatedDietPlan);
    }
  };
  

  const removeFoodFromMeal = (dayOfWeek, mealIndex, foodIndex) => {
    const updatedDietPlan = { ...dietPlan };
    const dayIndex = updatedDietPlan.days.findIndex(day => day.day === dayOfWeek);
    if (dayIndex > -1 && mealIndex >= 0 && foodIndex >= 0 && foodIndex < updatedDietPlan.days[dayIndex].meals[mealIndex].foods.length) {
      updatedDietPlan.days[dayIndex].meals[mealIndex].foods.splice(foodIndex, 1);
      setDietPlan(updatedDietPlan);
    }
  };

  
  useEffect(() => {
    onDietCreate(dietPlan);
  }, [dietPlan, onDietCreate]); 

  return (
    <div className='cardcontainer-diet'>
    <div className='center-form'>
    Nombre de la dieta:
    <input type='text' className='add_exercise_input' value={dietPlan.name} onChange={handleDietNameChange}></input>
    </div>
      {dietPlan.days.map((day, index) => (
        <div key={index} className='day-container-diet'>
          <div className='day-title'>{day.day}</div>
          <div className='routine-area-add'>
          <button className='btn-add-exercise' onClick={() => addMeal(day.day,null)}> <i className="bi bi-plus-circle add-routine-icon"></i> Añadir Comida</button>
          </div>
          {day.meals.map((meal, mealIndex) => (
            <>
            <div key={mealIndex} className={`diet-meal-header ${mealIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
            <input
                type="text"
                className='add_exercise_input'
                value={meal.mealName}
                onChange={(e) => handleMealNameChange(day.day, mealIndex, e.target.value)}
                placeholder="Alumerzo, comida, cena, etc."
                />
                <div className="row_buttons">
                    <button onClick={() => addFoodToMeal(day.day, mealIndex, { name: null , portion: null})} className='btn-add-meal'><i className="bi bi-plus-circle recipe-icon"></i> Alimento</button>
                    <button onClick={() => removeMeal(day.day, mealIndex)} className='btn-remove-meal'><i className="bi bi-trash recipe-icon"></i> Comida</button>
                    </div>
                </div>

                {meal.foods.map((food, foodIndex) => (
                <div key={foodIndex} className={`meal-food-container ${mealIndex % 2 === 0 ? 'day-even' : 'day-odd'}`}>
                  <Dropdown 
                      options={foodOptions}
                      selectedOption={food.name}
                      onChange={(e) => handleFoodChange(index, mealIndex, foodIndex, 'name', e.target.value)}
                    />
                    <div className='align-center'>
                    <div>
                    Porción <ToolTipInfo message={"Indique la cantidad de la porción, por ejemplo, para un vaso de leche, especifique en mililitros; para carne, indique el peso en gramos; para una pieza de fruta, mencione la unidad o cantidad específica, y así para otros alimentos."}><i class="bi bi-info-circle-fill info-icon"/></ToolTipInfo>
                    </div>
                    <NumberInput
                    placeholder="…"
                    value={Number(food.portion)}
                    min={0}
                    max={500}
                    step={0.25}
                    onChange={(e,newPortion) => {
                      const newValue = e.target.value;
                      handleFoodChange(index, mealIndex, foodIndex, 'portion', Number(newPortion))}
                    }

                    />
                    </div>
                    <i className={`bi bi-trash meal-icon`} onClick={() => removeFoodFromMeal(day.day, mealIndex, foodIndex)}></i>
                </div>
              ))}
              </>
            ))}
        </div>
      ))}
    </div>
  );
}
