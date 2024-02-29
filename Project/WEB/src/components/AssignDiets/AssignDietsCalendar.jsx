import React , {useState}from 'react'
import { DATA_DIET } from '../DATA_DIET'
import { useMsal } from "@azure/msal-react";
import NumberInput from '../NumberInput';
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-indigo/theme.css";



export default function AssignDietsCalendar({client, createdDiet}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [dietPlan, setDietPlan] = useState(DATA_DIET);
    const [weekToAsssign, setWeekToAsssign] = useState(0);
    const [date, setDate] = useState(null);


    const handleSubmit = async (event) => {

      event.preventDefault(); 

  // Verifica si createdDiet existe
  if (!createdDiet) {
    alert("No se ha creado ninguna dieta.");
    return;
  }

  // Verifica si el nombre de la dieta está presente
  if (!createdDiet.name || createdDiet.name.trim() === "") {
    alert("Por favor, especifica un nombre para la dieta.");
    return;
  }

  // Verifica si hay al menos una comida por día
  const hasMealEachDay = createdDiet.days.every(day => day.meals.length > 0);
  if (!hasMealEachDay) {
    alert("Asegúrate de que cada día tenga al menos una comida.");
    return;
  }

  // Verifica si cada comida tiene nombre
  const everyMealHasName = createdDiet.days.every(day => day.meals.every(meal => meal.mealName && meal.mealName.trim() !== ""));
  if (!everyMealHasName) {
    alert("Asegúrate de que cada comida tenga un nombre.");
    return;
  }

  // Verifica si cada comida tiene al menos un alimento
  const everyMealHasFood = createdDiet.days.every(day => day.meals.every(meal => meal.foods.length > 0));
  if (!everyMealHasFood) {
    alert("Asegúrate de que cada comida tenga al menos un alimento.");
    return;
  }

  // Verifica si cada alimento tiene nombre y porción válidos
  const everyFoodHasValidNameAndPortion = createdDiet.days.every(day => 
    day.meals.every(meal => 
      meal.foods.every(food => 
        food.name && food.name.trim() !== "" && food.portion && food.portion > 0
      )
    )
  );
  if (!everyFoodHasValidNameAndPortion) {
    alert("Asegúrate de que cada alimento tenga un nombre y una porción válidos.");
    return;
  }

  // Verifica si tiene algún nutricionista o cliente asignado
  if (!createdDiet.clientId || createdDiet.clientId.trim() === "" || !createdDiet.nutricionistID || createdDiet.nutricionistID.trim() === "") {
    alert("Algo ocurrió. No se pudo obtener los datos del cliente a asignar la dieta o del nutricionista que la creó. Inténtalo de nuevo.");
    return;
  }


      //TODO: guardar en base de datos aqui
      //Hacer validacion de los datos
    }

  return (
    <>
    <h2 className='MainTitle'>Dietas activas de {client.username}</h2>
    <div className='active-diet-container'>
    {dietPlan.map((diet, index)  => (  
        <>
        <div key={index} className='active-diet-card'>
            <h4>{diet.name}</h4>
            <div>
            <p>Fecha de inicio: {diet.startDate}</p>
            <p>Fecha de finalización: {diet.endDate}</p>
            </div>
        </div>
        </>
        ))}
    </div>
    <form className='calendar-container' onSubmit={handleSubmit}>
    <div className='calendar-ind-container'>
    ¿Por cuántas semanas quieres asignar la dieta?
    <NumberInput
      placeholder="…"
      value={weekToAsssign}
      min={0}
      max={100}
      onChange={(e,newPortion) => {
      const newValue = e.target.value;
      setWeekToAsssign(newValue)}}/>
    </div>
    Elegir fechas de asignación:
    <div className="card flex justify-content-center">
            <Calendar className='p-calendar' value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" touchUI selectionMode="range"/>
        </div>
      <div>
      <button className='add_button' type='submit'>Asignar Dieta</button>
      </div>
    </form>
    </>
  )
}




        