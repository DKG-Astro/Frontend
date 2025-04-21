import { Form } from "antd";
import React, { useEffect } from "react";

const DKG_CustomForm = ({ formData, onFinish, onFinishFailed, children }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);
  return (
    <Form
      form={form}
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
