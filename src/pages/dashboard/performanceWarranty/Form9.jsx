import React from "react";
import { Form, Input, Select, DatePicker, Button } from "antd";
// import React from "react";

const { Option } = Select;

const Form9 = () => {
  const handleSubmit = (values) => {
    ;
  };

  return (
    <div className="form-container">
      <h2>Performance & Warranty Security Update</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className="form-section">
          {/* Security Type */}
          <Form.Item
            label="Security Type"
            name="securityType"
            rules={[{ required: true, message: "Security type is required" }]}
          >
            <Select placeholder="Select security type">
              <Option value="bankGuarantee">Bank Guarantee</Option>
              <Option value="fdr">FDR</Option>
              <Option value="demandDraft">Demand Draft</Option>
            </Select>
          </Form.Item>

          {/* Amount */}
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please specify the amount" }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item label="Expiry Notification" name="expiryNotification">
            <Input disabled value="Auto-generated notification" />
          </Form.Item>
        </div>

        {/* Validity Period */}
        <Form.Item
          label="Validity Period"
          name="validityPeriod"
          rules={[
            { required: true, message: "Please specify the validity period" },
          ]}
        >
          <DatePicker placeholder="Select validity period" />
        </Form.Item>

        {/* Expiry Notification */}

        {/* Submit Button */}
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
      </Form>
    </div>
  );
};

export default Form9;
