import React, { useState } from 'react'
import AssignDietsCreate from './AssignDietsCreate'

export default function AssignDiets({ selectedUser }) {
  const [createdDiet, setCreatedDiet] = useState(null);

  const handleDietCreation = (diet) => {
    setCreatedDiet(diet);
    console.log(createdDiet);
  };

  return (
    <>
      {selectedUser ? (
        <>
          <div className='container'>
            <div className='list-container'>
              <h2 className='MainTitle'>Crear dieta</h2>
              <AssignDietsCreate client={selectedUser} onDietCreate={handleDietCreation} />
            </div>
          </div>
          <div className='container'>
            <h2 className='MainTitle'>Dietas activas de {selectedUser.username}</h2>
            {/* Aquí puedes mostrar la dieta creada si lo deseas */}
            {createdDiet && <pre>{JSON.stringify(createdDiet, null, 2)}</pre>}
          </div>
        </>
      ) : (
        <div className='no-user-container'>
          <div>
            <h3>No hay usuario seleccionado</h3>
          </div>
        </div>
      )}
    </>
  )
}
