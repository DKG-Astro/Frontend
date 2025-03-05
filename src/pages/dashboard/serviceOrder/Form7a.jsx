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

const { Option } = Select;

const Form7a = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tenders, setTenders] = useState([]); // Store Tender IDs
  const [selectedIndentId, setSelectedIndentId] = useState(""); // Store Indent ID
  const [serviceDetails, setServiceDetails] = useState([]); // Store Service Details
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  // Fetch All Tender IDs on component mount
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

  // Handle SO search - similar to PO search
  const handleSOSearch = async (soId) => {
    if (!soId) {
      message.warning("Please enter an SO ID");
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/service-orders/${soId}`
      );
      const data = await response.json();

      if (!data.responseData) {
        message.warning("No service order found for this SO ID");
        form.resetFields();
        return;
      }

      // Extract SO Data & Related Indent ID
      const soDetails = data.responseData;
      setSelectedIndentId(soDetails.indentId);

      // Pre-fill SO form fields
      form.setFieldsValue({
        tenderID: soDetails.tenderId,
        indentID: soDetails.indentId,
        consigneeAddress: soDetails.consignesAddress,
        billingAddress: soDetails.billingAddress,
        deliveryPeriod: soDetails.jobCompletionPeriod,
        ifLDClauseApplicable: soDetails.ifLdClauseApplicable,
        incoTerms: soDetails.incoTerms,
        paymentTerms: soDetails.paymentTerms,
        vendorName: soDetails.vendorName,
        vendorAddress: soDetails.vendorAddress,
        applicablePBG: soDetails.applicablePBGToBeSubmitted,
        vendorAccountNo: soDetails.vendorsAccountNo,
        vendorIFSCCode: soDetails.vendorsZRSCCode,
        vendorAccountName: soDetails.vendorsAccountName,
      });

      // Format service materials as line items
      if (soDetails.materials && soDetails.materials.length > 0) {
        const formattedMaterials = soDetails.materials.map((item, index) => ({
          key: index,
          materialCode: item.materialCode,
          materialDescription: item.materialDescription,
          quantity: item.quantity,
          unitRate: item.rate,
          currency: item.currency || "INR",
          exchangeRate: item.exchangeRate || 1,
          gst: item.gst,
          duties: item.duties,
          budgetCode: item.budgetCode
        }));

        setServiceDetails(formattedMaterials);
        form.setFieldsValue({ lineItems: formattedMaterials });
      }

      // Fetch service details if needed
      if (soDetails.indentId) {
        fetchServiceDetails(soDetails.indentId);
      }
      
      message.success("Service Order details loaded successfully");
    } catch (error) {
      message.error("Failed to fetch SO data");
      console.error("Error fetching data:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle Tender Selection - similar to PO form
  const handleTenderSelect = async (tenderId) => {
    setSelectedIndentId("");
    setServiceDetails([]);
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

      // Extract First Indent ID
      const indentData = data.responseData.indentResponseDTO[0];
      if (!indentData) {
        message.error("No Indent ID found for this Tender");
        return;
      }

      setSelectedIndentId(indentData.indentId); // Store Indent ID

      // Pre-fill form fields with Tender Data
      form.setFieldsValue({
        incoTerms: data.responseData.incoTerms,
        paymentTerms: data.responseData.paymentTerms,
        ifLDClauseApplicable: data.responseData.ldClause,
        applicablePBG: data.responseData.applicablePerformance,
      });

      // Fetch Service Details using Indent ID
      fetchServiceDetails(indentData.indentId);
    } catch (error) {
      console.error("Error fetching Tender details:", error);
      message.error("Error fetching Tender details");
    }
  };

  // Fetch Service Details from Indent API
  const fetchServiceDetails = async (indentId) => {
    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/indents/${indentId}`
      );
      const data = await response.json();

      if (!data.responseData || !data.responseData.materialDetails) {
        message.error("No Service Details found");
        return;
      }

      // Format materials as service line items
      const formattedServices = data.responseData.materialDetails.map((item, index) => ({
        key: index,
        materialCode: item.materialCode,
        materialDescription: item.materialDescription,
        quantity: item.quantity,
        unitRate: item.unitPrice,
        currency: "INR", // Default value
        exchangeRate: 1, // Default value
        gst: 18, // Default GST value
        duties: 0, // Default duties value
        budgetCode: item.budgetCode || "",
      }));

      setServiceDetails(formattedServices); // Store Service Data
      form.setFieldsValue({ lineItems: formattedServices });

      message.success(`Loaded services for Indent ID: ${indentId}`);
    } catch (error) {
      console.error("Error fetching Service Details:", error);
      message.error("Error fetching Service Details");
    }
  };

  // Function to handle form submission
  const submitSOData = async (values) => {
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
        budgetCode: item.budgetCode || "",
      }));
  
      const payload = {
        soId: values.soId,
        tenderId: values.tenderID,
        indentId: selectedIndentId,
        consignesAddress: values.consigneeAddress,
        billingAddress: values.billingAddress,
        jobCompletionPeriod: parseFloat(values.deliveryPeriod) || 0,
        ifLdClauseApplicable: !!values.ifLDClauseApplicable, // Ensure boolean
        incoTerms: values.incoTerms,
        paymentTerms: values.paymentTerms,
        vendorName: values.vendorName,
        vendorAddress: values.vendorAddress,
        applicablePBGToBeSubmitted: values.applicablePBG,
        vendorsAccountNo: values.vendorAccountNo,
        vendorsZRSCCode: values.vendorIFSCCode,
        vendorsAccountName: values.vendorAccountName,
        materials: updatedLineItems,
        createdBy: actionPerformer,
        updatedBy: null,
      };
  
      const response = await fetch(
        "/astro-service/api/service-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.responseStatus?.message || "Submission failed");
      }
  
      message.success("Service Order submitted successfully");
      form.resetFields();
    } catch (error) {
      message.error(`Failed to submit Service Order: ${error.message}`);
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Service Order (SO)</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={submitSOData}
        initialValues={{ date: null }}
      >
      <Row justify="end">
        <Col>
          <Form.Item
            label="SO ID"
            name="soId"
            rules={[{ required: true, message: "Please enter SO ID" }]}
            >
            <Input.Search
                placeholder="Enter SO ID"
                onSearch={handleSOSearch}
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

          {/* Delivery/Job Completion Period */}
          <Form.Item
            label="Job Completion Period"
            name="deliveryPeriod"
            rules={[{ required: true, message: "Please specify the job completion period" }]}
          >
            <Input type="number" placeholder="Enter job completion period" />
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
                        marginBottom: 20,
                        flexWrap: "wrap",
                      }}
                      align="start"
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialCode"]}
                            label="Service Code"
                            rules={[
                              {
                                required: true,
                                message: "Please enter a service code!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Service Code" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "materialDescription"]}
                            label="Service Description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter a service description!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Service Description" />
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
                              <Option value="EUR">EUR</Option>
                              <Option value="GBP">GBP</Option>
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
                            name={[name, "budgetCode"]}
                            label="Budget Code"
                          >
                            <Input
                              placeholder="Enter budget code"
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
                    Add Service Item
                  </Button>
                </Form.Item> */}
              </>
            )}
          </Form.List>
        </div>

        <div className="form-section">
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
          <Form.Item label="Applicable PBG to be submitted" name="applicablePBG">
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
            name="vendorIFSCCode"
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

export default Form7a;