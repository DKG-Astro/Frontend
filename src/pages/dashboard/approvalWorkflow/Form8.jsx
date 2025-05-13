import { Button, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import React from "react";

const Form8 = () => {
  const handleSubmit = (values) => {
    ;
  };
  return (
    <div className="form-container">
      <h2>Approval Workflow Form</h2>
      <div className="form-section">
        {/* Approver Name */}
        <Form.Item
          label="Approver Name"
          name="approverName"
          rules={[{ required: true, message: "Approver name is required" }]}
        >
          <Input disabled value="Auto-populated" />
        </Form.Item>

        {/* Approval Remarks */}
        <Form.Item
          label="Approval Remarks"
          name="approvalRemarks"
          rules={[{ required: true, message: "Please enter approval remarks" }]}
        >
          <Input.TextArea rows={1} placeholder="Enter approval remarks" />
        </Form.Item>

        {/* Approval Status */}
        <Form.Item
          label="Approval Status"
          name="approvalStatus"
          rules={[{ required: true, message: "Approval status is required" }]}
        >
          <Select placeholder="Select approval status">
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="returned">Returned</Option>
          </Select>
        </Form.Item>
      </div>
      <Form layout="vertical" onFinish={handleSubmit}>
        {/* Changes Summary */}
        <Form.Item label="Changes Summary" name="changesSummary">
          <Input.TextArea placeholder="Enter changes summary (if any)" />
        </Form.Item>

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

export default Form8;
