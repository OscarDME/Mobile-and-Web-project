import React, { useState, useEffect } from "react";
import { ExerciseCard } from "../DATA_EXERCISES";
import SearchBar from "../SearchBar";
import "./styles/Management.css";
import Exercises_management_add from "./Exercises_management_add";
import Exercises_management_edit from "./Exercises_management_edit";
import config from "../../utils/conf";

export default function Exercises_management_list() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente
  const [exercises, setExercises] = useState([]);
  // Resto de tus estados...

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data);
        setExercises(data); // Asume que 'data' es un array de tus ejercicios
      } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (exercise) => {
    if (expandedRow === exercise.ID_Ejercicio) {
      // Asegúrate de usar exercise.ID_Ejercicio aquí
      setExpandedRow(null);
      setEditingExercise(null);
      setSelectedExercise(null); // Deselecciona la fila al hacer clic nuevamente
    } else {
      setEditingExercise(null);
      setExpandedRow(exercise.ID_Ejercicio); // Usa ID_Ejercicio para expandir la fila
      setSelectedExercise(exercise); // Selecciona la fila al hacer clic
    }
  };

  const handleEditClick = (e, exercise) => {
    e.stopPropagation(); // Detiene la propagación para evitar activar eventos onClick adicionales
    if (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
      setEditingExercise(null); // Oculta el formulario de edición si ya está visible
    } else {
      
      setExpandedRow(null); // Cierra cualquier fila expandida
      setSelectedExercise(null); // Deselecciona cualquier ejercicio seleccionado
      setEditingExercise(exercise); // Establece el ejercicio actual como el ejercicio a editar
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
      <ul className="cardcontainer">
        {filteredExercises.map((exercise) => (
          <li
            key={exercise.ID_Ejercicio}
            className={`row ${
              (selectedExercise &&
                selectedExercise.ID_Ejercicio === exercise.ID_Ejercicio) ||
              (editingExercise &&
                editingExercise.ID_Ejercicio === exercise.ID_Ejercicio)
                ? "selected"
                : ""
            }`}
          >
            <div
              onClick={() => handleRowClick(exercise)}
              className={`row_header ${
                (selectedExercise &&
                  selectedExercise.ID_Ejercicio === exercise.ID_Ejercicio) ||
                (editingExercise &&
                  editingExercise.ID_Ejercicio === exercise.ID_Ejercicio)
                  ? "selected"
                  : ""
              }`}
            >
              <div>
                <div className="row_name">{exercise.ejercicio}</div>
                <div className="row_description">{exercise.Musculo}</div>{" "}
                {/* Muestra el músculo principal */}
              </div>
              <div className="row_edit">
                <i
                  className="bi bi-pencil-square"
                  onClick={(e) => handleEditClick(e, exercise)} // Pasa el evento y el ejercicio a la función
                ></i>
              </div>
            </div>
            {expandedRow === exercise.ID_Ejercicio && (
              <>
                <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Dificultad: {exercise.Dificultad}
                    </div>
                    <div className="exercise-info-row">
                      Modalidad: {exercise.Modalidad}
                    </div>
                    <div className="exercise-info-row">
                      Tipo de Ejercicio: {exercise.Tipo_Ejercicio}
                    </div>
                    <div className="exercise-info-row">
                      Músculos Secundarios:{" "}
                      {exercise.musculosSecundarios
                        .map((musculo) => musculo.descripcion)
                        .join(", ")}
                    </div>
                  </div>
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Material: {exercise.Equipo}
                    </div>
                    <div className="exercise-info-row">
                      Posición inicial: {exercise.preparacion}
                    </div>
                    <div className="exercise-info-row">
                      Indicaciones: {exercise.ejecucion}
                    </div>
                    {/* Aquí puedes agregar más detalles si es necesario */}
                  </div>
                </div>
              </>
            )}
            {editingExercise &&
              editingExercise.ID_Ejercicio === exercise.ID_Ejercicio && (
                <>
                  <Exercises_management_edit
                    exercise={editingExercise}
                    onBackToList={handleBackToList}
                  />
                </>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
