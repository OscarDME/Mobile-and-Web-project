import React from 'react';
import '../../../styles/Management.css';

export default function RequestTrainersNutricionistAdd({ user }) {


  const handleSubmit = (event) => {
    event.preventDefault();
    //TODO: Validate trainers/nutricionist info before adding it to the database
    if (!user.name  || user.role.length === 0 || !user.email) { 
      alert('El ejercicio no cuenta con los campos necesarios.');
      return;
    }

    
    //TODO: GUARDAR EN BACK END DATOS AQUI
    //Mandar a la lista de ejercicios después de guardar uno, TODO: refrescar la lista de ejercicios automaticamente
  };

  return (
    <div className='container-edit'>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
                    <div className="exercise-info">
                    <div className="exercise-info-column">
                        <div className="exercise-info-row">{}</div>{/*Foto de perfil*/}
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Email: {user.email}</div>
                        <div className="exercise-info-row">Nacimiento: {user.birthday.toLocaleDateString()}</div>
                        <div className="exercise-info-row">Certificado: {}</div>
                        <div className="exercise-info-row">Experiencia: {}</div>
                      </div>
                    </div>
                    </div>
        <button type="submit" className='add_button'>Aceptar nuevo {user.role.join(" - ")}</button>
      </form>
    </div>
  );
}
