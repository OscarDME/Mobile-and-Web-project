import React, { useState } from 'react';
import { RecipeCard } from "../../DATA_RECIPES";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import Recipes_management_add from './Recipes_management_add';
import Recipes_management_edit from './Recipes_management_edit';


export default function Recipes_management_list() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
  
    const filteredRecipes = RecipeCard.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (recipe) => {
      if (expandedRow === recipe.id) {
        setExpandedRow(null);
        setEditingRecipe(null);
        setSelectedRecipe(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingRecipe && editingRecipe.id === editingRecipe.id) {
            setEditingRecipe(null); // Si el formulario de edición está abierto, ciérralo
        }
        setEditingRecipe(null);
        setExpandedRow(recipe.id);
        setSelectedRecipe(recipe); // Selecciona la fila al hacer clic
      }
    };
    
    const handleEditClick = (recipe) => {
      if (editingRecipe && editingRecipe.id === recipe.id) {
        setEditingRecipe(null); // Si la receta está seleccionada, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== recipe.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedRecipe(null);
        }
        setExpandedRow(null);
        setSelectedRecipe(null);
        setEditingRecipe(recipe); // Muestra el formulario de edición para el recetas seleccionado
      }
    };

    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de recetas
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar receta
    if (showAddPage) {
        return <Recipes_management_add onBackToList={handleBackToList} />;
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
            {filteredRecipes.map((recipe) => (
              <li key={recipe.id} className={`row ${((selectedRecipe && selectedRecipe.id === recipe.id) || (editingRecipe && editingRecipe.id === recipe.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(recipe)} className={`row_header ${((selectedRecipe && selectedRecipe.id === recipe.id) || (editingRecipe && editingRecipe.id === recipe.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{recipe.name}</div>
                    <div className='row_description'>{recipe.clasification.join(" - ")}</div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-pencil-square card-icon ${editingRecipe && editingRecipe.id === recipe.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleEditClick(recipe); }}></i>
                    </div>
                </div>
                {expandedRow === recipe.id && (
                  <>
                  <div className="exercise-info">
                    <div className="exercise-info-column">
                        <div className="exercise-info-row">Calorías totales: {recipe.carbohydrates} kcal</div>
                        <div className="exercise-info-row">Carbohidratos: {recipe.carbohydrates} kcal</div>
                        <div className="exercise-info-row">Proteína: {recipe.protein} kcal</div>
                        <div className="exercise-info-row">Grasa: {recipe.fats} kcal</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Ingredientes: {recipe.ingredients.join(" - ")}</div>
                        <div className="exercise-info-row">Preparación: {recipe.preparation}</div>
                        <div className="exercise-info-row">Link de preparación: {recipe.link}</div>
                      </div>
                    </div>
                  </>
                )}
                {editingRecipe && editingRecipe.id === recipe.id && (
                  <>
                    <Recipes_management_edit recipe={editingRecipe} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
