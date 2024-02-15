import React, { useReducer, useState } from 'react';
import { UserCard } from "../DATA_USER_CARD";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';

export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    
    const filteredUsers = UserCard.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (user) => {
      if (expandedRow === user.id) {
        setExpandedRow(null);
        setEditingUser(null);
        setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingUser && editingUser.id === user.id) {
          setEditingUser(null); // Si el formulario de edición está abierto, ciérralo
        }
        setEditingUser(null);
        setExpandedRow(user.id);
        setSelectedUser(user); // Selecciona la fila al hacer clic
      }
    };

    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
            <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredUsers.map((user) => (
              <li key={user.id} className={`row ${((selectedUser && selectedUser.id === user.id) || (editingUser && editingUser.id === user.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.id === user.id) || (editingUser && editingUser.id === user.id)) ? 'selected' : ''}`}>
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
                </div>
                {expandedRow === user.id && (
                <>
                  {user.role.includes("Cliente") && (
                    <>
                    <div key="role" className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Género: {user.gender}</div>

                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Estatura: {user.height} cm</div>
                        <div className="exercise-info-row">Peso: {user.weight} kg</div>
                      </div>
                    </div>
                    </>
                  )}
                  {user.role.includes("Normal") && (
                    <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Género: {user.gender}</div>

                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Estatura: {user.height} cm</div>
                        <div className="exercise-info-row">Peso: {user.weight} kg</div>
                      </div>
                    </div>
                    </>
                  )}
                  {user.role.includes("Administrador") && (
                    <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Género: {user.gender}</div>

                      </div>
                    </div>
                    </>
                  )}
                  {(user.role.includes("Nutricionista") || user.role.includes("Entrenador")) && (
                    <>
                    <div className="exercise-info">
                    <div className="exercise-info-column">
                        <div className="exercise-info-row">{}</div>{/*Foto de perfil*/}
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Certificado: {}</div>
                        <div className="exercise-info-row">Experiencia: {}</div>
                      </div>
                    </div>
                    </>
                  )}
                  {user.role.includes("Nutricionista") && (
                    <>
                    </>
                  )}
                </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}