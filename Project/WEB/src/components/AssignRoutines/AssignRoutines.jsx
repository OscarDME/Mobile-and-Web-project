import React, { useEffect, useState } from 'react'
import { AuthenticatedTemplate } from '@azure/msal-react';
import AssingRoutinesList from "./AssingRoutinesList";
import AssignRoutinesCalendar from "./AssignRoutinesCalendar";




export default function AssignRoutines({ selectedUser }) {
  const [updatedRoutine, setUpdatedRoutine] = useState(null);

  const handleRoutineUpdate = (routine) => {
    setUpdatedRoutine(routine);
    console.log(updatedRoutine);
  };

  return (
    <AuthenticatedTemplate>
      {selectedUser ? (
        <>
          <div className='container-diet'>
            <div className='list-container'>
              <AssingRoutinesList onRoutineUpdate={handleRoutineUpdate} />
            </div>
          </div>
          <div className='container-diet'>
            <AssignRoutinesCalendar selectedUser={selectedUser}/>
          </div>
        </>
      ) : (
        <div className='no-user-container'>
          <div>
            <h3>No hay usuario seleccionado</h3>
          </div>
        </div>
      )}
    </AuthenticatedTemplate>
  )
}
