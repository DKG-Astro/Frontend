import { Form } from "antd";
import React, { useEffect } from "react";

const DKG_CustomForm = ({ formData, onFinish, onFinishFailed, children, customForm }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if(customForm) {
      customForm.setFieldsValue(formData);
    }
    else{
      form.setFieldsValue(formData);
    }
  }, [formData, form, customForm]);
  return (
    <Form
      form={customForm ? customForm : form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={formData}
    >
      {children}
    </Form>
  );
};

export default DKG_CustomForm;
