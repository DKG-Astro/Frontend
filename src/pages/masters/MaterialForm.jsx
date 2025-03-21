import React, { useEffect, useState } from "react";
import FormContainer from "../../components/DKG_FormContainer";
import FormInputItem from "../../components/DKG_FormInputItem";
import Heading from "../../components/DKG_Heading";
import CustomSelect from "../../components/CustomSelect";
import { Option } from "antd/es/mentions";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import {
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { modeOfProcurementList } from "../../utils/Constants";

const MaterialForm = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});
  const [materialCategories, setMaterialCategories] = useState([]);
  const [materialSubcategories, setMaterialSubcategories] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMaterialCodePopup, setShowMaterialCodePopup] = useState(false);
  const [generatedMaterialCode, setGeneratedMaterialCode] = useState("");

  const fetchInitialData = async () => {
    try {
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/material-master"
      );
      const data = await response.json();

      if (!data.responseData) throw new Error("Invalid material data");

      // Extract unique categories and subcategories
      const categories = [
        ...new Set(data.responseData.map((item) => item.category)),
      ];
      const subCategories = [
        ...new Set(data.responseData.map((item) => item.subCategory)),
      ];

      setMaterialCategories(categories);
      setMaterialSubcategories(subCategories);

      // Create material map for other fields
      const materialMap = data.responseData.reduce(
        (acc, material) => ({
          ...acc,
          [material.materialCode]: {
            ...material,
            materialDescription: material.description,
            materialCategory: material.category,
            materialSubCategory: material.subCategory,
          },
        }),
        {}
      );

      setMaterialDetailsMap(materialMap);
      setMaterialList(Object.keys(materialMap));
      const uomResponse = await fetch(
        "http://103.181.158.220:8081/astro-service/api/uom-master"
      );
      const uomData = await uomResponse.json();

      if (!uomData.responseData) throw new Error("Invalid UOM data");

      // Process UOM data
      const processedUom = uomData.responseData.map((uom) => ({
        value: uom.uomCode,
        label: uom.uomName,
      }));
      setUomOptions(processedUom);
    } catch (error) {
      message.error("Failed to load materials");
      console.error("Material fetch error:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Add new state
  const [procurementMode, setProcurementMode] = useState("");
  const { vendorMaster } = useSelector((state) => state.masters);

  // Add vendor options mapping
  const vendorMasterMod = vendorMaster?.map((vendor) => ({
    label: vendor.vendorName,
    value: vendor.vendorName,
  }));

  // Modify handleSubmit to include validations
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (values.modeOfProcurement === "Proprietary/Single Tender") {
        if (!values?.vendorNames) {
          message.error("Please select vendor name");
          return;
        }
      } else if (
        values.modeOfProcurement === "Limited Pre Approved Vendor Tender"
      ) {
        if (values?.vendorNames?.length !== 4) {
          message.error("Please select 4 vendor names");
          return;
        }
      }

      let vendorNames = null;
      if (values.modeOfProcurement === "Proprietary/Single Tender") {
        vendorNames = [values.vendorNames];
      } else if (
        values.modeOfProcurement === "Limited Pre Approved Vendor Tender"
      ) {
        vendorNames = values.vendorNames;
      }

      let uploadedFileName = "";
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);

        const uploadResponse = await fetch(
          "http://103.181.158.220:8081/astro-service/file/upload?fileType=Material",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();
        uploadedFileName = uploadResult.fileName; // Adjust based on actual API response
      }

      // Prepare payload according to DTO structure
      const payload = {
        ...values,
        vendorNames,
        endOfLife: values.endOfLife?.format("YYYY-MM-DD") || "",
        uploadImageFileName: uploadedFileName,
        createdBy: actionPerformer,
        updatedBy: "0",
      };

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/material-master",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      // Check actual API response structure here
      console.log("API Response:", result);

      // Adjust this line based on actual response structure
      const generatedCode =
        result.responseData?.materialCode || result.materialCode;

      if (!generatedCode) {
        throw new Error("Material code not found in response");
      }

      setGeneratedMaterialCode(generatedCode);
      setShowMaterialCodePopup(true);
      message.success("Material submitted successfully!");
    } catch (error) {
      message.error(`Submission failed: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const MaterialCodePopup = () => (
    <Modal
      title="Material Created Successfully"
      visible={showMaterialCodePopup}
      onOk={() => setShowMaterialCodePopup(false)}
      onCancel={() => setShowMaterialCodePopup(false)}
      okText="Continue Editing"
    >
      {generatedMaterialCode ? (
        <p>
          Generated Material Code: <strong>{generatedMaterialCode}</strong>
        </p>
      ) : (
        <p>
          Material created successfully! Code will be assigned after approval.
        </p>
      )}
    </Modal>
  );
  return (
    <FormContainer>
      <MaterialCodePopup />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changedValues) => {
          if (changedValues.modeOfProcurement) {
            setProcurementMode(changedValues.modeOfProcurement);
          }
        }}
      >
        <Heading title={"Material Details"} />
        <div className="form-section">
          <FormInputItem
            label="Material Code"
            name="materialCode"
            placeholder="auto generated"
            disabled
          />
          <Form.Item
            name="category"
            label="Category"
            rules={[
              { required: true, message: "Please select material category!" },
            ]}
          >
            <Select placeholder="Select Material Category">
              {materialCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subCategory"
            label="Subcategory"
            rules={[
              {
                required: true,
                message: "Please select material subcategory!",
              },
            ]}
          >
            <Select placeholder="Select Material Subcategory">
              {materialSubcategories.map((subCat) => (
                <Option key={subCat} value={subCat}>
                  {subCat}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item label="Description" name="description" required>
            <Input />
          </Form.Item>
          <Form.Item
            name="uom"
            label="UOM"
            rules={[{ required: true, message: "Please select a UOM!" }]}
          >
            <Select
              placeholder="Select Unit of Measure"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {uomOptions.map((uom) => (
                <Option key={uom.value} value={uom.value}>
                  {uom.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <CustomSelect 
            name="modeOfProcurement" 
            label="Mode Of Procurement" 
            options={modeOfProcurementList} 
            required 
          /> */}
          <FormInputItem
            type="number"
            name="unitPrice"
            label="Unit Price"
            required
          />
        </div>

        {procurementMode === "Proprietary/Single Tender" && (
          <div className="form-section">
            <CustomSelect
              name="vendorNames"
              label="Vendor Name"
              options={vendorMasterMod}
            />
          </div>
        )}
        {procurementMode === "Limited Pre Approved Vendor Tender" && (
          <div className="form-section">
            <CustomSelect
              name="vendorNames"
              label="Vendor Names"
              options={vendorMasterMod}
              multiselect
            />
          </div>
        )}

        <div className="form-section">
          {/* <Form.Item label="End of Life" name="endOfLife">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item> */}
          {/* <FormInputItem
            type="number"
            label="Depreciation Rate"
            name="depreciationRate"
          />
          <FormInputItem
            type="number"
            label="Stock Levels"
            name="stockLevels"
          /> */}
        </div>

        <div className="form-section">
          {/* <FormInputItem label="Condition of Goods" name="conditionOfGoods" />
          <FormInputItem label="Shelf Life" name="shelfLife" /> */}
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Currency">
              <Option value="USD">USD</Option>
              <Option value="INR">INR</Option>
              <Option value="EUR">EUR</Option>
              <Option value="GBP">GBP</Option>
            </Select>
          </Form.Item>

          <FormInputItem
            label="Estimated Price with CCY"
            name="estimatedPriceWithCcy"
            required
          />
        </div>

        <div className="form-section">
          <Form.Item label="Upload Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="indigenousOrImported"
            label="Origin"
            rules={[{ required: true }]}
            valuePropName="checked"
          >
            <Radio.Group>
              <Radio value={true}>Indigenous</Radio>
              <Radio value={false}>Imported</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

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
          <Button type="primary" htmlType="submit" loading={loading}>
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

export default MaterialForm;
