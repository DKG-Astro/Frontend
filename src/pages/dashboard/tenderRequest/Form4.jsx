import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { Option } from "antd/es/mentions";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const Form4 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // For indent data (used in the dropdown)
  const [indentData, setIndentData] = useState([]);
  const [selectedIndentMaterials, setSelectedIndentMaterials] = useState([]);

  // For Tender Search (separate functionality)
  const [searchTenderId, setSearchTenderId] = useState("");
  const [tenderDetails, setTenderDetails] = useState(null);
  const [usedIndentIds, setUsedIndentIds] = useState(new Set());

  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  const [lastValidIndentIds, setLastValidIndentIds] = useState([]);

  const getFileList = (fileName) =>
    fileName ? [{ uid: "-1", name: fileName, status: "done" }] : [];

  // ----------------------------
  // Helper: normFile - ensures file upload events return an array of file objects
  // ----------------------------
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // ----------------------------
  // Fetch Approved Indents and Full Indent Details
  // ----------------------------
  useEffect(() => {
    const fetchApprovedIndents = async () => {
      setLoading(true);
      try {
        // 1. Fetch approved indent IDs
        const responseApproved = await fetch("/astro-service/approved-indents");

        if (!responseApproved.ok) {
          throw new Error(`HTTP error! status: ${responseApproved.status}`);
        }

        const dataApproved = await responseApproved.json();

        // Check if response has the expected structure
        if (!Array.isArray(dataApproved.responseData)) {
          throw new Error("Approved indents API returned unexpected format");
        }

        const approvedIndentIds = dataApproved.responseData;

        // 2. Fetch all indents
        const responseIndents = await fetch("/astro-service/api/indents");

        if (!responseIndents.ok) {
          throw new Error(`HTTP error! status: ${responseIndents.status}`);
        }

        const data = await responseIndents.json();

        // 3. Process data
        if (
          data.responseStatus.statusCode === 0 &&
          Array.isArray(data.responseData)
        ) {
          const filteredIndents = data.responseData.filter(
            (indent) => approvedIndentIds.includes(indent.indentId?.toString()) // Handle possible null/undefined
          );
          setIndentData(filteredIndents);
        } else {
          message.error("Failed to fetch indent details");
        }
      } catch (error) {
        console.error("Error fetching indents:", error);
        message.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedIndents();
  }, []);

  // ----------------------------
  // Format a material object for Form.List
  // ----------------------------
  const formatMaterial = (material) => ({
    materialCode: material.materialCode,
    materialDescription: material.materialDescription,
    quantity: material.quantity,
    unitPrice: material.unitPrice,
    uom: material.uom,
    budgetCode: material.budgetCode,
    totalPrice: material.totalPrice,
    materialCategory: material.materialCategory,
    materialSubCategory: material.materialSubCategory,
  });

  // ----------------------------
  // Indent selection handler: fetch and set line items from selected indent(s)
  // ----------------------------
  const handleIndentChange = (selectedIndentIds) => {
    // Get projects for all selected indents
    const selectedProjects = selectedIndentIds.map((id) => {
      const indent = indentData.find(
        (item) => item.indentId.toString() === id.toString()
      );
      return indent?.projectName; // Ensure your API returns projectName for indents
    });

    // Check if all projects are the same
    const allSameProject = selectedProjects.every(
      (project, _, arr) => project === arr[0] && project !== undefined
    );

    if (!allSameProject && selectedIndentIds.length > 0) {
      message.error("All selected indents must belong to the same project");
      // Revert to last valid selection
      form.setFieldsValue({ indentId: lastValidIndentIds });
      return;
    }

    // Update valid selection if projects match
    setLastValidIndentIds(selectedIndentIds);

    // Existing material handling code
    let newMaterials = [];
    selectedIndentIds.forEach((indentId) => {
      const indent = indentData.find(
        (item) => item.indentId.toString() === indentId.toString()
      );
      if (indent && Array.isArray(indent.materialDetails)) {
        newMaterials = [...newMaterials, ...indent.materialDetails];
      }
    });

    setSelectedIndentMaterials(newMaterials);
    form.setFieldsValue({
      lineItems: newMaterials.map(formatMaterial),
    });
  };

  // ----------------------------
  // Price calculation for line items
  // ----------------------------
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
      updatedItems[index] = { ...updatedItems[index], totalPrice };
      form.setFieldsValue({ lineItems: updatedItems });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all tenders to get used indent IDs
        const tenderResponse = await fetch(
          "/astro-service/api/tender-requests"
        );
        const tenderData = await tenderResponse.json();

        // Extract all indent IDs from all tenders
        const allUsedIndents = tenderData.responseData.flatMap(
          (tender) => tender.indentIds?.map(String) || []
        );
        setUsedIndentIds(new Set(allUsedIndents));

        // 2. Fetch approved indents
        const approvedResponse = await fetch(
          "http://103.181.158.220:8081/astro-service/approved-indents"
        );
        const approvedData = await approvedResponse.json();

        // 3. Fetch all indents
        const indentsResponse = await fetch("/astro-service/api/indents");
        const indentsData = await indentsResponse.json();

        // 4. Filter indents
        const filtered = indentsData.responseData.filter((indent) => {
          const isApproved = approvedData.responseData.includes(
            indent.indentId?.toString()
          );
          const isUnused = !usedIndentIds.has(indent.indentId?.toString());
          return isApproved && isUnused;
        });

        setIndentData(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load indents");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ----------------------------
  // Tender Search Functionality
  // ----------------------------
  const tenderSearch = async () => {
    const tenderId = form.getFieldValue("tenderId");
    if (!tenderId) {
      message.error("Please enter a Tender ID");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/astro-service/api/tender-requests/${tenderId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tender: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.responseData) {
        throw new Error("Invalid API response: responseData is missing");
      }

      const responseData = data.responseData;

      // Updated mapping: keys here match the form field names
      const formData = {
        tenderId: responseData.tenderId || "",
        title: responseData.titleOfTender || "",
        openingDate: responseData.openingDate
          ? dayjs(responseData.openingDate, "DD/MM/YYYY")
          : null,
        closingDate: responseData.closingDate
          ? dayjs(responseData.closingDate, "DD/MM/YYYY")
          : null,
        tenderUpload: getFileList(responseData.uploadTenderDocuments),
        "generalTerms&Conditions": getFileList(
          responseData.uploadGeneralTermsAndConditions
        ),
        "specificTerms&Conditions": getFileList(
          responseData.uploadSpecificTermsAndConditions
        ),
        lastDate: responseData.lastDateOfSubmission
          ? dayjs(responseData.lastDateOfSubmission, "DD/MM/YYYY")
          : null,
        applicableTaxes: responseData.applicableTaxes || "",
        consignesAndBillinngAddress:
          responseData.consignesAndBillinngAddress || "",
        incoTerms: responseData.incoTerms || "",
        paymentTerms: responseData.paymentTerms || "",
        ldClause: responseData.ldClause || "",
        applicablePerformance: responseData.applicablePerformance || "",
        bidType: responseData.bidType || "",
        bidSecurity: responseData.bidSecurityDeclaration ? true : false,
        mllStatusDeclaration: responseData.mllStatusDeclaration ? true : false,
      };

      // If indentResponseDTO exists, populate indentId and merge line items
      // Inside the tenderSearch function
      if (
        responseData.indentResponseDTO &&
        Array.isArray(responseData.indentResponseDTO)
      ) {
        const indentIds = responseData.indentResponseDTO.map(
          (indent) => indent.indentId
        );

        let allMaterials = [];
        responseData.indentResponseDTO.forEach((indent) => {
          if (indent.materialDetails && Array.isArray(indent.materialDetails)) {
            allMaterials = [...allMaterials, ...indent.materialDetails];
          }
        });

        // Remove the de-duplication filter
        formData.indentId = indentIds;
        formData.lineItems = allMaterials.map(formatMaterial); // Directly assign all materials
      }

      // Set the fetched data into the form
      form.setFieldsValue(formData);
      message.success("Tender data fetched successfully");
    } catch (error) {
      message.error(`Failed to fetch tender: ${error.message}`);
      console.error("Error fetching tender data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Form Submission & Save Draft - Handling file uploads via FormData

  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/astro-service/file/upload?fileType=Tender",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      return data.responseData.fileName; // Return the uploaded filename
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };
  // ----------------------------
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate project consistency
      if (values.indentId?.length > 0) {
        const projects = values.indentId.map((id) => {
          const indent = indentData.find(
            (item) => item.indentId.toString() === id.toString()
          );
          return indent?.projectName;
        });

        const firstProject = projects[0];
        const allSame = projects.every((project) => project === firstProject);

        if (!allSame) {
          message.error(
            "Submission failed: Indents must belong to the same project"
          );
          return;
        }
      }

      // Upload files and get their names
      const uploadFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return "";
        try {
          return await uploadFileToServer(fileList[0].originFileObj);
        } catch (error) {
          message.error(`File upload failed: ${error.message}`);
          throw error;
        }
      };

      // Upload all files in parallel
      const [
        uploadTenderDocuments,
        uploadGeneralTermsAndConditions,
        uploadSpecificTermsAndConditions,
      ] = await Promise.all([
        uploadFiles(values.tenderUpload),
        uploadFiles(values["generalTerms&Conditions"]),
        uploadFiles(values["specificTerms&Conditions"]),
      ]);

      // Prepare the payload with uploaded file names
      const formatDate = (date) => (date ? date.format("DD/MM/YYYY") : null);

      // Prepare the Payload
      const payload = {
        tenderId: values.tenderId || null,
        titleOfTender: values.title?.trim() || null,
        openingDate: formatDate(values.openingDate),
        closingDate: formatDate(values.closingDate),
        modeOfProcurement: values.modeOfProcurement?.trim() || null,
        bidType: values.bidType || null,
        lastDateOfSubmission: formatDate(values.lastDate),
        applicableTaxes: values.applicableTaxes || null,
        fileType: "Tender",
        consignesAndBillinngAddress:
          values.consignesAndBillinngAddress?.trim() || null,
        incoTerms: values.incoTerms?.trim() || null,
        paymentTerms: values.paymentTerms?.trim() || null,
        ldClause: values.ldClause?.trim() || null,
        applicablePerformance: values.applicablePerformance?.trim() || null,
        bidSecurityDeclaration: values.bidSecurity || false,
        mllStatusDeclaration: values.mllStatusDeclaration || false,
        singleAndMultipleVendors:
          values.singleAndMultipleVendors?.trim() || null,
        preBidDisscussions: values.preBidDisscussions?.trim() || null,
        totalTenderValue: values.totalTenderValue
          ? parseFloat(values.totalTenderValue)
          : 0,
        uploadTenderDocuments: uploadTenderDocuments || null,
        uploadGeneralTermsAndConditions:
          uploadGeneralTermsAndConditions || null,
        uploadSpecificTermsAndConditions:
          uploadSpecificTermsAndConditions || null,
        updatedBy: null,
        createdBy: actionPerformer,
        indentIds: Array.isArray(values.indentId) ? values.indentId : [],
        materialDetails:
          values.lineItems?.map((item) => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            uom: item.uom,
            totalPrize: item.totalPrice,
            budgetCode: item.budgetCode,
            materialCategory: item.materialCategory,
            materialSubCategory: item.materialSubCategory,
          })) || [],
      };

      // Create FormData
      const response = await fetch("/astro-service/api/tender-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${errorText}`);
      }

      const result = await response.json();
      message.success("Tender submitted successfully");
      console.log("API Response:", result);
      form.resetFields();
      setSearchTenderId("");
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    try {
      const currentValues = await form.validateFields();
      localStorage.setItem("tenderDraft", JSON.stringify(currentValues));
      message.success("Draft saved successfully");
    } catch (error) {
      message.error("Failed to save draft");
    }
  };

  return (
    <div className="form-container">
      {/* Header with Tender Search */}
      {tenderDetails && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Tender Details</h3>
          <pre>{JSON.stringify(tenderDetails, null, 2)}</pre>
        </div>
      )}

      <h2>Tender Request</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.log("Validation Failed:", errorInfo);
          message.error("Please fix the validation errors before submitting.");
        }}
        layout="vertical"
      >
        <Form.Item name="tenderId">
          <Row justify="end" style={{ marginBottom: "20px" }}>
            <Col>
              <Input
                placeholder="Enter Tender ID"
                value={searchTenderId}
                onChange={(e) => setSearchTenderId(e.target.value)}
                style={{ width: 200, marginRight: "10px" }}
              />
              <Button type="primary" onClick={tenderSearch}>
                <SearchOutlined />
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <div className="form-section">
          <Form.Item
            name="title"
            label="Title of the Tender"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="openingDate"
            label="Opening Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="closingDate"
            label="Closing Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
        </div>

        {/* Indent dropdown with onChange to fetch line items */}
        <Form.Item name="indentId" label="Indent ID">
          <Select
            placeholder="Select Indent"
            loading={loading}
            mode="multiple"
            allowClear
            onChange={handleIndentChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {indentData.map((indent) => (
              <Option
                key={indent.indentId}
                value={indent.indentId}
                disabled={usedIndentIds.has(indent.indentId?.toString())}
              >
                {indent.indentId} - {indent.projectName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="form-section">
          {/* Form.List for line items */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Form.List name="lineItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        width: "100%",
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialCode"]}
                            label="Material Code"
                          >
                            <Input placeholder="Auto-filled" disabled />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialDescription"]}
                            label="Material Description"
                          >
                            <Input placeholder="Auto-filled" disabled />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            label="Quantity"
                          >
                            <Input
                              type="number"
                              placeholder="Enter Quantity"
                              onBlur={(e) =>
                                handlePriceCalculation(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "unitPrice"]}
                            label="Unit Price"
                          >
                            <Input
                              type="number"
                              placeholder="Enter Unit Price"
                              onBlur={(e) =>
                                handlePriceCalculation(
                                  index,
                                  "unitPrice",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "uom"]}
                            label="UOM"
                          >
                            <Input placeholder="Auto-filled" disabled />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "budgetCode"]}
                            label="Budget Code"
                          >
                            <Input placeholder="Auto-filled" disabled />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "totalPrice"]}
                            label="Total Price"
                          >
                            <Input placeholder="Auto-calculated" disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                    </div>
                  ))}
                  {/* <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: "32%" }}
                    >
                      Add Item
                    </Button>
                  </Form.Item> */}
                </>
              )}
            </Form.List>
          </div>
        </div>

        {/* Upload fields */}
        <div className="form-section">
          <Form.Item
            name="tenderUpload"
            label="Tender Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Tender documents are required" },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Tender Documents</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="generalTerms&Conditions"
            label="General Terms & Conditions"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "General T&C is required" }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload General T&C</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="specificTerms&Conditions"
            label="Specific Terms & Conditions"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Specific T&C is required" }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Specific T&C</Button>
            </Upload>
          </Form.Item>
        </div>

        {/* Remaining form fields */}
        <div className="form-section">
          <Form.Item
            name="bidType"
            label="Bid Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Single">Single</Option>
              <Option value="Two">Double</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="lastDate"
            label="Last Date of Submission"
            rules={[
              {
                required: true,
                message: "Please select the last date of submission",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="applicableTaxes"
            label="Applicable Taxes"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="consignesAndBillinngAddress"
            label="Consignees and Billing Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            name="incoTerms"
            label="INCO Terms"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            name="paymentTerms"
            label="Payment Terms"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            name="ldClause"
            label="LD Clause"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            name="applicablePerformance"
            label="Applicable Performance"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item name="bidSecurity" label="Bid Security Declaration">
            <Checkbox>Yes</Checkbox>
          </Form.Item>
          <Form.Item name="mllStatusDeclaration" label="MLL Status Declaration">
            <Checkbox>Yes</Checkbox>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="default" htmlType="reset">
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
              <Button type="dashed" htmlType="button" onClick={saveDraft}>
                Save Draft
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Form4;
