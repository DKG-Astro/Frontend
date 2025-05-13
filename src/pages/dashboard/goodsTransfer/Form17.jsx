import { Button, Form, Input, InputNumber, Select } from "antd";
import { Option } from "antd/es/mentions";
import React from "react";

const Form17 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    ;
  };

  return (
    <div className="form-container">
      <h2>Goods Transfer</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <Form.Item
            label="Goods Transfer ID"
            name="goodsTransferId"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>
          <Form.Item
            label="Consignor Details"
            name="consignorDetails"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Consignee Details"
            name="consigneeDetails"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Field Station Name"
            name="fieldStationName"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Material Code"
            name="materialCode"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>
          <Form.Item
            label="UOM"
            name="uom"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select Unit of Measure">
              <Option value="kg">Kilograms</Option>
              <Option value="ltr">Liters</Option>
              <Option value="pcs">Pieces</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Locator"
            name="locator"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <Input.TextArea rows={1} placeholder="Additional remarks" />
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

export default Form17;
