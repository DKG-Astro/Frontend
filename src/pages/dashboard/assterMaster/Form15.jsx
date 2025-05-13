import React from "react";
import { Form, Input, Select, Button, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const Form15 = () => {
  const onFinish = (values) => {
    ;
  };

  return (
    <div className="form-container">
        <h2>Asset Master</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          uom: "KG",
          currentCondition: "New",
        }}
      >
        <div className="form-section">
          <Form.Item
            label="Asset Code"
            name="assetCode"
            rules={[{ required: true, message: "Asset Code is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>

          <Form.Item
            label="Material Code"
            name="materialCode"
            rules={[{ required: true, message: "Material Code is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Unit of Measure (UOM)"
            name="uom"
            rules={[{ required: true, message: "UOM is required" }]}
          >
            <Select>
              <Option value="KG">KG</Option>
              <Option value="Liters">Liters</Option>
              <Option value="Units">Units</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Make No." name="makeNo">
            <Input />
          </Form.Item>

          <Form.Item label="Model No." name="modelNo">
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item label="Serial No." name="serialNo">
            <Input />
          </Form.Item>

          <Form.Item label="Component Name" name="componentName">
            <Input />
          </Form.Item>

          <Form.Item label="Component Code" name="componentCode">
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">

        <Form.Item label="Quantity" name="quantity">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Locator"
          name="locator"
          rules={[{ required: true, message: "Locator is required" }]}
        >
          <Input />
        </Form.Item>
            <Form.Item
            label="Current Condition"
            name="currentCondition"
            rules={[{ required: true, message: "Current Condition is required" }]}
            >
            <Select>
                <Option value="New">New</Option>
                <Option value="Good">Good</Option>
                <Option value="Needs Repair">Needs Repair</Option>
            </Select>
            </Form.Item>
        </div>

        <h6>Asset Issue</h6>
        <Form.Item label="Transaction History" name="transactionHistory">
          <Button type="link">View Transaction History</Button>
        </Form.Item>


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

export default Form15;
