import React, { FC } from "react";

interface OptionsProps {
  name: string;
  label?: string;
  value?: string;
  options: {
    value: string,
    text: string
  }[];
  disabled?: boolean;
  onChange?: (value:string) => void;
}

const Options:FC<OptionsProps> = ({ name, label, value, options, disabled, onChange }) => (
  <>
    {label && <label htmlFor={`select-${name}`}>{label}</label>}
    <select
      name={name}
      value={value}
      id={`select-${name}`}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map(option => 
        <option key={option.value} value={option.value}>{option.text}</option>
      )}
    </select>
  </>
);

export default Options;