import React, {useEffect, useState} from 'react'
import { InputNumber } from 'primereact/inputnumber';
        
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

    onBackToList();
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
              <InputNumber value={weight} onValueChange={(e) => setWeight(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='kg' />
            </div>
            <div className="add_exercise_rows">
              % de grasa
              <InputNumber value={fat} onValueChange={(e) => setFat(e.target.value)} maxFractionDigits={2} max={100} min={1} suffix='%' />
            </div>
            <div className="add_exercise_rows">
              Ritmo cardiaco en reposo
              <InputNumber value={pulse} onValueChange={(e) => setPulse(e.target.value)} max={500} min={1} suffix='bpm' />
            </div>
            <div className="add_exercise_rows">
              Presión arterial
              <InputNumber value={bloodPressure} onValueChange={(e) => setBloodPressure(e.target.value)} max={500} min={1} suffix='mm Hg' />
            </div>
            <div className="add_exercise_rows">
              Masa muscular neta
              <InputNumber value={muscleMass} onValueChange={(e) => setMuscleMass(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='kg' />
            </div>
          </div>
          <div>
            <div className="add_exercise_rows">
              Cuello
              <InputNumber value={neckCircumference} onValueChange={(e) => setNeckCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Pecho
              <InputNumber value={chestCircumference} onValueChange={(e) => setChestCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Cintura
              <InputNumber value={waistCircumference} onValueChange={(e) => setWaistCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Cadera
              <InputNumber value={hipCircumference} onValueChange={(e) => setHipCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Hombros
              <InputNumber value={shoulderCircumference} onValueChange={(e) => setShoulderCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
          </div>
          <div>
            <div className="add_exercise_rows">
              Bicep
              <InputNumber value={bicepsCircumference} onValueChange={(e) => setBicepsCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Antebrazo
              <InputNumber value={forearmsCircumference} onValueChange={(e) => setForearmsCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Muslos
              <InputNumber value={CuadricepsiCircumference} onValueChange={(e) => setCuadricepsCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Pantorrilla
              <InputNumber value={calfCircumference} onValueChange={(e) => setCalfCircumference(e.target.value)} maxFractionDigits={2} max={500} min={1} suffix='cm' />
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
