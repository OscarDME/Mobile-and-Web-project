import React, { useState, useEffect } from 'react';
import '../styles/SideDataDisplay.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserCard } from './DATA_USER_CARD';
import SearchBar from './SearchBar';

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
        <div>
          {/* Muestra la tarjeta del usuario seleccionado */}
          {selectedUser && (
            <>
            <div className='separator'>
            <h4>Cliente Seleccionado</h4>
            <div className={`selected-user-card`}>
              <div className='icon'>{selectedUser.icon}</div>
              <div>
                <div className='username'>{selectedUser.username}</div>
                <div className='name'>{selectedUser.name}</div>
                <div className='email'>{selectedUser.email}</div>
              </div>
              </div>
            </div>
            </>
          )}
        </div>
        {/* Agrega la barra de búsqueda y conecta su valor al estado */}
        <div className='search-bar'>
        <div className='addclient'><i class="bi bi-search h4"></i></div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div>
          Mostrando {filteredUsers.length} clientes
        </div>
        {/* Muestra la lista filtrada de usuarios */}
        <ul className='SideUsersList'>
          {filteredUsers.map((user, key) => (
            <li
              key={key}
              className={`card ${selectedUser && selectedUser.oid === user.oid ? 'selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
            { user.gender === "Mujer" && (
              <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
            )}
            {user.gender === "Hombre" &&(
              <div  className='icon'><i class="bi bi-person-standing"></i></div>
            )}
              <div>
                <div className='username'>{user.username}</div>
                <div className='name'>{user.name}</div>
                <div className='email'>{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
