import React from 'react';
import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

const CustomDatePicker = ({ label, name, disabled, onChange, defaultValue, required, className }) => {
  // Convert string date to dayjs object if it exists
  const dateValue = defaultValue ? 
    (dayjs.isDayjs(defaultValue) ? defaultValue : dayjs(defaultValue)) : 
    null;
  
  const handleDateChange = (date) => {
    // Convert dayjs to ISO string for consistent storage
    const dateString = date ? date.format('DD/MM/YYYY') : null;
    onChange(name, dateString);
  };

  return (
    <Form.Item
    required={required}
      label={label}
      name={name}
      className={`mb-4 ${className}`}
      rules={[{ required: required, message: `Please select ${label}` }]}
    >
      <DatePicker 
        className="w-full" 
        disabled={disabled}
        onChange={handleDateChange}
        value={dateValue}
        format="DD/MM/YYYY"
      />
    </Form.Item>
  );
};

export default CustomDatePicker;