import { Form } from "antd";
import React, { useEffect } from "react";

const DKG_CustomForm = ({ formData, onFinish, onFinishFailed, children }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("triggered")
    // form.setFieldsValue({...formData, date: formData.date ? dayjs(formData.date, "DD/MM/YYYY")});
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
