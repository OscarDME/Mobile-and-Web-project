import React, { useState, useEffect } from 'react';
import './styles/Management.css';
import Dropdown from '../DropDown';
import CheckboxList from '../CheckBox';


export default function Exercises_management_edit({ exercise }) {

    const [exerciseName, setExerciseName] = useState(exercise.name || '');
    const [affectedInjury, setAffectedInjury] = useState(exercise.injury || '');
    const [selectedMuscles, setSelectedMuscles] = useState(exercise.muscles || []);
    const [exerciseType, setExerciseType] = useState(exercise.type || '');
    const [materialNeeded, setMaterialNeeded] = useState(exercise.material || []);
    const [exercisePreparation, setExercisePreparation] = useState(exercise.preparation || '');
    const [exerciseIndications, setExerciseIndications] = useState(exercise.indications || '');
    const [exerciseDificulty, setExerciseDificulty] = useState(exercise.dificulty || '');  

    const lesiones = ["Hombro", "Cadera", "Tobillo", "Espalda"];
    const options = ["Baja", "Media", "Alta"];
    const exercises = ["Cardiovascular", "Peso corporal", "Pesas"];
    const materials = ["Mancuerna", "Barra"];
    const muscles = ["Cuadricep", "Tricep", "Bicep","Pantorilla", "Femoral", "Gluteo"];

    
  useEffect(() => {
    if (exercise) {
      setExerciseName(exercise.name || '');
      setAffectedInjury(exercise.injury || '');
      setSelectedMuscles(exercise.muscles || []);
      setExerciseType(exercise.type || '');
      setMaterialNeeded(exercise.material || []);
      setExercisePreparation(exercise.preparation || '');
      setExerciseIndications(exercise.indications || '');
      setExerciseDificulty(exercise.difficulty || '');
    }
  }, [exercise]);


  const handleExerciseNameChange = (event) => setExerciseName(event.target.value);

  const handleAffectedInjuryChange = (event) => setAffectedInjury(event.target.value);

  const handleAffectedDificultyChange = (event) => setExerciseDificulty(event.target.value);

  const handleExerciseTypeChange = (event) => {
    setMaterialNeeded([]);
    setExerciseType(event.target.value);
  };

  const handleExerciseIndicationsChange = (event) => setExerciseIndications(event.target.value);

  const handleExercisePreparationChange = (event) => setExercisePreparation(event.target.value);

  const handleSelectedMusclesChange = (selectedOptions) => setSelectedMuscles(selectedOptions);

  const handleMaterialNeededChange = (selectedOptions) => setMaterialNeeded(selectedOptions);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!exerciseName  || selectedMuscles.length === 0 || !exerciseType || !exercisePreparation || !exerciseIndications || !exerciseDificulty) { 
      alert('Por favor completa todos los campos.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    //Mandar a la lista de ejercicios después de guardar uno, TODO: refrescar la lista de ejercicios automaticamente
  };

  return (
    <div className='container-edit'>
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
              ¿Qué tipo de ejercicio es? <Dropdown options={exercises} selectedOption={exerciseType} onChange={handleExerciseTypeChange}  />
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
            {exerciseType === 'Pesas' && (
              <div className='add_exercise_rows'>
                ¿Qué material necesita el ejercicio?
                <CheckboxList options={materials} selectedOptions={materialNeeded} onChange={handleMaterialNeededChange}  idPrefix="material"/>
              </div>
            )}
          </div>
        </div>
        <button type="submit" className='add_button'>Guardar</button>
      </form>
    </div>
  );
}
