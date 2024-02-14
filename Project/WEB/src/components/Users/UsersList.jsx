import React, { useState } from 'react';
import { UserCard } from "../../DATA_USER_CARD";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import Exercises_management_add from './Exercises_management_add';
import Exercises_management_edit from './Exercises_management_edit';


export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
  
    const filteredExercises = UserCard.filter(user =>
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
    
    const handleEditClick = (user) => {
      if (editingUser && editingUser.id === user.id) {
        setEditingUser(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== user.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setEditingUser(user); // Muestra el formulario de edición para el ejercicio seleccionado
      }
    };

    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de ejercicios
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
    if (showAddPage) {
        return <Exercises_management_add onBackToList={handleBackToList} />;
    }
    
    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
              <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredExercises.map((user) => (
              <li key={user.id} className={`row ${((selectedUser && selectedUser.id === exercise.id) || (editingUser && editingUser.id === exercise.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.id === exercise.id) || (editingUser && editingUser.id === exercise.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{user.name}</div>
                    <div className='row_description'>{user.muscles.join(" - ")}</div>
                  </div>
                  <div className="row_edit">
                    <i className="bi bi-pencil-square" onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                  </div>
                </div>
                {expandedRow === exercise.id && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Dificultad: {user.difficulty}</div>
                        <div className="exercise-info-row">Indicaciones: {user.indications}</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Material: {user.material.join(" - ")}</div>
                        <div className="exercise-info-row">Posición inicial: {user.preparation}</div>
                      </div>
                    </div>
                  </>
                )}
                {editingUser && editingUser.id === user.id && (
                  <>
                    <Exercises_management_edit user={editingUser} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}