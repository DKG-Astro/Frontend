import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";

// Option can be destructured from Select for cleaner code
const { Option } = Select;

const Form7 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tenders, setTenders] = useState([]); // Store Tender IDs
  const [selectedIndentId, setSelectedIndentId] = useState(""); // Store Indent ID
  const [materialDetails, setMaterialDetails] = useState([]); // Store Material Details
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  // **1. Fetch All Tender IDs**
  useEffect(() => {
    const fetchTenderIds = async () => {
      try {
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/tender-requests"
        );
        const data = await response.json();

        if (data.responseData) {
          setTenders(data.responseData);
        } else {
          message.error("Failed to fetch Tender IDs");
        }
      } catch (error) {
        console.error("Error fetching Tender IDs:", error);
        message.error("Error fetching Tender IDs");
      }
    };

    fetchTenderIds();
  }, []);

  const handlePOSearch = async (poId) => {
    if (!poId) {
      message.warning("Please enter a PO ID");
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/purchase-orders/${poId}`
      );
      const data = await response.json();

      if (!data.responseData) {
        message.warning("No purchase order found for this PO ID");
        form.resetFields();
        return;
      }

      // **Extract PO Data & Related Indent ID**
      const poDetails = data.responseData;
      setSelectedIndentId(poDetails.indentId);

      // **Pre-fill PO form fields**
      form.setFieldsValue({
        tenderID: poDetails.tenderId,
        indentID: poDetails.indentId,
        consigneeAddress: poDetails.consignesAddress,
        billingAddress: poDetails.billingAddress,
        deliveryPeriod: poDetails.deliveryPeriod,
        warranty: poDetails.warranty,
        ifLDClauseApplicable: poDetails.ifLdClauseApplicable,
        incoTerms: poDetails.incoTerms,
        paymentTerms: poDetails.paymentTerms,
        vendorName: poDetails.vendorName,
        vendorAddress: poDetails.vendorAddress,
        applicablePBG: poDetails.applicablePbgToBeSubmitted,
        transporterDetails: poDetails.transporterAndFreightForWarderDetails,
        vendorAccountNo: poDetails.vendorAccountNumber,
        vendorIFSCCode: poDetails.vendorsZfscCode,
        vendorAccountName: poDetails.vendorAccountName,
      });

      // **Fetch Material Details from Indent ID**
      fetchMaterialDetails(poDetails.indentId);
    } catch (error) {
      message.error("Failed to fetch PO data");
      console.error("Error fetching data:", error);
    } finally {
      setSearching(false);
    }
  };

  // **2. Handle Tender Selection & Fetch Material Details**
  const handleTenderSelect = async (tenderId) => {
    setSelectedIndentId("");
    setMaterialDetails([]);
    form.resetFields(["lineItems"]);

    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/tender-requests/${tenderId}`
      );
      const data = await response.json();

      if (!data.responseData) {
        message.error("No Tender data found");
        return;
      }

      // **Extract First Indent ID**
      const indentData = data.responseData.indentResponseDTO[0];
      if (!indentData) {
        message.error("No Indent ID found for this Tender");
        return;
      }

      setSelectedIndentId(indentData.indentId); // Store Indent ID

      // **Pre-fill form fields with Tender Data**
      form.setFieldsValue({
        incoTerms: data.responseData.incoTerms,
        paymentTerms: data.responseData.paymentTerms,
        ifLDClauseApplicable: data.responseData.ldClause,
        applicablePBG: data.responseData.applicablePerformance,
      });

      // **Fetch Material Details using Indent ID**
      fetchMaterialDetails(indentData.indentId);
    } catch (error) {
      console.error("Error fetching Tender details:", error);
      message.error("Error fetching Tender details");
    }
  };

  // **3. Fetch Material Details from Indent API**
  const fetchMaterialDetails = async (indentId) => {
    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/indents/${indentId}`
      );
      const data = await response.json();

      if (!data.responseData || !data.responseData.materialDetails) {
        message.error("No Material Details found");
        return;
      }

      const formattedMaterials = data.responseData.materialDetails.map((item, index) => ({
        key: index,
        materialCode: item.materialCode,
        materialDescription: item.materialDescription,
        quantity: item.quantity,
        unitRate: item.unitPrice,
        uom: item.uom,
        totalPrice: item.totalPrize,
      }));

      setMaterialDetails(formattedMaterials); // Store Material Data
      form.setFieldsValue({ lineItems: formattedMaterials });

      message.success(`Loaded materials for Indent ID: ${indentId}`);
    } catch (error) {
      console.error("Error fetching Material Details:", error);
      message.error("Error fetching Material Details");
    }
  };  
  // Function to handle form submission
  const submitPOData = async (values) => {
    setLoading(true);
    try {
      const updatedLineItems = values.lineItems.map((item) => ({
        materialCode: item.materialCode,
        materialDescription: item.materialDescription,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.unitRate) || 0,
        currency: item.currency || "INR",
        exchangeRate: parseFloat(item.exchangeRate) || 1,
        gst: parseFloat(item.gst) || 0,
        duties: parseFloat(item.duties) || 0,
        freightCharge: parseFloat(item.freightCharges) || 0,
      }));
  
      const payload = {
        poId: values.poId,
        tenderId: values.tenderID,
        indentId: selectedIndentId,
        consignesAddress: values.consigneeAddress,
        billingAddress: values.billingAddress,
        deliveryPeriod: parseFloat(values.deliveryPeriod) || 0,
        warranty: parseFloat(values.warranty) || 0,
        ifLdClauseApplicable: !!values.ifLDClauseApplicable, // Ensure boolean
        incoterms: values.incoTerms,
        paymentterms: values.paymentTerms,
        vendorName: values.vendorName,
        vendorAddress: values.vendorAddress,
        applicablePbgToBeSubmitted: values.applicablePBG,
        transposterAndFreightForWarderDetails: values.transporterDetails,
        vendorAccountNumber: values.vendorAccountNo,
        vendorsZfscCode: values.vendorZFSCCode,
        vendorAccountName: values.vendorAccountName,
        purchaseOrderAttributes: updatedLineItems,
        createdBy: actionPerformer,
        updatedBy: null,
      };
  
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/purchase-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Explicit JSON content type
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.responseStatus?.message || "Submission failed");
      }
  
      message.success("PO submitted successfully");
      form.resetFields();
    } catch (error) {
      message.error(`Failed to submit PO: ${error.message}`);
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Purchase Order (PO)</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={submitPOData}
        initialValues={{ date: null }}
      >
      <Row justify="end">
        <Col>
          {/* The PO ID field uses an Input.Search component.
              When the user presses Enter or clicks the search icon,
              the entered PO ID is passed to handleTenderSearch. */}
          <Form.Item
            label="PO ID"
            name="poId"  // Changed from "poID" to "poId"
            rules={[{ required: true, message: "Please enter PO ID" }]}
            >
            <Input.Search
                placeholder="Enter PO ID"
                onSearch={handlePOSearch}
                enterButton={<SearchOutlined />}
                loading={searching}
            />
        </Form.Item>
        </Col>
      </Row>
        <div className="form-section">
            <Form.Item
              label="Tender ID"
              name="tenderID"
              rules={[{ required: true, message: "Please select a Tender ID" }]}
            >
              <Select
                placeholder="Select a Tender ID"
                onChange={handleTenderSelect}
                showSearch
              >
                {tenders.map((tender) => (
                  <Option key={tender.tenderId} value={tender.tenderId}>
                    {tender.tenderId} - {tender.titleOfTender}
                  </Option>
                ))}
              </Select>
            </Form.Item>

          {/* Consignee Address */}
          <Form.Item label="Consignee Address" name="consigneeAddress">
            <TextArea rows={1} placeholder="Enter consignee address" />
          </Form.Item>

          {/* Billing Address */}
          <Form.Item
            label="Billing Address"
            name="billingAddress"
            rules={[{ required: true, message: "Please enter billing address" }]}
          >
            <TextArea rows={1} placeholder="Enter billing address" />
          </Form.Item>

          {/* Delivery Period */}
          <Form.Item
            label="Delivery Period"
            name="deliveryPeriod"
            rules={[{ required: true, message: "Please specify the delivery period" }]}
          >
            <Input type="number" placeholder="Enter delivery period" />
          </Form.Item>
        </div>
        <div>
          <Form.List name="lineItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      marginBottom: "5px",
                    }}
                  >
                    <Space
                      style={{
                        display: "flex",
                        marginBottom: 5,
                        flexWrap: "wrap",
                      }}
                      align="start"
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          {/* Note: When using Form.List, use an array for the name */}
                          <Form.Item
                            {...restField}
                            name={[name, "materialCode"]}
                            label="Material Code"
                            rules={[
                              {
                                required: true,
                                message: "Please select a material code!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Material Code" />
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
                                message: "Please enter a material description!",
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
                              { required: true, message: "Please enter quantity!" },
                            ]}
                          >
                            <Input type="number" placeholder="Enter Quantity" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "unitRate"]}
                            label="Unit Rate"
                            rules={[
                              { required: true, message: "Please enter the unit rate" },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter unit rate"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "currency"]}
                            label="Currency"
                            rules={[
                              { required: true, message: "Please select a currency" },
                            ]}
                          >
                            <Select placeholder="Select currency">
                              <Option value="USD">USD</Option>
                              <Option value="INR">INR</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "exchangeRate"]}
                            label="Exchange Rate"
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter exchange rate"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "gst"]}
                            label="GST (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please specify GST percentage",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter GST percentage"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "duties"]}
                            label="Duties (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please specify duties",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter duties percentage"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "freightCharges"]}
                            label="Freight Charges"
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter freight charges"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                    </Space>
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

        <div className="form-section">
          {/* Warranty */}
          <Form.Item label="Warranty" name="warranty">
            <Input placeholder="Enter warranty terms" />
          </Form.Item>

          {/* If LD clause applicable */}
          <Form.Item name="ifLDClauseApplicable" valuePropName="checked">
            <Checkbox>If LD clause applicable?</Checkbox>
          </Form.Item>

          <Form.Item label="INCO Terms" name="incoTerms">
            <Input.TextArea rows={1} placeholder="Enter INCO Terms" />
          </Form.Item>

          <Form.Item label="Payment Terms" name="paymentTerms">
            <Input.TextArea rows={1} placeholder="Enter Payment Terms" />
          </Form.Item>
        </div>

        <div className="form-section">
          {/* Vendor Name */}
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          {/* Vendor Address */}
          <Form.Item
            label="Vendor Address"
            name="vendorAddress"
            rules={[{ required: true, message: "Please enter vendor address" }]}
          >
            <TextArea rows={1} placeholder="Enter vendor address" />
          </Form.Item>

          {/* Applicable PBG to be submitted */}
          <Form.Item label="Applicable PBG" name="applicablePBG">
            <TextArea rows={1} />
          </Form.Item>

          {/* Transporter / Freight Forwarder Details */}
          <Form.Item
            label="Transporter Details"
            name="transporterDetails"
          >
            <TextArea rows={1} />
          </Form.Item>
        </div>

        <div className="form-section">
          {/* Vendor's A/C no */}
          <Form.Item
            label="Vendor's A/C no"
            name="vendorAccountNo"
            rules={[
              {
                required: true,
                message: "Please enter vendor's account number",
              },
            ]}
          >
            <Input placeholder="Enter vendor's account number" />
          </Form.Item>

          {/* Vendor's IFSC Code */}
          <Form.Item
            label="Vendor's IFSC code"
            name="vendorZFSCCode"
            rules={[{ required: true, message: "Please enter vendor's IFSC code" }]}
          >
            <Input placeholder="Enter vendor's IFSC code" />
          </Form.Item>

          {/* Vendor's A/C Name */}
          <Form.Item
            label="Vendor's A/C Name"
            name="vendorAccountName"
            rules={[{ required: true, message: "Please enter vendor's account name" }]}
          >
            <Input placeholder="Enter vendor's account name" />
          </Form.Item>
        </div>

        {/* Submit Button Section */}
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

export default Form7;
