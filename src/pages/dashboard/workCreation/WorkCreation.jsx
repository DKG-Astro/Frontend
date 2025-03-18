import { Button, Form, Select } from "antd";
import React from "react";
import FormContainer from "../../../components/DKG_FormContainer";
import Heading from "../../../components/DKG_Heading";
import { Option } from "antd/es/mentions";
import FormInputItem from "../../../components/DKG_FormInputItem";
import { ReloadOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";

const WorkCreation = () => {
  const [form] = Form.useForm();
  return (
    <FormContainer>
      <Form form={form} layout="vertical">
        <Heading title={"Work Creation"} />
        <div className="form-section">
          <Form.Item label="Type of Creation" name="typeOfCreation">
            <Select>
              <Option value="material">Material</Option>
              <Option value="job">Job</Option>
              <Option value="work">Work</Option>
            </Select>
          </Form.Item>
          <FormInputItem label="Work Code" name="workCode" />
          <FormInputItem label="Work Subcategory" name="workSubCategory" />
        </div>
        <Form.Item
          label="Mode Of Procurement"
          name="modeOfProcurement"
          style={{ width: "32%" }}
        >
          <Select>
            <Option value="proprietary">Proprietary</Option>
            <Option value="limitedPreferred">
              Limited Preferred Vendor Tender
            </Option>
            <Option value="openTender">Open Tender</Option>
            <Option value="brandSpecific">Brand Specific</Option>
            <Option value="global">Global</Option>
          </Select>
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <Button type="default" htmlType="reset">
            <ReloadOutlined />
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            <SendOutlined /> Submit
          </Button>
          <Button type="dashed" htmlType="button">
            <SaveOutlined />
            Save Draft
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default WorkCreation;
