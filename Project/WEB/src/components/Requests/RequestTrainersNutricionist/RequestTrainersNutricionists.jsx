import React, { useState } from 'react';
import { UserCard } from '../../DATA_USER_CARD';
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import RequestTrainersNutricionistAdd from './RequestTrainersNutricionistAdd';  
import RequestTrainersNutricionistDelete from './RequestTrainersNutricionistDelete';

export default function RequestTrainersNutricionists() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [addingUser, setAddingUser] = useState(null);
    const [eliminatingUser, setEliminatingUser] = useState(null);

    const filteredUser = UserCard.filter(User =>
      User.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (User) => {
      if (expandedRow === User.id) {
        setExpandedRow(null);
        setAddingUser(null);
        setEliminatingUser(null);
        setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (addingUser && addingUser.id === User.id) {
          setAddingUser(null);
          setEliminatingUser(null);
        }
        setAddingUser(null);
        setEliminatingUser(null);
        setExpandedRow(User.id);
        setSelectedUser(User); // Selecciona la fila al hacer clic
      }
    };

    const handleAddClick = (User) => {
      if (addingUser && addingUser.id === User.id) {
        setAddingUser(null); // Si el mismo ejercicio está seleccionado, oculta el formulario
      } else {
        if (expandedRow && expandedRow !== User.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
          setEliminatingUser(null);
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setEliminatingUser(null);
        setAddingUser(User); // Muestra el formulario de edición para el ejercicio seleccionado
      }
    };

    const handleDeleteClick = (User) => {
      if (eliminatingUser && eliminatingUser.id === User.id) {
        setEliminatingUser(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== User.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
          setAddingUser(null)
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setAddingUser(null);
        setEliminatingUser(User); 
      }
    };
    
    return (
      <div className="container2">
          <ul className='cardcontainer'>
            {filteredUser.map((user) => (
              <li key={user.id} className={`row ${((selectedUser && selectedUser.id === user.id) || (addingUser && addingUser.id === user.id) || (eliminatingUser && eliminatingUser.id === user.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.id === user.id) || (addingUser && addingUser.id === user.id) || (eliminatingUser && eliminatingUser.id === user.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{user.name}</div>
                    <div className='row_description'>{user.role.join(" - ")}</div>
                  </div>
                  <div className='row_buttons'>
                    <div className="row_edit">
                      <i className="bi bi-database-add" onClick={(e) => { e.stopPropagation(); handleAddClick(user); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-trash" onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}></i>
                    </div>
                    </div>
                </div>
                {expandedRow === user.id && (
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
                {addingUser && addingUser.id === user.id &&(
                  <RequestTrainersNutricionistAdd user={addingUser}/>
                )}
                {eliminatingUser && eliminatingUser.id === user.id &&(
                  <RequestTrainersNutricionistDelete user={eliminatingUser}/>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}