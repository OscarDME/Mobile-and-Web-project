import React , {useState}from 'react'
import { DATA_DIET } from '../DATA_DIET'
import { useMsal } from "@azure/msal-react";



export default function AssignDietsCalendar({client, createdDiet}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [dietPlan, setDietPlan] = useState(DATA_DIET)   

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
    <div className='calendar-container'>
        {activeAccount.idTokenClaims.oid}
        
        
    </div>
    </>
  )
}
