import React, {useEffect, useState} from 'react'
import { InputNumber } from 'primereact/inputnumber';
import config from "../../utils/conf";
        
export default function Progress_Body_MeasuresAdd({onBackToList, selectedUser}) {
  const [weight, setWeight] = useState(null);
  const [fat, setFat] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [muscleMass, setMuscleMass] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [neckCircumference, setNeckCircumference] = useState(null);
  const [hipCircumference, setHipCircumference] = useState(null);
  const [waistCircumference, setWaistCircumference] = useState(null);
  const [chestCircumference, setChestCircumference] = useState(null);
  const [bicepsCircumference, setBicepsCircumference] = useState(null);
  const [shoulderCircumference, setShoulderCircumference] = useState(null);
  const [forearmsCircumference, setForearmsCircumference] = useState(null);
  const [CuadricepsiCircumference, setCuadricepsCircumference] = useState(null);
  const [calfCircumference, setCalfCircumference] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada
  
    // Verificar que ningún campo se encuentre vacío
    const allMeasures = [
      weight, fat, pulse, muscleMass, bloodPressure,
      neckCircumference, hipCircumference, waistCircumference,
      chestCircumference, bicepsCircumference, shoulderCircumference,
      forearmsCircumference, CuadricepsiCircumference, calfCircumference
    ];
  
    if (allMeasures.some(measure => measure === null)) {
      alert("Todos los campos deben ser completados.");
      return;
    }
  
    // Validaciones específicas
    if (weight >= 300) {
      alert("El peso debe ser menor a 300 kg.");
      return;
    }
  
    if (fat < 0 || fat > 100) {
      alert("El porcentaje de grasa debe estar entre 0% y 100%");
      return;
    }
  
    if (muscleMass < 0 || muscleMass > 100) {
      alert("La masa muscular neta debe estar entre 0 y 100.");
      return;
    }
  
    if (pulse < 0 || pulse > 300) {
      alert("El ritmo cardíaco en reposo debe estar entre 0 bpm y 300 bpm");
      return;
    }
  
    if (bloodPressure < 0 || bloodPressure > 300) {
      alert("La presión arterial debe estar entre 0 y 300.");
      return;
    }
  
    const bodyMeasures = [
      neckCircumference, hipCircumference, waistCircumference,
      chestCircumference, bicepsCircumference, shoulderCircumference,
      forearmsCircumference, CuadricepsiCircumference, calfCircumference
    ];
  
    if (bodyMeasures.some(measure => measure < 0 || measure > 200)) {
      alert("Todas las medidas corporales deben estar entre 0 y 200 cm.");
      return;
    }

    const bodyMeasurementsData = {
      porcentaje_grasa: fat,
      masa_muscular: muscleMass,
      presion_arterial: bloodPressure,
      ritmo_cardiaco: pulse,
      cuello: neckCircumference,
      pecho: chestCircumference,
      hombro: shoulderCircumference,
      bicep: bicepsCircumference,
      antebrazo: forearmsCircumference,
      cintura: waistCircumference,
      cadera: hipCircumference,
      pantorrilla: calfCircumference,
      muslo: CuadricepsiCircumference,
      fecha: new Date().toISOString().slice(0, 10),
      ID_UsuarioMovil: selectedUser.ID_Usuario,
    };

      console.log(bodyMeasurementsData);
      try {
        const response = await fetch(`${config.apiBaseUrl}/createMilestone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyMeasurementsData),
        });
  
        if (!response.ok) {
          throw new Error("Algo salió mal al guardar el Hito.");
        }
  
        // Respuesta del servidor
        const result = await response.json();
        console.log(result);
        alert("Hito añadido con éxito.");

        onBackToList(); 
      } catch (error) {
        console.error("Error al guardar el Hito:", error);
        alert("Error al guardar el Hito.");
      }
  }
  

  return (
    <div className='container3 MainContainer'>
      <div className='add_header2'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Agregar un hito de progreso</h1>
      </div>
      <form className="form_add_exercise" onSubmit={handleSubmit}>
        <div className="add_exercise_area">
          <div>
            <div className="add_exercise_rows">
              Peso
              <InputNumber value={weight} onValueChange={(e) => setWeight(e.target.value)} maxFractionDigits={2} max={300} min={1} suffix='kg' />
            </div>
            <div className="add_exercise_rows">
              % de grasa
              <InputNumber value={fat} onValueChange={(e) => setFat(e.target.value)} maxFractionDigits={2} max={100} min={1} suffix='%' />
            </div>
            <div className="add_exercise_rows">
              Ritmo cardiaco en reposo
              <InputNumber value={pulse} onValueChange={(e) => setPulse(e.target.value)} max={300} min={1} suffix='bpm' />
            </div>
            <div className="add_exercise_rows">
              Presión arterial
              <InputNumber value={bloodPressure} onValueChange={(e) => setBloodPressure(e.target.value)} max={300} min={1} suffix='mm Hg' />
            </div>
            <div className="add_exercise_rows">
              Masa muscular neta
              <InputNumber value={muscleMass} onValueChange={(e) => setMuscleMass(e.target.value)} maxFractionDigits={2} max={100} min={1} suffix='kg' />
            </div>
          </div>
          <div>
            <div className="add_exercise_rows">
              Cuello
              <InputNumber value={neckCircumference} onValueChange={(e) => setNeckCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Pecho
              <InputNumber value={chestCircumference} onValueChange={(e) => setChestCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Cintura
              <InputNumber value={waistCircumference} onValueChange={(e) => setWaistCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Cadera
              <InputNumber value={hipCircumference} onValueChange={(e) => setHipCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Hombros
              <InputNumber value={shoulderCircumference} onValueChange={(e) => setShoulderCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
          </div>
          <div>
            <div className="add_exercise_rows">
              Bicep
              <InputNumber value={bicepsCircumference} onValueChange={(e) => setBicepsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Antebrazo
              <InputNumber value={forearmsCircumference} onValueChange={(e) => setForearmsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Muslos
              <InputNumber value={CuadricepsiCircumference} onValueChange={(e) => setCuadricepsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Pantorrilla
              <InputNumber value={calfCircumference} onValueChange={(e) => setCalfCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
          </div>
        </div>
        <button type="submit" className="add_button">
          Guardar hito
        </button>
      </form>
    </div>
  )
}
