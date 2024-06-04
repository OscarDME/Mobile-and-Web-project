import React from 'react';

const SelectFilter = ({ value, onChange, options, defaultOption }) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value === "" ? null : e.target.value;
    onChange(selectedValue);
  };

  return (
    <select onChange={handleChange} value={value ?? ""} className='dropdown'>
      <option value="">{defaultOption}</option>
      {options.map(option => (
        <option key={option.value} value={option.value ?? ""}>{option.label}</option>
      ))}
    </select>
  );
};

export default SelectFilter;
