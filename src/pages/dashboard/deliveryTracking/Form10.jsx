import { Button, DatePicker, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import React from "react";

const Form10 = () => {
  const handleSubmit = (values) => {
    ;
  };
  return (
    <div className="form-container">
      <h2>Delivery Tracking</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className="form-section">
          {/* Delivery Expiry Date */}

          {/* Provisional GRN Status */}
          <Form.Item
            label="Provisional GRN Status"
            name="provisionalGRNStatus"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select GRN status">
              <Option value="generated">Generated</Option>
              <Option value="notGenerated">Not Generated</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Delivery Expiry Date"
            name="deliveryExpiryDate"
            rules={[
              { required: true, message: "Please specify the expiry date" },
            ]}
          >
            <DatePicker placeholder="Select expiry date" />
          </Form.Item>
          {/* Alert Notification */}
          <Form.Item label="Alert Notification" name="alertNotification">
            <Input disabled value="Auto-generated notification" />
          </Form.Item>
        </div>
        {/* Submit Button */}
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

export default Form10;
