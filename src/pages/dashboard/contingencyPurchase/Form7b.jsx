import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import {
    DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const Form7b = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contingencyId, setContingencyId] = useState("");
  const [projects, setProjects] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});

  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

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

  const fetchContingencyData = async () => {
    if (!contingencyId) {
      message.warning("Please enter a Contingency ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/contigency-purchase/${contingencyId}`
      );
      const data = await response.json();

      if (data.responseData) {
        const purchase = data.responseData;
        const formattedData = {
          vendorName: purchase.vendorsName,
          vendorInvoiceNo: purchase.vendorsInvoiceNo,
          date: purchase.date ? dayjs(purchase.date, "DD/MM/YYYY") : undefined,
          remarks: purchase.remarksForPurchase,
          amountToBePaid: purchase.amountToBePaid,
          predefinedPurchaseStatement: purchase.predifinedPurchaseStatement,
          projectDetail: purchase.projectDetail,
          lineItems: [
            {
              materialCode: purchase.materialCode,
              materialDescription: purchase.materialDescription,
              quantity: purchase.quantity,
              unitRate: purchase.unitPrice,
              totalPrice: purchase.quantity * purchase.unitPrice,
            },
          ],
        };
        form.setFieldsValue(formattedData);
        message.success("Contingency data fetched successfully!");
      } else {
        message.error("No contingency purchase found with this ID.");
      }
    } catch (error) {
      console.error("Error fetching contingency data:", error);
      message.error("Failed to fetch contingency data.");
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

  // Submit contingency purchase data
  // Add this utility function at the top of your file
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Modified submit function
  const submitContingencyData = async (values) => {
    setLoading(true);
    try {
      const lineItem = values.lineItems[0];

      // 1. Create FormData instance
      const formData = new FormData();

      // 2. Build JSON payload with corrected field names
      const payload = {
        contigencyId: contingencyId || null, // Note spelling (missing 'n' in contingency)
        vendorsName: values.vendorName,
        vendorsInvoiceNo: values.vendorInvoiceNo,
        materialCode: lineItem.materialCode,
        materialDescription: lineItem.materialDescription,
        quantity: parseFloat(lineItem.quantity) || 0,
        unitPrice: parseFloat(lineItem.unitRate) || 0,
        remarksForPurchase: values.remarks,
        amountToBePaid: parseFloat(values.amountToBePaid) || 0,
        predifinedPurchaseStatement: values.predefinedPurchaseStatement, // Note spelling
        projectName: values.projectName,
        date: values.date?.format("DD/MM/YYYY"),
        createdBy: actionPerformer,
        updatedBy: null,
      };

      // 3. Handle file upload
      const uploadCopyOfInvoice = form.getFieldValue("uploadCopyOfInvoice")?.[0]
        ?.originFileObj;
      if (uploadCopyOfInvoice) {
        formData.append("uploadCopyOfInvoice", uploadCopyOfInvoice);
      }

      // 4. Append JSON payload with EXACT name the backend expects
      formData.append("contigencyPurchaseDto", JSON.stringify(payload));

      // 5. Send request
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/contigency-purchase",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.responseStatus?.message || "Submission failed"
        );
      }

      message.success("Contingency submitted successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  // Calculate total price dynamically
  const updateTotalPrice = (name) => {
    const values = form.getFieldValue(["lineItems", name]);
    if (values?.quantity && values?.unitRate) {
      const total = values.quantity * values.unitRate;
      form.setFieldValue(["lineItems", name, "totalPrice"], total);
    }
  };

  return (
    <div className="form-container">
      <h2>Contingency Purchase</h2>

      <div className="form-section" style={{ marginBottom: "20px" }}>
        <Row justify="end">
          <Col>
            <Form.Item label="Contingency ID">
              <Input
                placeholder="Enter Contingency ID"
                value={contingencyId}
                onChange={(e) => setContingencyId(e.target.value)}
                style={{ width: "200px", marginRight: "10px" }}
              />
              <Button
                type="primary"
                onClick={() => fetchContingencyData(contingencyId)}
                disabled={!contingencyId}
              >
                <SearchOutlined />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Form form={form} layout="vertical" onFinish={submitContingencyData}>
        <div className="form-section">
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Select placeholder="Select Vendor ID">
              <Option value="ABC">ABC</Option>
              <Option value="ABC V">ABC V</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vendor Invoice No."
            name="vendorInvoiceNo"
            rules={[
              { required: true, message: "Please enter vendor invoice number" },
            ]}
          >
            <Input placeholder="Enter Vendor Invoice No." />
          </Form.Item>
        </div>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.List name="lineItems" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    paddingBottom: "5px",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                >
                  <DeleteOutlined
                    onClick={() => remove(name)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <Space
                    style={{
                      display: "flex",
                      marginBottom: "10px",
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
                              handleMaterialSelect(name, value)
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
                              message: "Please enter material description",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Material Description" />
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
                              message: "Please enter quantity",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter Quantity"
                            onChange={() => updateTotalPrice(name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "unitRate"]}
                          label="Unit Rate"
                          rules={[
                            {
                              required: true,
                              message: "Please enter unit rate",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter unit rate"
                            onChange={() => updateTotalPrice(name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "totalPrice"]}
                          label="Total Price"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
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

        <div className="form-section">
          <Form.Item
            label="Remarks for purchase"
            name="remarks"
            rules={[{ required: true, message: "Please enter remarks" }]}
          >
            <Input.TextArea placeholder="Enter remarks for purchase" rows={1} />
          </Form.Item>

          <Form.Item
            label="Amount to be paid"
            name="amountToBePaid"
            rules={[
              { required: true, message: "Please enter amount to be paid" },
            ]}
          >
            <Input
              placeholder="Enter amount to be paid"
              type="number"
              step="0.01"
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            name="uploadCopyOfInvoice"
            label="Upload copy of Invoice"
            rules={[{ required: true }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Invoice Copy</Button>
            </Upload>
          </Form.Item>
          {/* <Form.Item
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
                    </Form.Item> */}

          <Form.Item
            label="Predefined purchase statement"
            name="predefinedPurchaseStatement"
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>

        <Form.Item
          name="projectName"
          label="Project Name"
          style={{ width: "32%" }}
          rules={[{ required: true, message: "Please enter project detail" }]}
        >
          <Select placeholder="Select project" loading={loading} allowClear>
            {projects.map((project) => (
              <Option key={project.projectCode} value={project.projectCode}>
                {project.projectNameDescription}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="form-section">
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
      </Form>
    </div>
  );
};

export default Form7b;
