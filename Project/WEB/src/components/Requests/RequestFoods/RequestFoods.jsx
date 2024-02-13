  import React, { useState } from 'react';
  import { FoodCard } from "../../DATA_FOOD";
  import '../../../styles/Management.css';
  import RequestFoodsEdit from './RequestFoodsEdit';
  import RequestFoodsAdd from './RequestFoodsAdd';
  import RequestFoodsDelete from './RequestFoodsDelete';

  export default function RequestFoods() {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedFood, setSelectedFood] = useState(null);
      const [expandedRow, setExpandedRow] = useState(null);
      const [addingFood, setAddingFood] = useState(null);
      const [eliminatingFood, setEliminatingFood] = useState(null);
      const [editingFood, setEditingFood] = useState(null);
      const [showAddPage, setShowAddPage] = useState(false); 


      const filteredFoods = FoodCard.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const handleRowClick = (food) => {
        if (expandedRow === food.id) {
          setExpandedRow(null);
          setEditingFood(null);
          setAddingFood(null);
          setEliminatingFood(null);
          setSelectedFood(null); // Deselecciona la fila al hacer clic nuevamente
        } else {
          if (editingFood && editingFood.id === food.id) {
              setEditingFood(null); // Si el formulario de edición está abierto, ciérralo
              setAddingFood(null);
              setEliminatingFood(null);
          }
          setEditingFood(null);
          setAddingFood(null);
          setEliminatingFood(null);
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
            setAddingFood(null);
            setEditingFood(null);
            setEliminatingFood(null);
          }
          setExpandedRow(null);
          setSelectedFood(null);
          setEliminatingFood(null);
          setAddingFood(null);
          setEditingFood(food); // Muestra el formulario de edición para la comida seleccionado
        }
      };


      const handleAddClick = (food) => {
        if (addingFood && addingFood.id === food.id) {
          setAddingFood(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
        } else {
          if (expandedRow && expandedRow !== food.id) {
            setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
            setSelectedFood(null);
            setAddingFood(null);
            setEditingFood(null);
            setEliminatingFood(null);
          }
          setExpandedRow(null);
          setSelectedFood(null);
          setEditingFood(null);
          setEliminatingFood(null);
          setAddingFood(food); // Muestra el formulario de edición para la comida seleccionado
        }
      };


      const handleDeleteClick = (food) => {
        if (eliminatingFood && eliminatingFood.id === food.id) {
          setEliminatingFood(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
        } else {
          if (expandedRow && expandedRow !== food.id) {
            setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
            setSelectedFood(null);
            setAddingFood(null);
            setEditingFood(null);
            setEliminatingFood(null);
          }
          setExpandedRow(null);
          setSelectedFood(null);
          setAddingFood(null);
          setEditingFood(null);
          setEliminatingFood(food); // Muestra el formulario de edición para la comida seleccionado
        }
      };
      
      return (
        <div className="container2">
            <ul className='cardcontainer'>
              {filteredFoods.map((food) => (
                <li key={food.id} className={`row ${((selectedFood && selectedFood.id === food.id) || (editingFood && editingFood.id === food.id) || (addingFood && addingFood.id === food.id) || (eliminatingFood && eliminatingFood.id === food.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(food)} className={`row_header ${((selectedFood && selectedFood.id === food.id) || (editingFood && editingFood.id === food.id) || (addingFood && addingFood.id === food.id) || (eliminatingFood && eliminatingFood.id === food.id)) ? 'selected' : ''}`}>
                  <div>
                      <div className='row_name'>{food.name}</div>
                      <div className='row_description'>{food.category}</div>
                    </div>
                    <div className='row_buttons'>
                    <div className="row_edit">
                      <i className="bi bi-database-add" onClick={(e) => { e.stopPropagation(); handleAddClick(food); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-trash" onClick={(e) => { e.stopPropagation(); handleDeleteClick(food); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className="bi bi-pencil-square" onClick={(e) => { e.stopPropagation(); handleEditClick(food); }}></i>
                    </div>
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
                  {addingFood && addingFood.id === food.id && (
                    <>
                      <RequestFoodsAdd food={addingFood} />
                    </>
                  )}
                  {eliminatingFood && eliminatingFood.id === food.id && (
                    <>
                      <RequestFoodsDelete food={eliminatingFood} />
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
  