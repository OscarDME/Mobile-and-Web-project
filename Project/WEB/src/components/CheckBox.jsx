import React from 'react';

function CheckboxList({ options, selectedOptions, onChange, idPrefix }) {
  
  const handleCheckboxChange = (event) => {
    const optionName = event.target.name;
    const isChecked = event.target.checked;

    // Si el checkbox está marcado, agregar la opción seleccionada al array
    // Si no, eliminarla del array
    const updatedSelectedOptions = isChecked 
      ? [...selectedOptions, optionName] 
      : selectedOptions.filter(option => option !== optionName);

    // Llamar a la función onChange con el nuevo array de elementos seleccionados
    onChange(updatedSelectedOptions);
  };

  return (
    <div style={{ borderRadius: "10px", maxHeight: '150px', overflowY: 'scroll', border: '1px solid #CCCCCC', padding: '10px' }}>
      {options.map((option, index) => (
        <div key={index} style={{ padding: "5px" }} className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="form-check-input"
            id={`${idPrefix}-${index}`} 
            name={option}
            checked={selectedOptions.includes(option)}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor={`${idPrefix}-${index}`}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}

export default CheckboxList;
