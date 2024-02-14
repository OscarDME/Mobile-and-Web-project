import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import NewExercises from '../components/Exercises/NewExercises';
import CurrrentExercises from '../components/Exercises/CurrentExercises';
import MenuButtons from '../components/MenuButtons';


export const Exercises = () => {
    const [activeComponent, setActiveComponent] = useState('Biblioteca de Ejercicios');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Crear Ejercicios':
            return <NewExercises />;
        case 'Biblioteca de Ejercicios':
        default:
          return <CurrrentExercises/>;
      }
    };
  
    const customMenuItems = ['Biblioteca de Ejercicios', 'Crear Ejercicios'];
  
    return (
      <>
        <AuthenticatedTemplate>
        <div className='Container'>
          <div className='buttoncontainer'>
            <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
          </div>
          <div className='workarea2'>
          {renderComponent()}
          </div>
        </div>
        </AuthenticatedTemplate>
      </>
    );
}