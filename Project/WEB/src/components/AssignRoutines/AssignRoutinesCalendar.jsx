import React , {useState}from 'react'
import { useMsal } from "@azure/msal-react";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { RoutineCard } from '../DATA_NEW_ROUTINES';

const USED_DAYS = [new Date(2024, 1, 5), new Date(2024, 1, 15)];// Año, mes (0-indexado), día

export default function AssignRoutinesCalendar({client, selectedUser,updatedRoutine}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [routines, setRoutines] = useState(RoutineCard);
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
      //TODO: guardar en base de datos aqui
      //Hacer validacion de los datos

    }

  return (
    <>
    <h2 className='MainTitle'>Rutinas activas de {selectedUser.username}</h2>
    <div className='active-diet-container'>
    {RoutineCard.map((routine, index)  => (  
        <>
        <div key={index} className='active-diet-card'>
            <h4>{routine.name}</h4>
            <div>
            <p>Fecha de inicio: </p>
            <p>Fecha de finalización: </p>
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
      <button className='add_button add-btn2' type='submit'>Asignar Rutina</button>
      </div>
    </form>
    </>
  )
}




        