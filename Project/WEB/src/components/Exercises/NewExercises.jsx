import React, { useState } from 'react';
import '../../styles/Management.css';
import Dropdown from '../DropDown';
import CheckboxList from '../CheckBox';

export default function NewExercises({ onBackToList }) {
  const [exerciseName, setExerciseName] = useState('');
  const [affectedInjury, setAffectedInjury] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [exerciseType, setExerciseType] = useState('');
  const [materialNeeded, setMaterialNeeded] = useState([]);
  const [exercisePreparation, setExercisePreparation] = useState('');
  const [exerciseIndications, setExerciseIndications] = useState('');
  const [exerciseDificulty, setExerciseDificulty] = useState('');

  const lesiones = ["Hombro", "Cadera", "Tobillo", "Espalda"];
  const options = ["Baja", "Media", "Alta"];
  const exercises = ["Cardiovascular", "Peso corporal", "Pesas"];
  const materials = ["Mancuerna", "Barra"];
  const muscles = ["Cuadricep", "Tricep", "Bicep","Pantorilla", "Femoral", "Gluteo"];

  const handleExerciseNameChange = (event) => setExerciseName(event.target.value);

  const handleAffectedInjuryChange = (event) => setAffectedInjury(event.target.value);

  const handleAffectedDificultyChange = (event) => setExerciseDificulty(event.target.value);

  const handleExerciseTypeChange = (event) => {
    setMaterialNeeded([]);
    setExerciseType(event.target.value);
  };

  const handleExerciseIndicationsChange = (event) => setExerciseIndications(event.target.value);

  const handleExercisePreparationChange = (event) => setExercisePreparation(event.target.value);

  const handleSelectedMusclesChange = (selectedOptions) => {
    console.log(selectedOptions);
    setSelectedMuscles(selectedOptions)};

  const handleMaterialNeededChange = (selectedOptions) => setMaterialNeeded(selectedOptions);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!exerciseName  || selectedMuscles.length === 0 || !exerciseType || !exercisePreparation || !exerciseIndications || !exerciseDificulty) { 
      alert('Por favor completa todos los campos.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    //Mandar a la lista de ejercicios después de guardar uno, TODO: refrescar la lista de ejercicios automaticamente
    onBackToList();
  };

  return (
    <div className='container'>
      <div className='add_header'>
        <button className="back_icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Añadir un ejercicio nuevo</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
          <div>
            <div className='add_exercise_rows'>
              ¿Cuál es el nombre del ejercicio? 
              <input type="text" className='add_exercise_input' value={exerciseName} onChange={handleExerciseNameChange}  />
            </div>
            <div className='add_exercise_rows'>
              ¿Afecta a alguna lesión? <Dropdown options={lesiones} selectedOption={affectedInjury} onChange={handleAffectedInjuryChange}  />
            </div>
            <div className='add_exercise_rows'>
              ¿Cuál es la dificultad del ejercicio? <Dropdown options={options} selectedOption={exerciseDificulty} onChange={handleAffectedDificultyChange}  />
            </div>
            <div className='add_exercise_rows'>
              Indicaciones de preparación:
              <textarea className='add_exercise_textarea' value={exercisePreparation} onChange={handleExercisePreparationChange} ></textarea>
            </div>
          </div>
          <div>
            <div className='add_exercise_rows'>
              ¿Qué músculos trabaja el ejercicio?
              <CheckboxList options={muscles} selectedOptions={selectedMuscles} onChange={handleSelectedMusclesChange}  idPrefix="muscles"/>
            </div>
            <div className='add_exercise_rows'>
              Indicaciones de ejecución:
              <textarea className='add_exercise_textarea' value={exerciseIndications} onChange={handleExerciseIndicationsChange}></textarea>
            </div>
          </div>
          <div>
            <div className='add_exercise_rows'>
              ¿Qué tipo de ejercicio es? <Dropdown options={exercises} selectedOption={exerciseType} onChange={handleExerciseTypeChange}  />
            </div>
            {exerciseType === 'Pesas' && (
              <div className='add_exercise_rows'>
                ¿Qué material necesita el ejercicio?
                <CheckboxList options={materials} selectedOptions={materialNeeded} onChange={handleMaterialNeededChange}  idPrefix="material"/>
              </div>
            )}
          </div>
        </div>
        <button type="submit" className='add_button'>Solicitar ejercicio</button>
      </form>
    </div>
  );
}
