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
import { values } from "lodash";
import LineItem from "../LineItem";

const Form7b = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contingencyId, setContingencyId] = useState("");
  const [projects, setProjects] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});
  const [vendors, setVendors] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);

  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  useEffect(() => {
    const fetchVendors = async () => {
      setVendorLoading(true);
      try {
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/vendor-master"
        );
        const data = await response.json();

        if (
          data.responseStatus.statusCode === 0 &&
          Array.isArray(data.responseData)
        ) {
          setVendors(data.responseData);
        } else {
          message.error("Failed to fetch vendors");
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        message.error("Failed to fetch vendor data");
      } finally {
        setVendorLoading(false);
      }
    };

    fetchVendors();
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
        const getFileList = (fileName) =>
          fileName ? [{ uid: "-1", name: fileName, status: "done" }] : [];
        const formattedData = {
          vendorName: purchase.vendorsName,
          vendorInvoiceNo: purchase.vendorsInvoiceNo,
          date: purchase.date ? dayjs(purchase.date, "DD/MM/YYYY") : undefined,
          remarks: purchase.remarksForPurchase,
          amountToBePaid: purchase.amountToBePaid,
          predefinedPurchaseStatement: purchase.predifinedPurchaseStatement,
          projectDetail: purchase.projectDetail,
          uploadCopyOfInvoice: getFileList(purchase.uploadedFileName),
          lineItems: [
            {
              materialCode: purchase.materialCode,
              materialDescription: purchase.materialDescription,
              quantity: purchase.quantity,
              unitPrice: purchase.unitPrice,
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
  const uploadFileToServer = async (file, fieldName) => {
    try {
      if (!file) return "";
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${fieldName} file is too large. Maximum 5MB allowed.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/file/upload?fileType=CP",
        {
          method: "POST",
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

  // Modified submit function
  const submitContingencyData = async (values) => {
    setLoading(true);
    try {
      const hasInvalidTotal = values.lineItems?.some((item) => {
        const total = item.quantity * item.unitPrice;
        return total > 50000;
      });

      if (hasInvalidTotal) {
        message.error("One or more items exceed the ₹50,000 limit");
        return;
      }
      const lineItem = values.lineItems[0];

      const totalAmount = values.lineItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
      const amountToBePaid = parseFloat(values.amountToBePaid) || 0;

      if (amountToBePaid > totalAmount) {
        message.error("Amount to be paid cannot exceed total amount");
        return;
      }

      // Handle file upload first
      const uploadFile = async (fileList, fieldName) => {
        if (!fileList || fileList.length === 0) return "";
        return uploadFileToServer(fileList[0].originFileObj, fieldName);
      };

      const [uploadedFileName] = await Promise.all([
        uploadFile(values.uploadCopyOfInvoice, "Invoice Copy"),
      ]);

      // Build payload with file name
      const payload = {
        contigencyId: contingencyId || null,
        vendorsName: values.vendorName,
        vendorsInvoiceNo: values.vendorInvoiceNo,
        lineItems: values.lineItems.map((item) => ({
          materialCode: item.materialCode,
          materialDescription: item.materialDescription,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          uom: item.uom,
          budgetCode: item.budgetCode,
          materialCategory: item.materialCategory,
          totalPrice: item.totalPrice,
        })),
        remarksForPurchase: values.remarks,
        amountToBePaid: parseFloat(values.amountToBePaid) || 0,
        predifinedPurchaseStatement: values.predefinedPurchaseStatement || null,
        projectName: values.projectName || null,
        date: values.date?.format("DD/MM/YYYY"),
        createdBy: actionPerformer,
        updatedBy: null,
        uploadCopyOfInvoice: uploadedFileName || "", // Changed field name to match DTO
        fileType: "CP", // Add fileType as per DTO
      };

      // Submit as JSON
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/contigency-purchase",
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
    const updatedItems = [...lineItems];

    updatedItems[index] = {
      ...updatedItems[index],
      materialCode,
      materialDescription: materialData.description || "",
      materialCategory: materialData.category || "",
      materialSubcategory: materialData.subCategory || "",
      uom: materialData.uom || "",
      unitPrice: materialData.unitPrice || 0, // Auto-fill unit rate if available
    };

    form.setFieldsValue({ lineItems: updatedItems });

    // Category validation
    const categories = updatedItems
      .map((item) => item?.materialCategory)
      .filter(Boolean);

    if (categories.length > 0) {
      const firstCategory = categories[0];
      const allSame = categories.every((cat) => cat === firstCategory);

      if (!allSame) {
        message.error("All materials must be of the same category");
        form.setFields([
          {
            name: ["lineItems", index, "materialCode"],
            errors: ["Category must match first item"],
          },
        ]);
      }
    }
  };

  // Calculate total price dynamically
  const updateTotalPrice = (name) => {
    const values = form.getFieldValue(["lineItems", name]);
    if (values?.quantity && values?.unitRate) {
      const total = values.quantity * values.unitRate;

      // Set validation error if total exceeds 50,000
      if (total > 50000) {
        form.setFields([
          {
            name: ["lineItems", name, "totalPrice"],
            errors: ["Total price cannot exceed ₹50,000"],
          },
        ]);
      } else {
        form.setFields([
          {
            name: ["lineItems", name, "totalPrice"],
            errors: [],
          },
        ]);
      }

      form.setFieldValue(["lineItems", name, "totalPrice"], total);
    }
  };

  return (
    <div className="form-container">
      <h2>Contingency Purchase</h2>

      <div className="form-section" style={{ marginBottom: "20px" }}>
        <Row justify="end">
          <Col>
            <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
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
            </Form>
          </Col>
        </Row>
      </div>

      <Form form={form} layout="vertical" onFinish={submitContingencyData}>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.List name="lineItems">
    {(fields) => (
      <LineItem
        form={form}
        materialList={[]} // Pass empty array since materials come from indents
        projects={[]}
        materialDetailsMap={{}}
        // calculateTotalPrice={calculateTotalPrice}
        handlePriceCalculation={(index, field, value) => {
            // Immediately update the changed field
            form.setFieldValue(["lineItems", index, field], value);

            // Get current values directly from form instance
            const quantity = parseFloat(
              form.getFieldValue(["lineItems", index, "quantity"]) || 0
            );
            const unitPrice = parseFloat(
              form.getFieldValue(["lineItems", index, "unitPrice"]) || 0
            );
            const total = quantity * unitPrice;

            // Update total price
            form.setFieldValue(["lineItems", index, "totalPrice"], total);

            // Validation
            if (total > 50000) {
              form.setFields([
                {
                  name: ["lineItems", index, "totalPrice"],
                  errors: ["Total price cannot exceed ₹50,000"],
                },
              ]);
            } else {
              form.setFields([
                {
                  name: ["lineItems", index, "totalPrice"],
                  errors: [],
                },
              ]);
            }
          }}
        showAndRemove={false} // Disable add/remove buttons
        handleMaterialSelect={() => {}} // Empty handlers since materials are read-only
        handleMaterialDescriptionSelect={() => {}}
      />
    )}
  </Form.List>

        <div className="form-section">
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Select
              placeholder="Select Vendor"
              loading={vendorLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {vendors.map((vendor) => (
                <Option key={vendor.vendorId} value={vendor.vendorName}>
                  {vendor.vendorName}
                </Option>
              ))}
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const lineItems = getFieldValue("lineItems") || [];
                  const totalAmount = lineItems.reduce(
                    (sum, item) => sum + (item.totalPrice || 0),
                    0
                  );
                  if (value && parseFloat(value) > totalAmount) {
                    return Promise.reject(
                      "Amount to be paid cannot exceed total amount"
                    );
                  }
                  return Promise.resolve();
                },
              }),
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

          <Form.Item
            label="Purchase statement"
            name="predefinedPurchaseStatement"
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>

        <Form.Item
          name="projectName"
          label="Project Name"
          style={{ width: "32%" }}
          //   rules={[{ required: true, message: "Please enter project detail" }]}
        >
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
