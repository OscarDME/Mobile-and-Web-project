import React , {useState}from 'react'
import { DATA_DIET } from '../DATA_DIET'
import { useMsal } from "@azure/msal-react";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";

const USED_DAYS = [new Date(2024, 1, 5), new Date(2024, 1, 15)];// Año, mes (0-indexado), día

export default function AssignDietsCalendar({client, createdDiet}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [dietPlan, setDietPlan] = useState(DATA_DIET);
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);
    const [date, setDate] = useState(null);

    addLocale('es', {
      firstDayOfWeek: 1,
      showMonthAfterYear: true,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar'
  });

  const isDayUsed = (dateObj) => {
    // Debes convertir el objeto de fecha de PrimeReact a un objeto Date de JavaScript
    const dateToCheck = new Date(dateObj.year, dateObj.month, dateObj.day);
  
    return USED_DAYS.some(usedDate =>
      dateToCheck.getDate() === usedDate.getDate() &&
      dateToCheck.getMonth() === usedDate.getMonth() &&
      dateToCheck.getFullYear() === usedDate.getFullYear()
    );
  };
  
  // Ajusta la función alreadyUsedDays para utilizar la nueva isDayUsed
  const alreadyUsedDays = (dateObj) => {
    if (isDayUsed(dateObj)) {
      return (
        <strong style={{ textDecoration: 'line-through', color: 'red' }}>{dateObj.day}</strong>
      );
    }
    return dateObj.day;
  };


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
    Elegir fechas de asignación:
    <div className="card flex justify-content-center">
            <Calendar className='p-calendar' value={date} onChange={(e) => setDate(e.value)}  dateTemplate={alreadyUsedDays}  locale="es" minDate={minDate} dateFormat="dd/mm/yy" inline  selectionMode="range"/>
        </div>
      <div>
      </div>
      <button className='add_button add-btn2' type='submit'>Asignar Dieta</button>
      </div>
    </form>
    </>
  )
}




        