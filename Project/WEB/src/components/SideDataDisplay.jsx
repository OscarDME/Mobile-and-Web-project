import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserCard } from './UserCard';

export default function SideDataDisplay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Filtra la lista de usuarios basándote en el término de búsqueda
  const filteredUsers = UserCard.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    // Actualiza el estado para el usuario seleccionado
    setSelectedUser(user);
  };

  // Efecto para cargar la selección del usuario desde localStorage al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []); // Agrega un arreglo vacío para que este efecto se ejecute solo una vez al montar el componente

  // Efecto para guardar la selección del usuario en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
  }, [selectedUser]);

  return (
    <>
      <div className='sidedatadisplay'>
        <h2 className='MainTitle'>Mis clientes</h2>
        <button className='addclient'>Añadir cliente</button>
        <div>
          {/* Muestra la tarjeta del usuario seleccionado */}
          {selectedUser && (
            <div className={`selected-user-card`}>
              <h4>Cliente Seleccionado</h4>
              <div>{selectedUser.icon}</div>
              <div>
                <div>{selectedUser.username}</div>
                <div>{selectedUser.name}</div>
                <div>{selectedUser.email}</div>
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
              className={`row ${selectedUser && selectedUser.oid === user.oid ? 'selected' : ''}`}
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
