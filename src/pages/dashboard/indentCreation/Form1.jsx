import React, { useEffect, useState } from "react";
import {Form,Input,Select,Button,Upload,DatePicker,Checkbox,Space,Row,Col,message,} from "antd";
import {MinusCircleOutlined,PlusOutlined,UploadOutlined,SearchOutlined,} from "@ant-design/icons";
// import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Ensure line items have valid data
      const materialDetails = (values.lineItems || [])
        .filter((item) => item.materialCode) // Remove empty line items
        .map((item) => ({
          materialCode: item.materialCode,
          materialDescription: item.materialDescription || "",
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          uom: item.uom || "",
          totalPrize: parseFloat(item.totalPrice) || 0,
          budgetCode: item.budgetCode || "",
          materialCategory: item.materialCategory || "",
          materialSubCategory: item.materialSubcategory || "",
          materialAndJob: item.materialOrJobCodeUsedByDept || "",
        }));

      if (materialDetails.length === 0) {
        message.error("At least one valid line item is required");
        setLoading(false);
        return;
      }

      const payload = {
        indentorName: values.indentorName,
        indentId: values.indentId,
        indentorMobileNo: values.indentorMobileNo,
        indentorEmailAddress: values.indentorEmail,
        consignesLocation: values.consigneeLocation || "Banglore" || null,

        uploadingPriorApprovalsFileName:
          values.uploadingPriorApprovals?.[0]?.name || "",
        uploadTenderDocumentsFileName:
          values.uploadTenderDocuments?.[0]?.name || "",
        uploadGOIOrRFPFileName: values.uploadGOIOrRFP?.[0]?.name || "",
        uploadPACOrBrandPACFileName:
          values.uploadPACOrBrandPAC?.[0]?.name || "",

        projectName: values.projectName || null,
        isPreBidMeetingRequired: !!values.preBidMeetingRequired,
        preBidMeetingDetails:
          values.preBidMeetingRequired && values.preBidMeetingDetails?.[0]
            ? dayjs(values.preBidMeetingDetails[0]).format("DD/MM/YYYY")
            : null,

        preBidMeetingVenue: values.preBidMeetingLocation || "",

        isItARateContractIndent: !!values.rateContractIndent,
        estimatedRate: parseFloat(values.estimatedRate) || 0,
        periodOfContract: parseFloat(values.periodOfRateContract) || 0,
        singleAndMultipleJob: values.singleOrMultipleJob || "",

        materialCategory: materialDetails[0].materialCategory,
        totalPriceOfAllMaterials: materialDetails.reduce(
          (sum, item) => sum + item.totalPrize,
          0
        ),

        materialDetails: materialDetails,

        createdBy: actionPerformer,
        updatedBy: null,
      };

      // Ensure payload is a proper JSON object
      const payloadJson = JSON.stringify(payload);
      console.log("Payload JSON:", payloadJson);

      const formData = new FormData();
      formData.append("indentRequestDto", payloadJson);

      // Limit file sizes and types
      const fileFields = [
        "uploadingPriorApprovals",
        "uploadTenderDocuments",
        "uploadGOIOrRFP",
        "uploadPACOrBrandPAC",
      ];

      fileFields.forEach((field) => {
        const files = values[field];
        if (files && files.length > 0) {
          const file = files[0].originFileObj;
          // Validate file size (e.g., max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            message.error(`${field} file is too large. Maximum 5MB allowed.`);
            throw new Error(`File too large: ${field}`);
          }
          formData.append(field, file);
        }
      });

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/indents",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full Error Response:", errorText);
        throw new Error(`Submission failed: ${response.status}`);
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

    if (lineItems[index]) {
      lineItems[index] = {
        ...lineItems[index],
        materialCode,
        materialDescription: materialData.description || "",
        materialCategory: materialData.category || "",
        materialSubcategory: materialData.subCategory || "",
        uom: materialData.uom || "",
      };

      form.setFieldsValue({ lineItems });
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
            <TextArea rows={1} placeholder="Banglore" />
          </Form.Item>

          <Form.Item
            label="Upload Prior Approvals"
            name="uploadingPriorApprovals"
            valuePropName="fileList"
            getValueFromEvent={normFile} // <--- added
            rules={[
              { required: true, message: "Prior approvals are required" },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Prior Approvals</Button>
            </Upload>
          </Form.Item>
        </div>

        <div>
          <Form.List name="lineItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Space
                      style={{
                        display: "flex",
                        marginBottom: 20,
                        flexWrap: "wrap",
                      }}
                      align="start"
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name={[name, "materialCode"]}
                            label="Material Code"
                            rules={[
                              {
                                required: true,
                                message: "Please select a material code!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select Material Code"
                              onChange={(value) =>
                                handleMaterialSelect(index, value)
                              }
                            >
                              {materialList.map((code) => (
                                <Option key={code} value={code}>
                                  {code}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialDescription"]}
                            label="Material Description"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please select a material description!",
                              },
                            ]}
                          >
                            <Select placeholder="Select Material Description">
                              <Option value="Description 1">
                                Description 1
                              </Option>
                              <Option value="Description 2">
                                Description 2
                              </Option>
                              <Option value="Description 3">
                                Description 3
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            label="Quantity"
                            rules={[
                              {
                                required: true,
                                message: "Please enter quantity!",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              placeholder="Enter Quantity"
                              onChange={(e) =>
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
                            rules={[
                              {
                                required: true,
                                message: "Please enter unit price!",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              placeholder="Enter Unit Price"
                              onChange={(e) =>
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
                            rules={[
                              { required: true, message: "Please select UOM!" },
                            ]}
                          >
                            <Select placeholder="Select UOM">
                              <Option value="Kg">Kg</Option>
                              <Option value="Litre">Litre</Option>
                              <Option value="Unit">Unit</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "budgetCode"]}
                            label="Budget Code"
                            rules={[
                              {
                                required: true,
                                message: "Please select a budget code!",
                              },
                            ]}
                          >
                            <Select placeholder="Select Budget Code">
                            {projects.map((project) => (
                            <Option key={project.projectCode} value={project.projectCode}>
                                {project.budgetType}
                            </Option>
                            ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialCategory"]}
                            label="Material Category"
                            rules={[
                              {
                                required: true,
                                message: "Please enter material category!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Material Category" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialSubcategory"]}
                            label="Material Subcategory"
                            rules={[
                              {
                                required: true,
                                message: "Please enter material subcategory!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Material Subcategory" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "totalPrice"]}
                            label="Total Price"
                            shouldUpdate
                          >
                            <Input placeholder="Auto-calculated" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialOrJobCodeUsedByDept"]}
                            label="Material/Job Code Used By Dept"
                            style={{ width: "100%" }}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "32%" }}
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <div className="form-section">
          <Form.Item name="projectName" label="Project Name">
            <Select placeholder="Select project" loading={loading} allowClear>
                {projects.map((project) => (
                  <Option key={project.projectCode} value={project.projectCode}>
                    {project.projectNameDescription}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
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
                <Form.Item
                  name="preBidMeetingDetails"
                  label="Pre-bid Meeting Details"
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Pre Bid Meeting Location"
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
            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
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
              <Col span={12}>
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
            label="Upload GOI or RFP"
            name="uploadGOIOrRFP"
            valuePropName="fileList"
            getValueFromEvent={normFile} // <--- added
            rules={[{ required: true, message: "GOI or RFP is required" }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload GOI/RFP</Button>
            </Upload>
          </Form.Item>

          <Form.Item
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
