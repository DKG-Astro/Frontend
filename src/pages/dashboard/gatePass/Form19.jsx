import { Button, DatePicker, Form, Input, Select } from "antd";
import React from "react";

const Form19 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    ;
  };

  return (
    <div className="form-container">
      <h2>Gate Pass</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <Form.Item
            label="Gate Pass Type"
            name="gatePassType"
            rules={[
              { required: true, message: "Please select the gate pass type" },
            ]}
          >
            <Select placeholder="Select type">
              <Select.Option value="returnable">Returnable</Select.Option>
              <Select.Option value="non-returnable">
                Non-Returnable
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Material Details"
            name="materialDetails"
            rules={[
              { required: true, message: "Please enter material details" },
            ]}
          >
            <Input.TextArea rows={1} placeholder="Enter material details" />
          </Form.Item>

          <Form.Item label="Expected Date of Return" name="expectedReturnDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="dashed" htmlType="button">
              Save Draft
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form19;
