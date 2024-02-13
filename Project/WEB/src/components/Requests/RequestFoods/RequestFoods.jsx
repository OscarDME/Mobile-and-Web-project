  import React, { useState } from 'react';
  import { FoodCard } from "../../DATA_FOOD";
  import '../../../styles/Management.css';
  import RequestFoodsEdit from './RequestFoodsEdit';
  
  
  export default function RequestFoods() {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedFood, setSelectedFood] = useState(null);
      const [expandedRow, setExpandedRow] = useState(null);
      const [editingFood, setEditingFood] = useState(null);
      const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
    
      const filteredFoods = FoodCard.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const handleRowClick = (food) => {
        if (expandedRow === food.id) {
          setExpandedRow(null);
          setEditingFood(null);
          setSelectedFood(null); // Deselecciona la fila al hacer clic nuevamente
        } else {
          if (editingFood && editingFood.id === food.id) {
              setEditingFood(null); // Si el formulario de edición está abierto, ciérralo
          }
          setEditingFood(null);
          setExpandedRow(food.id);
          setSelectedFood(food); // Selecciona la fila al hacer clic
        }
      };
      
      const handleEditClick = (food) => {
        if (editingFood && editingFood.id === food.id) {
          setEditingFood(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
        } else {
          if (expandedRow && expandedRow !== food.id) {
            setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
            setSelectedFood(null);
          }
          setExpandedRow(null);
          setSelectedFood(null);
          setEditingFood(food); // Muestra el formulario de edición para la comida seleccionado
        }
      };
  
      const handleAddClick = () => {
        setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
      };
  
      const handleBackToList = () => {
          setShowAddPage(false); // Volver a la lista de comidas
      };
      
      // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
      if (showAddPage) {
          
      }
      
      return (
        <div className="container2">
            <ul className='cardcontainer'>
              {filteredFoods.map((food) => (
                <li key={food.id} className={`row ${((selectedFood && selectedFood.id === food.id) || (editingFood && editingFood.id === food.id)) ? 'selected' : ''}`}>
                  <div onClick={() => handleRowClick(food)} className={`row_header ${((selectedFood && selectedFood.id === food.id) || (editingFood && editingFood.id === food.id)) ? 'selected' : ''}`}>
                    <div>
                      <div className='row_name'>{food.name}</div>
                      <div className='row_description'>{food.category}</div>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-pencil-square" onClick={(e) => { e.stopPropagation(); handleEditClick(food); }}></i>
                    </div>
                  </div>
                  {expandedRow === food.id && (
                    <>
                      <div className="exercise-info">
                        <div className="exercise-info-column">
                          <div className="exercise-info-row">Peso: {food.weight} gramos</div>
                          <div className="exercise-info-row">Calorias totales: {food.calories} kcal</div>
                        </div>
                        <div className="exercise-info-column">
                          <div className="exercise-info-row">Carbohidratos: {food.carbohydrates} kcal</div>
                          <div className="exercise-info-row">Proteína: {food.protein} kcal</div>
                          <div className="exercise-info-row">Grasa: {food.fats} kcal</div>
                        </div>
                      </div>
                    </>
                  )}
                  {editingFood && editingFood.id === food.id && (
                    <>
                      <RequestFoodsEdit food={editingFood} />
                    </>
                  )}
                </li>
              ))}
            </ul>
        </div>
      );
  }
  