import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { Option } from "antd/es/mentions";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";

const Form18 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    ;
  };

  return (
    <div className="form-container">
      <h2>Material Disposal</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <Form.Item
            label="Disposal Category"
            name="disposalCategory"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select Disposal Category">
              <Option value="obsolete">Obsolete</Option>
              <Option value="scrap">Scrap</Option>
              <Option value="unserviceable">Unserviceable</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Disposal Mode"
            name="disposalMode"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select Disposal Mode">
              <Option value="auction">Auction</Option>
              <Option value="external">External Agency</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Vendor Details" name="vendorDetails">
            <Input placeholder="Purchasing Vendor Details (if applicable)" />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Disposal Date"
            name="disposalDate"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Current Book Value" name="currentBookValue">
            <InputNumber
              style={{ width: "100%" }}
              disabled
              placeholder="Auto-calculated"
            />
          </Form.Item>
          <Form.Item
            label="Reserve Value"
            name="reserveValue"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Form.Item
          label="Bid Value"
          name="bidValue"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <InputNumber style={{ width: "32%" }} />
        </Form.Item>
        <Form.Item label="Sale Note" name="saleNote">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload Document</Button>
          </Upload>
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

export default Form18;
