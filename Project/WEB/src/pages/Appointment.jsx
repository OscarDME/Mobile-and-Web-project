import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import NewAppointments from '../components/Appointments/NewAppointment';
import CurrentAppointments from '../components/Appointments/CurrentAppointments';
import MenuButtons from '../components/MenuButtons';


export const Appointment = () => {
    const [activeComponent, setActiveComponent] = useState('Citas Actuales');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Crear Cita':
            return <NewAppointments />;
        case 'Citas Actuales':
        default:
          return <CurrentAppointments/>;
      }
    };
  
    const customMenuItems = ['Citas Actuales', 'Crear Cita'];
  
    return (
      <>
        <AuthenticatedTemplate>
        <div className='Container'>
          <div className='buttoncontainer'>
            <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
          </div>
          {renderComponent()}
        </div>
        </AuthenticatedTemplate>
      </>
    );
}