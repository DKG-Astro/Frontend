import React, { useEffect, useState } from "react";
import FormContainer from "../../components/DKG_FormContainer";
import { Form, message } from "antd";
import FormInputItem from "../../components/DKG_FormInputItem";
import CustomSelect from "../../components/CustomSelect";
import Heading from "../../components/DKG_Heading";
import { useSelector } from "react-redux";
import { modeOfProcurementList } from "../../utils/Constants";
import axios from "axios";
import Btn from "../../components/DKG_Btn";
import { Option } from "antd/es/mentions";
import TextAreaComponent from "../../components/DKG_TextAreaComponent";
import {
  Button,
  Radio,
  Select,
  Modal,
  Input,
} from "antd";
import {
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";



const JobForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [procurementMode, setProcurementMode] = useState("");
  const { categoryMaster, uomMaster, vendorMaster } = useSelector(
    (state) => state.masters
  );
  const { userId } = useSelector((state) => state.auth);
  const [jobList, setJobList] = useState([]);
  const [jobDetailsMap, setJobDetailsMap] = useState({});
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSubcategories, setJobSubcategories] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  const [showJobCodePopup, setShowJobCodePopup] = useState(false);
  const [generatedJobCode, setGeneratedJobCode] = useState("");

  // Fetch data with Axios
  const fetchInitialData = async () => {
    try {
      const jobResponse = await axios.get(`api/job-master`);
      const data = jobResponse.data;

      if (!data.responseData) throw new Error("Invalid job data");

      const categories = [
        ...new Set(data.responseData.map((item) => item.category)),
      ];
      const subCategories = [
        ...new Set(data.responseData.map((item) => item.subCategory)),
      ];

      setJobCategories(categories);
      setJobSubcategories(subCategories);

      const jobMap = data.responseData.reduce(
        (acc, job) => ({
          ...acc,
          [job.jobCode]: {
            ...job,
            jobDescription: job.description,
            jobCategory: job.category,
            jobSubCategory: job.subCategory,
          },
        }),
        {}
      );

      setJobDetailsMap(jobMap);
      setJobList(Object.keys(jobMap));

      // Fetch UOM Data
      const uomResponse = await axios.get(`api/uom-master`);
      const uomData = uomResponse.data;

      if (!uomData.responseData) throw new Error("Invalid UOM data");

      const processedUom = uomData.responseData.map((uom) => ({
        value: uom.uomCode,
        label: uom.uomName,
      }));
      setUomOptions(processedUom);
    } catch (error) {
      console.error("Material fetch error:", error);
      message.error("Failed to load data from server");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Submit job data with Axios
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        category: values.category,
        createdBy: actionPerformer,
        currency: values.currency,
        jobDescription: values.description,
        indigenousOrImported: values.indigenousOrImported,
        subCategory: values.subCategory,
        uom: values.uom,
        assetId: values.assetId,
        value: values.value,
        estimatedPriceWithCcy: values.estimatedPrice,
        briefDescription: values.briefDescription,
        updatedBy: String(actionPerformer),
      };

      console.log("Payload sending:", payload);

      const response = await axios.post(`api/job-master`, payload);
      const result = response.data;

      if (!result.responseData) {
        throw new Error(result.responseStatus?.message || "Operation failed");
      }

      setGeneratedJobCode(result.responseData?.jobCode);
      setShowJobCodePopup(true);
      message.success("Job created successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      message.error(
        error.response?.data?.responseStatus?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  // Job Code Popup
  const JobCodePopup = () => (
    <Modal
      title="Job Created Successfully"
      open={showJobCodePopup}
      onOk={() => setShowJobCodePopup(false)}
      onCancel={() => setShowJobCodePopup(false)}
      okText="OK"
    >
      <p>
        Generated Job Code: <strong>{generatedJobCode}</strong>
      </p>
      <p>Job created successfully! Job Code will be assigned after approval.</p>
    </Modal>
  );

  return (
    <FormContainer>
      <JobCodePopup />
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => {
          if (changedValues.modeOfProcurement) {
            setProcurementMode(changedValues.modeOfProcurement);
          }
        }}
      >
        <Heading title={"Job Details"} />
        <div className="form-section">
          <FormInputItem label="Job Code" name="jobCode" disabled />

          <Form.Item
            name="category"
            label="Job Category"
            rules={[
              { required: true, message: "Please select job category!" },
            ]}
          >
            <Select placeholder="Select Job Category">
              <Option value="AMC">AMC (Annual Maintenance Contract)</Option>
              <Option value="Rate Contract">Rate Contract</Option>
              <Option value="Repair And Service">Repair & Service</Option>
              <Option value="Internet Service">Internet Service</Option>
              <Option value="Other Service">Other Service</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="subCategory"
            label="Job Subcategory"
            rules={[{ required: true, message: "Please select subcategory!" }]}
          >
            <Select placeholder="Select Job Subcategory">
              <Option value="Chemicals">Chemicals</Option>
              <Option value="Computer & Peripherals">
                Computer & Peripherals
              </Option>
              <Option value="Electrical">Electrical</Option>
              <Option value="Electronic Items">Electronic Items</Option>
              <Option value="Equipment">Equipment</Option>
              <Option value="Furniture">Furniture</Option>
              <Option value="HARDWARE">HARDWARE</Option>
              <Option value="Miscellaneous">Miscellaneous</Option>
              <Option value="Software">Software</Option>
              <Option value="Stationary">Stationary</Option>
              <Option value="Vehicles">Vehicles</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Job Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="uom"
            label="UOM"
            rules={[{ required: true, message: "Please select UOM!" }]}
          >
            <Select placeholder="Select Unit of Measure">
              {uomOptions.map((uom) => (
                <Option key={uom.value} value={uom.value}>
                  {uom.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <TextAreaComponent
            label="Brief Description of Job"
            name="briefDescription"
            required
          />
        </div>

        <div className="form-section">
          <FormInputItem
            type="number"
            name="estimatedPrice"
            label="Estimated Price"
            required
          />
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: "Please select currency!" }]}
          >
            <Select placeholder="Select Currency">
              <Option value="USD">USD</Option>
              <Option value="INR">INR</Option>
              <Option value="EUR">EUR</Option>
              <Option value="GBP">GBP</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="indigenousOrImported"
            label="Origin"
            rules={[{ required: true, message: "Please select origin!" }]}
          >
            <Radio.Group>
              <Radio value="indigenous">Indigenous</Radio>
              <Radio value="imported">Imported</Radio>
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
            <ReloadOutlined /> Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            <SendOutlined /> Create
          </Button>
          <Button type="dashed" htmlType="button">
            <SaveOutlined /> Save Draft
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default JobForm;
