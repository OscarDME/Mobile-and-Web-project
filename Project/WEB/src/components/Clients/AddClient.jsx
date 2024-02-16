import React, {useState } from 'react';
import { UserCard } from "../DATA_USER_CARD";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';

export default function AddClient() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [addClient, setAddClient] = useState(null);
    
    const filteredUsers = UserCard.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (user) => {
      if (expandedRow === user.id) {
        setExpandedRow(null);
        setAddClient(null);
        setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (addClient && addClient.id === user.id) {
          setAddClient(null);
        }
        setAddClient(null);
        setExpandedRow(user.id);
        setSelectedUser(user); // Selecciona la fila al hacer clic
      }
    };


    const handleAddClick = (user) => {
      if (addClient && addClient.id === user.id) {
        setAddClient(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== user.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
          setAddClient(null);
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setAddClient(user); 
      }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
  
      
      //TODO: Eliminar cliente
      //Mandar a la lista de ejercicios después de guardar uno, TODO: refrescar la lista de ejercicios automaticamente
    };

    return (
      <div className="container2">
          <div className="search-bar-container2">
            <div className='search-bar'>
            <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredUsers.map((user) => (
              <li key={user.id} className={`row ${((selectedUser && selectedUser.id === user.id) || (addClient && addClient.id === user.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.id === user.id) || (addClient && addClient.id === user.id)) ? 'selected' : ''}`}>
                  <div className='UserCard'>
                  { user.gender === "Mujer" && (
                    <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
                  )}
                  {user.gender === "Hombre" &&(
                    <div  className='icon'><i class="bi bi-person-standing"></i></div>
                  )}
                  <div>
                    <div className='row_name'>{user.name}</div>
                    <div className='row_description'>{user.role.join(" - ")}</div>
                  </div>
                  </div>
                  <div className="row_edit">
                      <i className="bi bi-plus-circle-fill" onClick={(e) => { e.stopPropagation(); handleAddClick(user); }}></i>
                    </div>
                </div>
                {expandedRow === user.id && (
                <>
                    <>
                    <div className="exercise-info">
                      chat
                    </div>
                    </>
                </>
                )}
                {addClient && addClient.id === user.id && (
                  <>
                  <div className="exercise-info">
                  <form className='form_add_exercise' onSubmit={handleSubmit}>
                    <button type="submit" className='add_button'>Mandar solicitud a {user.name}</button>
                  </form>
                  </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}

