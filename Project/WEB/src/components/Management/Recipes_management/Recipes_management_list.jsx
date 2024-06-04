import React, { useState, useEffect } from "react";
import { RecipeCard } from "../../DATA_RECIPES";
import SearchBar from "../../SearchBar";
import SelectFilter from "../../SelectFilter";
import "../../../styles/Management.css";
import Recipes_management_add from "./Recipes_management_add";
import Recipes_management_edit from "./Recipes_management_edit";
import config from "../../../utils/conf";

export default function Recipes_management_list() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]); // Nuevo estado para las recetas
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
  const [proteinFilter, setProteinFilter] = useState(null);
  const [carbFilter, setCarbFilter] = useState(null);
  const [fatFilter, setFatFilter] = useState(null);

  const proteinOptions = [
    { value: "high", label: "Alto en proteínas" },
    { value: "medium", label: "Medio en proteínas" },
    { value: "low", label: "Bajo en proteínas" },
  ];
  
  const carbOptions = [
    { value: "high", label: "Alto en carbohidratos" },
    { value: "medium", label: "Medio en carbohidratos" },
    { value: "low", label: "Bajo en carbohidratos" },
  ];
  
  const fatOptions = [
    { value: "high", label: "Alto en grasas" },
    { value: "medium", label: "Medio en grasas" },
    { value: "low", label: "Bajo en grasas" },
  ];

  const loadRecipes = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/recetas`); // Ajusta la URL según tu configuración de backend
      const data = await response.json();
      setRecipes(data); // Actualizar el estado con las recetas obtenidas
      console.log(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []); // Cargar recetas al montar el componente

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.receta.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (proteinFilter
        ? recipe.clasificaciones.includes(
            proteinFilter === "high"
              ? "Alto en proteinas"
              : proteinFilter === "medium"
              ? "Medio en proteinas"
              : "Bajo en proteinas"
          )
        : true) &&
      (carbFilter
        ? recipe.clasificaciones.includes(
            carbFilter === "high"
              ? "Alto en carbohidratos"
              : carbFilter === "medium"
              ? "Medio en carbohidratos"
              : "Bajo en carbohidratos"
          )
        : true) &&
      (fatFilter
        ? recipe.clasificaciones.includes(
            fatFilter === "high"
              ? "Alto en grasas"
              : fatFilter === "medium"
              ? "Medio en grasas"
              : "Bajo en grasas"
          )
        : true)
  );

  const handleRowClick = (recipe) => {
    if (expandedRow === recipe.ID_Receta) {
      setExpandedRow(null);
      setEditingRecipe(null);
      setSelectedRecipe(null); // Deselecciona la fila al hacer clic nuevamente
    } else {
      if (editingRecipe && editingRecipe.ID_Receta === editingRecipe.ID_Receta) {
        setEditingRecipe(null); // Si el formulario de edición está abierto, ciérralo
      }
      setEditingRecipe(null);
      setExpandedRow(recipe.ID_Receta);
      setSelectedRecipe(recipe); // Selecciona la fila al hacer clic
    }
  };

  const handleEditClick = (recipe) => {
    if (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta) {
      setEditingRecipe(null); // Si la receta está seleccionada, oculta el formulario de edición
    } else {
      if (expandedRow && expandedRow !== recipe.ID_Receta) {
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
        <div className="search-bar">
          <div className="addclient">
            <i className="bi bi-search h4"></i>
          </div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div>
          <a className="iconadd" role="button" onClick={handleAddClick}>
            <i className="bi bi-plus-circle-fill"></i>
          </a>
        </div>
      </div>
      <div className="filters-container">
  <div className="filter-row">
    Filtrar por proteínas:
    <SelectFilter
      value={proteinFilter}
      onChange={(value) => setProteinFilter(value)}
      options={proteinOptions}
      defaultOption="Todas las proteínas"
    />
  </div>
  <div className="filter-row">
    Filtrar por carbohidratos:
    <SelectFilter
      value={carbFilter}
      onChange={(value) => setCarbFilter(value)}
      options={carbOptions}
      defaultOption="Todos los carbohidratos"
    />
  </div>
  <div className="filter-row">
    Filtrar por grasas:
    <SelectFilter
      value={fatFilter}
      onChange={(value) => setFatFilter(value)}
      options={fatOptions}
      defaultOption="Todas las grasas"
    />
  </div>
</div>
      <ul className="cardcontainer">
        {filteredRecipes.map((recipe) => (
          <li
            key={recipe.ID_Receta}
            className={`row ${
              (selectedRecipe && selectedRecipe.ID_Receta === recipe.ID_Receta) ||
              (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta)
                ? "selected"
                : ""
            }`}
          >
            <div
              onClick={() => handleRowClick(recipe)}
              className={`row_header ${
                (selectedRecipe && selectedRecipe.ID_Receta === recipe.ID_Receta) ||
                (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta)
                  ? "selected"
                  : ""
              }`}
            >
              <div>
                <div className="row_name">{recipe.receta}</div>
                {recipe.clasificaciones.map((clasificacion, index) => (
                  <span key={index}>
                    {clasificacion}
                    {index < recipe.clasificaciones.length - 1 ? ", " : ""}
                  </span>
                ))}{" "}
              </div>
              <div className="row_edit">
                <i
                  className="bi bi-pencil-square"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(recipe);
                  }}
                ></i>
              </div>
            </div>
            {expandedRow === recipe.ID_Receta && (
              <>
                <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Calorías totales: {recipe.calorias} kcal
                    </div>
                    {recipe.macronutrientes.map((macro) => (
                      <div
                        key={macro.ID_Macronutriente}
                        className="exercise-info-row"
                      >
                        {macro.ID_Macronutriente === 1 &&
                          `Grasas: ${macro.cantidad}g`}
                        {macro.ID_Macronutriente === 2 &&
                          `Carbohidratos: ${macro.cantidad}g`}
                        {macro.ID_Macronutriente === 3 &&
                          `Proteínas: ${macro.cantidad}g`}
                      </div>
                    ))}
                  </div>
                  <div className="exercise-info-column">
                    Ingredientes:{" "}
                    {recipe.ingredientes.map((ing, index) => (
                      <span key={index}>
                        {`${ing.nombre} (${ing.porcion}g)`}
                        {index < recipe.ingredientes.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    <div className="exercise-info-row">
                      Preparación: {recipe.preparacion}
                    </div>
                    <div className="exercise-info-row">
                      Link de preparación: {recipe.link}
                    </div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-pencil-square card-icon ${editingRecipe && editingRecipe.id === recipe.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleEditClick(recipe); }}></i>
                    </div>

                </div>
              </>
            )}
            {editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta && (
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
