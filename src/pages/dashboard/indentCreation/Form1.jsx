import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  DatePicker,
  Checkbox,
  Space,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSelector } from "react-redux";
import LineItem from "../LineItem";
import { unitless } from "antd/es/theme/useToken";
dayjs.extend(customParseFormat);

const { Option } = Select;

const Form1 = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const [preBidRequired, setPreBidRequired] = useState(false);
  const [rateContractIndent, setRateContractIndent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedIndentId, setGeneratedIndentId] = useState("");

  const { userName, email, mobileNumber } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/location-master"
        );
        const data = await response.json();

        if (
          data.responseStatus.statusCode === 0 &&
          Array.isArray(data.responseData)
        ) {
          setLocations(data.responseData);
        } else {
          message.error("Failed to load locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        message.error("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/project-master"
        );
        const data = await response.json();

        if (
          data.responseStatus.statusCode === 0 &&
          Array.isArray(data.responseData)
        ) {
          setProjects(data.responseData);
        } else {
          message.error("Failed to project data");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const hasPacMaterial = () => {
    const lineItems = form.getFieldValue("lineItems") || [];
    return lineItems.some(
      (item) => String(item?.modeOfProcurement).toLowerCase() === "brand pac"
    );
  };

  const handleSearch = async () => {
    const indentorId = form.getFieldValue("indentId");
    if (!indentorId) {
      message.error("Please enter an Indent ID");
      return;
    }

    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/indents/${indentorId}`
      );

      if (!response.ok)
        throw new Error(`Failed to fetch data: ${response.statusText}`);

      const data = await response.json();

      console.log("API Response:", data); // Debugging log

      if (!data.responseData) {
        throw new Error("Invalid API response: responseData is missing");
      }

      const responseData = data.responseData;

      // Ensure file upload fields are always an array
      const getFileList = (fileName) =>
        fileName ? [{ uid: "-1", name: fileName, status: "done" }] : [];

      const formData = {
        indentId: responseData.indentId || "",
        indentorName: responseData.indentorName || "",
        indentorMobileNo: responseData.indentorMobileNo || "",
        indentorEmail: responseData.indentorEmailAddress || "",
        consigneeLocation: responseData.consignesLocation || "",
        projectName: responseData.projectName || "",
        preBidMeetingRequired: responseData.isPreBidMeetingRequired || false,
        preBidMeetingDetails: responseData.preBidMeetingDate
          ? dayjs(responseData.preBidMeetingDate, "DD/MM/YYYY")
          : null,
        preBidMeetingLocation: responseData.preBidMeetingVenue || "",
        rateContractIndent: responseData.isItARateContractIndent || false,
        estimatedRate: parseFloat(responseData.estimatedRate) || 0,
        periodOfRateContract: parseFloat(responseData.periodOfContract) || 0,
        singleOrMultipleJob: responseData.singleAndMultipleJob || "",

        // ✅ Fix file uploads - Ensure they are arrays
        uploadingPriorApprovalsFileName: getFileList(
          responseData.uploadingPriorApprovalsFileName
        ),
        technicalSpecificationsFileName: getFileList(
          responseData.technicalSpecificationsFileName
        ),
        draftEOIOrRFPFileName: getFileList(responseData.draftEOIOrRFPFileName),
        uploadPACOrBrandPAC: getFileList(
          responseData.uploadPACOrBrandPACFileName
        ),

        // ✅ Ensure material details is an array
        lineItems: Array.isArray(responseData.materialDetails)
          ? responseData.materialDetails.map((item) => ({
              materialCode: item.materialCode || "",
              materialDescription: item.materialDescription || "",
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseFloat(item.unitPrice) || 0,
              uom: item.uom || "",
              totalPrice: parseFloat(item.totalPrize) || 0,
              budgetCode: item.budgetCode || "",
              materialCategory: item.materialCategory || "",
              materialSubcategory: item.materialSubCategory || "",
              materialOrJobCodeUsedByDept: item.materialAndJob || "",
              modeOfProcurement: item.modeOfProcurement || "",
            }))
          : [],
      };

      console.log("Final Form Data:", formData); // Debugging log

      // ✅ Update form fields safely
      form.setFieldsValue(formData);
      setPreBidRequired(formData.preBidMeetingRequired);
      setRateContractIndent(formData.rateContractIndent);
      message.success("Form data fetched successfully");
    } catch (error) {
      message.error(`Failed to fetch form data: ${error.message}`);
      console.error("Error fetching data:", error);
    }
  };

  const normFile = (e) => {
    // When uploading, an array of file objects is expected.
    // If e is already an array, return it. Otherwise, return e.fileList.
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadFileToServer = async (file, fieldName) => {
    try {
      if (!file) return "";
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${fieldName} file is too large. Maximum 5MB allowed.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/file/upload?fileType=Indent",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add authentication if needed
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.responseStatus?.message || "File upload failed"
        );
      }

      const data = await response.json();
      return data.responseData.fileName;
    } catch (error) {
      console.error(`File upload error (${fieldName}):`, error);
      throw new Error(`Failed to upload ${fieldName}: ${error.message}`);
    }
  };

  // Update the handleSubmit function with these changes
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Check if any line item has Brand PAC and the file is missing
      if (
        hasPacMaterial() &&
        (!values.uploadPACOrBrandPACFileName ||
          values.uploadPACOrBrandPACFileName.length === 0)
      ) {
        Modal.error({
          title: "Missing Brand PAC Document",
          content:
            "Brand PAC document is mandatory when any item uses Brand PAC procurement.",
        });
        setLoading(false);
        return;
      }

      // Continue with file uploads and payload construction as before
      const uploadFiles = async (fileList, fieldName) => {
        if (!fileList || fileList.length === 0) return "";
        return uploadFileToServer(fileList[0].originFileObj, fieldName);
      };

      const [
        priorApprovalsFile,
        technicalSpecifications,
        draftEOIOrRFP,
        uploadPACOrBrandPAC,
      ] = await Promise.all([
        uploadFiles(values.uploadingPriorApprovalsFileName, "Prior Approvals"),
        uploadFiles(values.technicalSpecificationsFileName, "Tender Documents"),
        uploadFiles(values.draftEOIOrRFPFileName, "EOI/RFP"),
        uploadFiles(values.uploadPACOrBrandPACFileName, "Brand PAC"),
      ]);

      // Process material details with enhanced validation
      const materialDetails = (values.lineItems || []).map((item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const totalPrice = quantity * unitPrice;

        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for material ${item.materialCode}`);
        }

        return {
          materialCode: String(item.materialCode) || null,
          materialDescription: String(item.materialDescription) || null,
          quantity: quantity,
          unitPrice: unitPrice,
          uom: String(item.uom) || null,
          totalPrize: totalPrice,
          budgetCode: String(item.budgetCode) || null,
          materialCategory: String(item.materialCategory) || null,
          materialSubCategory: String(item.materialSubcategory) || null,
          materialAndJob: String(item.materialOrJobCodeUsedByDept) || null,
          modeOfProcurement: String(item.modeOfProcurement) || null,
          vendorNames: String(item.vendorNames) || null,
        };
      });

      // Build payload with proper type conversions
      const payload = {
        consignesLocation: String(values.consigneeLocation) || "Bangalore",
        createdBy: Number(actionPerformer) || 0,
        estimatedRate: Number(values.estimatedRate) || 0,
        fileType: "Indent",
        indentId: String(values.indentId) || null,
        indentorEmailAddress: String(values.indentorEmail) || null,
        indentorMobileNo: String(values.indentorMobileNo) || null,
        indentorName: String(values.indentorName) || null,
        isItARateContractIndent: Boolean(values.rateContractIndent),
        isPreBidMeetingRequired: Boolean(values.preBidMeetingRequired),
        materialDetails: materialDetails,
        periodOfContract: Number(values.periodOfRateContract) || 0,
        preBidMeetingDate: values.preBidMeetingDetails?.isValid()
          ? values.preBidMeetingDetails.format("DD/MM/YYYY")
          : null,
        preBidMeetingVenue: String(values.preBidMeetingLocation) || null,
        projectName: values.projectName || null,
        singleAndMultipleJob: String(values.singleOrMultipleJob) || null,
        updatedBy: null,
        draftEOIOrRFPFileName: String(draftEOIOrRFP) || null,
        uploadPACOrBrandPACFileName: String(uploadPACOrBrandPAC) || null,
        technicalSpecificationsFileName:
          String(technicalSpecifications) || null,
        uploadingPriorApprovalsFileName: String(priorApprovalsFile) || null,
      };

      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      // Submit request with authentication headers
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/indents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok || responseData.responseStatus.statusCode !== 0) {
        const formattedData = {
          ...responseData.responseData,
          materialDetails: responseData.responseData.materialDetails || [],
        };
        throw new Error(
          responseData.responseStatus?.message || "Submission failed"
        );
      }

      // Show success modal with response data
      setGeneratedIndentId(responseData.responseData.indentId);
      setShowSuccessModal(true);
      message.success("Indent submitted successfully!");
      //   form.resetFields();
    } catch (error) {
      message.error(`Submission Error: ${error.message}`);
      console.error("Detailed Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (record) => {
    const quantity = parseFloat(record.quantity) || 0;
    const unitPrice = parseFloat(record.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handlePriceCalculation = (index, field, value) => {
    const lineItems = form.getFieldValue("lineItems");
    if (lineItems[index]) {
      const totalPrice = calculateTotalPrice({
        ...lineItems[index],
        [field]: value,
      });

      const updatedItems = [...lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        totalPrice: totalPrice,
      };

      form.setFieldsValue({ lineItems: updatedItems });
    }
  };

  const handleCheckboxChange = (e) => {
    setPreBidRequired(e.target.checked);
  };

  const handleCheckboxChange2 = (e) => {
    setRateContractIndent(e.target.checked);
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/material-master"
        );
        const data = await response.json();

        if (!data.responseData) throw new Error("Invalid material data");

        // Create a proper material map
        const materialMap = data.responseData.reduce(
          (acc, material) => ({
            ...acc,
            [material.materialCode]: {
              ...material,
              materialDescription: material.description,
              materialCategory: material.category,
              materialSubCategory: material.subCategory,
              modeOfProcurement: material.modeOfProcurement,
              unitPrice: material.unitPrice,
              vendorNames: material.vendorNames,
            },
          }),
          {}
        );

        setMaterialDetailsMap(materialMap);
        setMaterialList(Object.keys(materialMap));
      } catch (error) {
        message.error("Failed to load materials");
        console.error("Material fetch error:", error);
      }
    };

    fetchMaterials();
  }, []);

  // ✅ When a material is selected, auto-fill the other fields
  const handleMaterialSelect = (index, materialCode) => {
    const materialData = materialDetailsMap[materialCode] || {};
    const lineItems = form.getFieldValue("lineItems") || [];
    const updatedItems = [...lineItems];

    updatedItems[index] = {
      ...updatedItems[index],
      materialCode: materialCode,
      materialDescription: materialData.description || "", // Match API field
      materialCategory: materialData.category || "", // Match API field
      materialSubcategory: materialData.subCategory || "", // Match API field
      uom: materialData.uom || "",
      unitPrice: materialData.unitPrice || 0,
      modeOfProcurement: materialData.modeOfProcurement
        ? materialData.modeOfProcurement.trim().toUpperCase() // Normalize to uppercase
        : "",
      vendorNames: (materialData.vendorNames || []).join(", "),
    };

    form.setFieldsValue({ lineItems: updatedItems });

    // Category validation
    const categories = updatedItems
      .map((item) => item?.materialCategory)
      .filter(Boolean);

    if (categories.length === 0) return;

    const firstCategory = categories[0];
    const allSame = categories.every((cat) => cat === firstCategory);

    if (!allSame) {
      message.error("All materials must be of the same category.");
      updatedItems[index] = {
        ...updatedItems[index],
        materialCode: "", // Fixed syntax error
        materialDescription: "",
        materialCategory: "",
        materialSubcategory: "",
        uom: "",
        modeOfProcurement: "",
        unitPrice: 0,
      };

      form.setFieldsValue({ lineItems: updatedItems });
      form.setFields([
        {
          name: ["lineItems", index, "materialCode"],
          errors: ["Category must match first material"],
        },
      ]);
    }
  };

  // Add this handler in Form1
  const handleMaterialDescriptionSelect = (index, materialCode) => {
    handleMaterialSelect(index, materialCode); // Reuse the same handler
  };

  useEffect(() => {
    form.setFieldsValue({
      indentorEmail: email,
      indentorMobileNo: mobileNumber,
      indentorName: userName,
    });
  }, []);

  const hasBrandPACMaterial = (lineItems) => {
    return lineItems?.some((item) => item?.modeOfProcurement === "Brand PAC");
  };

  return (
    <div className="form-container">
      <h2>Indent Creation</h2>
      <Row justify="end">
        <Col>
          <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Indent ID"
              name="indentId"
              //   rules={[{ required: true, message: "Indentor ID is required" }]}
            >
              <Space>
                <Input placeholder="Enter Indent ID" disabled />
                <Button type="primary" onClick={handleSearch}>
                  <SearchOutlined />
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.error("Validation Failed:", errorInfo);
          message.error("Please fill all required fields");
        }}
        initialValues={{
          lineItems: [{}],
          preBidMeetingRequired: false,
          rateContractIndent: false,
          consigneeLocation: "Bangalore", // Default value that matches one of the options
        }}
      >
        <div className="form-section">
          <Form.Item
            label="Indentor Name"
            name="indentorName"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>

          <Form.Item
            label="Indentor Mobile No."
            name="indentorMobileNo"
            rules={[
              { required: true, message: "Indentor mobile number is required" },
            ]}
          >
            <Input value="Auto-populated" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Indentor Email"
            name="indentorEmail"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>

          <Form.Item
            label="Consignee Location"
            name="consigneeLocation"
            rules={[
              { required: true, message: "Consignee location is required" },
            ]}
          >
            <Select placeholder="Select location">
              {locations.map((location) => (
                <Option
                  key={location.locationCode}
                  value={location.locationName}
                >
                  {location.locationName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Upload Prior Approvals"
            name="uploadingPriorApprovalsFileName"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // rules={[
            //   { required: true, message: "Prior approvals are required" },
            // ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Prior Approvals</Button>
            </Upload>
          </Form.Item>
        </div>

        <LineItem
          form={form}
          materialList={materialList}
          projects={projects}
          materialDetailsMap={materialDetailsMap}
          calculateTotalPrice={calculateTotalPrice}
          handleMaterialSelect={handleMaterialSelect}
          handlePriceCalculation={handlePriceCalculation}
          handleMaterialDescriptionSelect={handleMaterialDescriptionSelect}
        />

        <div className="form-section">
          <Form.Item name="projectName" label="Project Name">
            <Select placeholder="Select project" loading={loading} allowClear>
              {projects.map((project) => (
                <Option
                  key={project.projectNameDescription}
                  value={project.projectNameDescription}
                >
                  {project.projectNameDescription}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Upload Technical Specifications"
            name="technicalSpecificationsFileName"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // rules={[
            //   { required: true, message: "Technical specifications are required" },
            // ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>
                Upload Technical Specifications
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item name="preBidMeetingRequired" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange}>
            Pre-bid Meeting Required
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {preBidRequired && (
            <Row gutter={30}>
              <Col span={15}>
                <Form.Item
                  name="preBidMeetingDetails"
                  label="Tentative Meeting Date"
                  rules={[
                    {
                      required: preBidRequired,
                      message: "Meeting date is required",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || value.isValid()) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Invalid date format");
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={15}>
                <Form.Item
                  label="Meeting Location"
                  name="preBidMeetingLocation"
                  rules={[
                    {
                      required: true,
                      message: "Pre Bid Meeting Location is required",
                    },
                  ]}
                >
                  <Select placeholder="Select location">
                    {locations.map((location) => (
                      <Option
                        key={location.locationCode}
                        value={location.locationName}
                      >
                        {location.locationName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>

        <Form.Item name="rateContractIndent" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange2}>
            Is it a rate contract indent
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {rateContractIndent && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="estimatedRate"
                  label="Estimated Rate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter estimated rate!",
                    },
                  ]}
                >
                  <Input type="number" placeholder="Enter Estimated Rate" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="periodOfRateContract"
                  label="Period of Rate Contract"
                  rules={[
                    {
                      required: true,
                      message: "Enter Period of Contract!",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="singleOrMultipleJob"
                  label="Single or Multiple Job"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select Material Code">
                    <Option value="Single">Single</Option>
                    <Option value="Multiple">Multiple</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <div className="form-section">
          <Form.Item
            label="Upload draft EOI or RFP"
            name="draftEOIOrRFPFileName"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // rules={[{ required: true, message: "GOI or RFP is required" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload EOI or RFP</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Brand PAC Approval"
            name="uploadPACOrBrandPACFileName"
            dependencies={["lineItems"]} // Add this line
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: hasPacMaterial(),
                message:
                  "PAC/Brand PAC document is required when any item uses PAC procurement",
              },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Brand PAC</Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button type="dashed" htmlType="button">
              Save Draft
            </Button>
          </div>
        </Form.Item>
        {/* Add this near the end of your component's JSX */}
        <Modal
          title="Indent Submission Successful"
          open={showSuccessModal}
          onOk={() => setShowSuccessModal(false)}
          onCancel={() => setShowSuccessModal(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", marginBottom: "16px" }}>
              Indent submitted successfully!
            </p>
            <p>
              <strong>Generated Indent ID:</strong>
              <span style={{ color: "#1890ff", marginLeft: "8px" }}>
                {generatedIndentId}
              </span>
            </p>
          </div>
        </Modal>
      </Form>
    </div>
  );
};

export default Form1;
