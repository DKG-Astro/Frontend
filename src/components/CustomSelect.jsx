import { Form, Select } from 'antd'
import React from 'react'

const CustomSelect = ({name, label, required, options, disabled, onChange, multiselect, className}) => {

    const handleChange = (value) => {
        if (onChange) {
            onChange(name, value)
        }
    }
  return (
    <Form.Item name={name} label={label} required={required} className={className}>
      <Select options={options} onChange={handleChange} disabled={disabled} mode={multiselect ? 'multiple' : 'default'} />
    </Form.Item>
  )
}

export default CustomSelect
