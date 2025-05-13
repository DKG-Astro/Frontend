import { Button, Checkbox, Form, Input } from "antd";
import React from "react";

const Form3 = () => {
  const [form] = Form.useForm();
  return (
    <div className="form-container">
      <h2>Indent Modification</h2>
      <Form form={form} layout="vertical">
        <div className="form-section">
          <Form.Item
            label="Indent ID"
            name="indentId"
            rules={[{ required: true, message: "Indent ID is required" }]}
          >
            <Input placeholder="Enter Indent ID" />
          </Form.Item>
          <Form.Item
            label="Changes Made"
            name="changesMade"
            rules={[{ required: true, message: "Changes Made is required" }]}
          >
            <Input.TextArea rows={1} placeholder="Enter Changes Made" />
          </Form.Item>
          <Form.Item label="Resubmission Comments" name="resubmissionComments">
            <Input.TextArea
              rows={1}
              placeholder="Enter Resubmission Comments"
            />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            name="approversNotified"
            label="Approvers Notified"
            valuePropName="checked"
            rules={[
              { required: true, message: "Approvers should be notified" },
            ]}
          >
            <Checkbox>Approvers Notified?</Checkbox>
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

export default Form3;
