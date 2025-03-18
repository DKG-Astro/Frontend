import { Form } from "antd";
import Input from "antd/es/input/Input";
import React from "react";
import CustomInput from "./CustomInput";

const { Search } = Input;
const CustomSearch = ({
  label,
  name,
  onChange,
  onSearch,
  required,
  readOnly
}) => {
  return (
    <>
    {
      readOnly ? (
        <CustomInput name={name} readOnly label={label} />
      )
      :
      <Form.Item
        label={label}
        name={name}
        rules={[
          { required: required ? true : false, message: "Please input value!" },
        ]}
      >
        <Search
          onSearch={onSearch}
          onChange={(e) => onChange(name, e.target.value)}
          enterButton
        />
      </Form.Item>
      
    }
    </>
  );
};

export default CustomSearch;
