import React, { useState, useEffect } from 'react';
import '../styles/SideDataDisplay.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserCard } from './DATA_USER_CARD';

export default function SideDataDisplay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // Filtra la lista de rutinas basándote en el término de búsqueda
  const filteredUsers = UserCard.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (routine) => {
    // Actualiza el estado para el usuario seleccionado
    setSelectedRoutine(routine);
  };

  // Efecto para cargar la selección del usuario desde localStorage al cargar la página
  useEffect(() => {
    const storedRoutine = localStorage.getItem('selectedUser');
    if (storedRoutine) {
        setSelectedRoutine(JSON.parse(storedRoutine));
    }
  }, []); // Agrega un arreglo vacío para que este efecto se ejecute solo una vez al montar el componente

  // Efecto para guardar la selección del usuario en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('selectedUser', JSON.stringify(selectedRoutine));
  }, [selectedRoutine]);

  return (
    <>
      <div className='sidedatadisplay'>
        <h2 className='MainTitle'>Mis rutinas</h2>
        <button className='addclient'>Añadir rutina</button>
        <div>
          {/* Muestra la tarjeta del usuario seleccionado */}
          {selectedRoutine && (
            <div className={`selected-user-card`}>
              <h4>Rutina Seleccionada</h4>
              <div>{selectedRoutine.icon}</div>
              <div>
                <div>{selectedRoutine.username}</div>
                <div>{selectedRoutine.name}</div>
                <div>{selectedRoutine.email}</div>
              </div>
            </div>
          )}
        </div>
        {/* Agrega la barra de búsqueda y conecta su valor al estado */}
        <input
          type='text'
          placeholder='Buscar cliente...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div>
          Mostrando {filteredUsers.length} clientes
        </div>
        {/* Muestra la lista filtrada de usuarios */}
        <ul className='SideUsersList'>
          {filteredUsers.map((user, key) => (
            <li
              key={key}
              className={`row ${selectedRoutine && selectedRoutine.oid === user.oid ? 'selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <div>{user.icon}</div>
              <div>
                <div>{user.username}</div>
                <div>{user.name}</div>
                <div>{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
