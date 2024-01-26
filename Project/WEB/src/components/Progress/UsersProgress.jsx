import React, { useState } from 'react';
//import '.../styles/WhiteBoard.css';
//import '.../styles/UsersProgress.css';
//import '.../styles/MenuButtons.css';
import Progress_Excercises from './Progress_Excercises';
import Progress_Body_Measures from './Progress_Body_Measures';
import Progress_General from './Progress_General';
import MenuButtons from '../MenuButtons';

export default function UsersProgress() {
  const [activeComponent, setActiveComponent] = useState('General');

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Ejercicios':
        return <Progress_Excercises />;
      case 'Medidas Corporales':
        return <Progress_Body_Measures />;
      case 'General':
      default:
        return <Progress_General />;
    }
  };

  const customMenuItems = ['General', 'Medidas Corporales', 'Ejercicios'];

  return (
    <>
      <div className='Container'>
        <div className='buttoncontainer'>
          <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
        </div>
        {renderComponent()}
      </div>
    </>
  );
}
