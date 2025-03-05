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
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
// import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import LineItem from "../LineItem";

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
          ? [dayjs(responseData.preBidMeetingDate, "DD/MM/YYYY")]
          : null,
        preBidMeetingLocation: responseData.preBidMeetingVenue || "",
        rateContractIndent: responseData.isItARateContractIndent || false,
        estimatedRate: parseFloat(responseData.estimatedRate) || 0,
        periodOfRateContract: parseFloat(responseData.periodOfContract) || 0,
        singleOrMultipleJob: responseData.singleAndMultipleJob || "",

        // ✅ Fix file uploads - Ensure they are arrays
        uploadingPriorApprovals: getFileList(
          responseData.uploadingPriorApprovalsFileName
        ),
        uploadTenderDocuments: getFileList(
          responseData.uploadTenderDocumentsFileName
        ),
        uploadGOIOrRFP: getFileList(responseData.uploadGOIOrRFPFileName),
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

  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/file/upload?fileType=Indent`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      return data.responseData.fileName; // Returns the uploaded filename
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  // Update the handleSubmit function with these changes
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 1. Process file uploads first
      const uploadFile = async (file, fieldName) => {
        if (!file) return "";
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `${fieldName} file is too large. Maximum 5MB allowed.`
          );
        }
        return await uploadFileToServer(file);
      };

      // Upload all files in parallel
      const [
        priorApprovalsFile,
        tenderDocumentsFile,
        goiOrRfpFile,
        pacOrBrandFile,
      ] = await Promise.all([
        uploadFile(
          values.uploadingPriorApprovals?.[0]?.originFileObj,
          "Prior Approvals"
        ),
        uploadFile(
          values.uploadTenderDocuments?.[0]?.originFileObj,
          "Tender Documents"
        ),
        uploadFile(values.uploadGOIOrRFP?.[0]?.originFileObj, "GOI/RFP"),
        uploadFile(
          values.uploadPACOrBrandPAC?.[0]?.originFileObj,
          "PAC/Brand PAC"
        ),
      ]);

      // 2. Process material details with strict number validation
      const materialDetails = (values.lineItems || [])
        .filter((item) => item.materialCode)
        .map((item) => ({
          materialCode: String(item.materialCode),
          materialDescription: String(item.materialDescription || ""),
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          uom: String(item.uom || ""),
          totalPrize: Number(item.totalPrice) || 0,
          budgetCode: String(item.budgetCode || ""),
          materialCategory: String(item.materialCategory || ""),
          materialSubCategory: String(item.materialSubcategory || ""),
          materialAndJob: String(item.materialOrJobCodeUsedByDept || ""),
        }));

      // 3. Build payload with explicit type conversions
      const payload = {
        consignesLocation: values.consigneeLocation || "Banglore",
        createdBy: actionPerformer || 0,
        estimatedRate: values.estimatedRate || 0,
        fileType: "Indent",
        indentId: values.indentId || "",
        indentorEmailAddress: values.indentorEmail || "",
        indentorMobileNo: values.indentorMobileNo || "",
        indentorName: values.indentorName || "",
        isItARateContractIndent: values.rateContractIndent,
        isPreBidMeetingRequired: values.preBidMeetingRequired,
        materialDetails,
        periodOfContract: values.periodOfRateContract || 0,
        preBidMeetingDate: values.preBidMeetingDetails?.[0]?.isValid()
          ? values.preBidMeetingDetails?.[0]?.format("DD/MM/YYYY")
          : null,
        preBidMeetingVenue: values.preBidMeetingLocation || "",
        projectName: values.projectName || "",
        singleAndMultipleJob: values.singleOrMultipleJob || "",
        updatedBy: null,
        uploadGOIOrRFPFileName: goiOrRfpFile || "",
        uploadPACOrBrandPACFileName: pacOrBrandFile || "",
        uploadTenderDocumentsFileName: tenderDocumentsFile || "",
        uploadingPriorApprovalsFileName: priorApprovalsFile || "",
      };

      // 4. Validate numeric fields
      const numericFields = [
        "estimatedRate",
        "periodOfContract",
        ...materialDetails.flatMap((_, i) => [
          `materialDetails[${i}].quantity`,
          `materialDetails[${i}].unitPrice`,
          `materialDetails[${i}].totalPrize`,
        ]),
      ];

    //   numericFields.forEach((field) => {
    //     const value = _.get(payload, field);
    //     if (isNaN(value) || typeof value !== "number") {
    //       throw new Error(`Invalid numeric value in field: ${field}`);
    //     }
    //   });

      console.log("Sent Payload:",payload);
      // 5. Submit the request
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${errorText}`);
      }

      const responseData = await response.json();
      if (responseData.responseStatus.statusCode !== 0) {
        throw new Error(
          responseData.responseStatus.message || "Submission failed"
        );
      }

      message.success("Indent submitted successfully!");
      form.resetFields();
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
        if (!response.ok) throw new Error("Failed to fetch materials");

        const data = await response.json();
        if (!data.responseData)
          throw new Error("Invalid material master response");

        // ✅ Extract material codes and details
        const materials = data.responseData;
        setMaterialList(materials.map((mat) => mat.materialCode));

        // ✅ Create a lookup object for quick access
        const materialMap = {};
        materials.forEach((mat) => {
          materialMap[mat.materialCode] = mat;
        });
        setMaterialDetailsMap(materialMap);
      } catch (error) {
        message.error("Error fetching material master data.");
        console.error("Material fetch error:", error);
      }
    };

    fetchMaterials();
  }, []);

  // ✅ When a material is selected, auto-fill the other fields
  const handleMaterialSelect = (index, materialCode) => {
    const materialData = materialDetailsMap[materialCode] || {};
    const lineItems = form.getFieldValue("lineItems") || [];

    //     if (lineItems[index]) {
    //       lineItems[index] = {
    //         ...lineItems[index],
    //         materialCode,
    //         materialDescription: materialData.description || "",
    //         materialCategory: materialData.category || "",
    //         materialSubcategory: materialData.subCategory || "",
    //         uom: materialData.uom || "",
    //       };

    //       form.setFieldsValue({ lineItems });
    //     }
    const updatedItems = [...lineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      materialCode: undefined,
      materialDescription: materialData.description || "",
      materialCategory: materialData.category || "",
      materialSubcategory: materialData.subCategory || "",
      uom: materialData.uom || "",
    };

    form.setFieldsValue({ lineItems: updatedItems });

    const categories = updatedItems
      .map((item) => item?.materialCategory)
      .filter((cat) => cat);

    if (categories.length === 0) return; // No categories selected yet

    const firstCategory = categories[0];
    const allSame = categories.every((cat) => cat === firstCategory);

    if (!allSame) {
      message.error("All materials must be of the same category.");
      updatedItems[index] = {
        ...updatedItems[index],
        materialCode: undefined,
        materialCategory: undefined,
        materialDescription: undefined,
        materialSubcategory: undefined,
        uom: undefined,
      };

      form.setFieldsValue({ lineItems: updatedItems });

      // Show field error
      form.setFields([
        {
          name: ["lineItems", index, "materialCode"],
          errors: ["Category must match first material"],
        },
      ]);
    }
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
              rules={[{ required: true, message: "Indentor ID is required" }]}
            >
              <Space>
                <Input placeholder="Enter Indent ID" />
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
          // Provide default values to prevent undefined issues
          lineItems: [{}],
          preBidMeetingRequired: false,
          rateContractIndent: false,
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
            // rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <TextArea rows={1} defaultValue="Banglore" />
          </Form.Item>

          <Form.Item
            label="Upload Prior Approvals"
            name="uploadingPriorApprovals"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Prior approvals are required" },
            ]}
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
          {/* <Form.Item
            label="Upload Tender Documents"
            name="uploadTenderDocuments"
            valuePropName="fileList"
            getValueFromEvent={normFile} // <--- added
            rules={[
              { required: true, message: "Tender documents are required" },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Tender Documents</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item
            label="Upload Tender Documents"
            name="uploadTenderDocuments"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Tender documents are required" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Tender Documents</Button>
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="preBidMeetingDetails" label="Meeting Details" required={{message:"Enter Date"}}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                  <Input />
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
          {/* <Form.Item
            label="Upload GOI or RFP"
            name="uploadGOIOrRFP"
            valuePropName="fileList"
            getValueFromEvent={normFile} // <--- added
            rules={[{ required: true, message: "GOI or RFP is required" }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload GOI/RFP</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item
            label="Upload GOI or RFP"
            name="uploadGOIOrRFP"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "GOI or RFP is required" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload GOI or RFP</Button>
            </Upload>
          </Form.Item>

          {/* <Form.Item
            label="Upload PAC or Brand PAC"
            name="uploadPACOrBrandPAC"
            valuePropName="fileList"
            getValueFromEvent={normFile} // <--- added
            rules={[
              { required: true, message: "PAC or Brand PAC is required" },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload PAC/Brand PAC</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item
            label="Upload PAC or Brand PAC"
            name="uploadPACOrBrandPAC"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "PAC or Brand PAC is required" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload PAC or Brand</Button>
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
      </Form>
    </div>
  );
};

export default Form1;
