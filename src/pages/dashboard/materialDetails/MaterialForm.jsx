import React from "react";
import FormContainer from "../../../components/DKG_FormContainer";
import FormBody from "../../../components/DKG_FormBody";
import FormInputItem from "../../../components/DKG_FormInputItem";
import Heading from "../../../components/DKG_Heading";
import FormDropdownItem from "../../../components/DKG_FormDropdownItem";
import { Option } from "antd/es/mentions";
import { Button, Checkbox, Form, Radio, Upload } from "antd";
import { ReloadOutlined, SaveOutlined, SendOutlined, UploadOutlined } from "@ant-design/icons"

const MaterialForm = () => {
  return (
    <FormContainer>
      <FormBody>
        <Heading title={"Material Details"} />
        <div className="form-section">
          <FormInputItem label="Material Code" name="materialCode" required />
          <FormInputItem
            label="Material Category"
            name="materialCategory"
            required
          />
          <FormInputItem
            label="Material Sub-category"
            name="materialSubcategory"
            required
          />
        </div>
        <div className="form-section">
          {/* <FormInputItem label="Material Name" name="materialName" /> */}
          <FormInputItem
            label="Material Description"
            name="materialDescription"
            required
          />
          <FormDropdownItem
            label="UOM"
            name="uom"
            dropdownArray={[]}
            valueField="value"
            visibleField="value"
            required
          />
          <FormInputItem
            label="Mode of Procurement"
            name="modeOfProcurement"
            required
          />
        </div>
        <div className="form-section">
          <FormInputItem label="End of Life" name="endOfLife" required />
          <FormInputItem
            label="Depreciation Rate"
            name="depreciationRate"
            required
          />
          <FormInputItem label="Stock Levels" name="stockLevels" required />
        </div>
        <div className="form-section">
          <FormInputItem
            label="Condition of Goods"
            name="conditionOfGoods"
            required
          />
          <FormInputItem label="Shelf Life" name="shelfLife" required />
          <Form.Item
            label="Upload Image"
            name="uploadImage"
            rules={[{ required: true, message: "Please select a value!" }]}
          >
            <Upload listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item label="Indegenous or Imported">
            <Radio.Group>
              <Radio value={1}>Indigenous</Radio>
              <Radio value={2}>Imported</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
          <Button type="default" htmlType="reset">
            <ReloadOutlined />
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            <SendOutlined />
            Submit
          </Button>
          <Button type="dashed" htmlType="button">
            <SaveOutlined />
            Save Draft
          </Button>
        </div>
      </FormBody>
    </FormContainer>
  );
};

export default MaterialForm;
