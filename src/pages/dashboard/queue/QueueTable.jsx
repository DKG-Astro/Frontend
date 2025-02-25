import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Popover,
  Form,
  Row,
  Col,
  Tag,
  message,
  Spin,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { Text } = Typography;

const QueueTable = () => {
  // Get the logged-in user's role details from Redux
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [requestChangeComment, setRequestChangeComment] = useState("");
  const [additionalInfoComment, setAdditionalInfoComment] = useState("");
  const [detailsData, setDetailsData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // --- 2. Fetch the current user details from the UserMaster API ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://103.181.158.220:8081/astro-service/api/userMaster"
        );
        const userData = response.data.responseData;
        if (userData && userData.length > 0) {
          setCurrentUserId(userData[0].userId);
        } else {
          message.error("No user data found.");
        }
      } catch (error) {
        message.error("Failed to fetch user details.");
        console.error("User fetch error:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // --- 3. Fetch queue data based on the logged-in user's role ---
  const fetchData = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/allPendingWorkflowTransition?roleName=${encodeURIComponent(
          roleName
        )}`
      );
      const apiData = response.data.responseData;
      const formattedData = apiData.map((item, index) => ({
        key: index.toString(),
        requestId: item.requestId,
        originalRequestId: item.requestId,
        workflowId: item.workflowId, // Note: we'll use workflowId here
        workflowName: item.workflowName,
        status: item.nextAction,
        remarks: item.remarks || "No remarks",
      }));
      setData(formattedData);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch queue data from the API.");
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };

  // When the logged-in role information is available, fetch queue data
  useEffect(() => {
    if (auth && auth.role) {
      fetchData(auth.role);
    }
  }, [auth.role]);

  // --- Helper function: Fetch workflowTransitionId for a given requestId ---
  const fetchWorkflowTransitionId = async (requestId) => {
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/workflowTransitionHistory?requestId=${requestId}`
      );
      const data = response.data.responseData;
      if (Array.isArray(data) && data.length > 0) {
        return data[0].workflowTransitionId;
      }
      return null;
    } catch (error) {
      console.error("Error fetching workflowTransitionId:", error);
      return null;
    }
  };

  const handleApprove = async (record) => {
    if (!currentUserId) {
      message.error("User details not loaded yet.");
      return;
    }
    try {
      const workflowTransitionId = await fetchWorkflowTransitionId(
        record.requestId
      );
      if (!workflowTransitionId) {
        message.error("Workflow transition ID not found for this request.");
        return;
      }

      const payload = {
        action: "APPROVED",
        actionBy: actionPerformer,
        assignmentRole: null,
        remarks: "Approved successfully",
        requestId: record.requestId,
        workflowTransitionId,
      };

      await axios.post(
        "http://103.181.158.220:8081/astro-service/performTransitionAction",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(`Request ${record.requestId} approved successfully.`);
      setData((prevData) => prevData.filter((item) => item.key !== record.key));
    } catch (error) {
      message.error("Failed to approve");
      console.error("Approval error:", error);
    }
  };

  const fetchWorkflowTransitionHistory = async (requestId) => {
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/workflowTransitionHistory?requestId=${requestId}`
      );
      return response.data.responseData;
    } catch (error) {
      console.error("Error fetching workflow transition history:", error);
      return null;
    }
  };

  const handleReject = async (record) => {
    if (!rejectComment.trim()) {
      message.warning("Please enter a reject comment.");
      return;
    }
    if (!currentUserId) {
      message.error("User details not loaded yet.");
      return;
    }
    try {
      // Get full transition history
      const history = await fetchWorkflowTransitionHistory(record.requestId);

      if (!history || history.length === 0) {
        message.error("No transition history found for this request.");
        return;
      }

      // Find the last approval action
      const previousApprovals = history.filter(
        (entry) => entry.action === "APPROVED"
      );
      if (previousApprovals.length === 0) {
        message.error("No previous approval found to revert to.");
        return;
      }

      // Get the last approval entry
      const lastApproval = previousApprovals[previousApprovals.length - 1];

      // Get current transition ID (assuming first in array is current)
      const currentTransition = history[0];

      const payload = {
        action: "REJECTED",
        actionBy: actionPerformer,
        assignmentRole: lastApproval.assignmentRole, // Assign to previous approver's role
        remarks: rejectComment, // Use user's reject comments
        requestId: record.requestId,
        workflowTransitionId: currentTransition.workflowTransitionId,
      };

      await axios.post(
        "http://103.181.158.220:8081/astro-service/performTransitionAction",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(
        `Request ${record.requestId} rejected and sent back to ${lastApproval.assignmentRole}`
      );
      setData((prevData) => prevData.filter((item) => item.key !== record.key));
      setRejectComment("");
    } catch (error) {
      message.error("Failed to reject");
      console.error("Rejection error:", error);
    }
  };

  const handleRequestChangeSubmit = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key
        ? { ...item, remarks: `Request Change: ${requestChangeComment}` }
        : item
    );
    setData(updatedData);
    setRequestChangeComment("");
    message.success("Request change comments added.");
  };

  // --- Fetch details based on workflowId ---
  const fetchWorkflowDetails = async (record) => {
    if (!record.requestId) {
      message.error("No ID found.");
      return;
    }
    // Save the selected record so we can use its details in the Modal
    setSelectedRecord(record);
    setLoading(true);

    let endpoint = "";
    const workflowId = parseInt(record.workflowId, 10);

    switch (workflowId) {
      case 1:
        endpoint = `http://103.181.158.220:8081/astro-service/api/indents/${record.requestId}`;
        break;
      case 2:
        endpoint = `http://103.181.158.220:8081/astro-service/api/contigency-purchase/${record.requestId}`;
        break;
      case 3:
        endpoint = `http://103.181.158.220:8081/astro-service/api/purchase-orders/${record.requestId}`;
        break;
      case 4:
        endpoint = `http://103.181.158.220:8081/astro-service/api/tender-requests/${record.requestId}`;
        break;
      case 5:
        endpoint = `http://103.181.158.220:8081/astro-service/api/service-orders/${record.requestId}`;
        break;
      default:
        message.error("Invalid workflow ID.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.get(endpoint);
      setDetailsData(response.data.responseData);
      setModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch details.");
      console.error("Fetch details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId.localeCompare(b.requestId),
      render: (text, record) => (
        <Button type="link" onClick={() => fetchWorkflowDetails(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Workflow ID",
      dataIndex: "workflowId",
      key: "workflowId",
      filters: [
        { text: "1", value: "1" },
        { text: "2", value: "2" },
        { text: "3", value: "3" },
      ],
      onFilter: (value, record) => record.workflowId === value,
    },
    {
      title: "Workflow Name",
      dataIndex: "workflowName",
      key: "workflowName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status === "Approved") return null;
        return (
          <Space wrap>
            <Button type="link" onClick={() => handleApprove(record)}>
              Approve
            </Button>
            <Popover
              content={
                <div style={{ padding: 12 }}>
                  <Input.TextArea
                    placeholder="Reject Comments"
                    rows={3}
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleReject(record)}
                    style={{ marginTop: 8 }}
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Reject"
              trigger="click"
            >
              <Button danger type="link">
                Reject
              </Button>
            </Popover>
            <Popover
              content={
                <div style={{ padding: 12 }}>
                  <Input.TextArea
                    placeholder="Request Change Comments"
                    rows={3}
                    value={requestChangeComment}
                    onChange={(e) => setRequestChangeComment(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleRequestChangeSubmit(record)}
                    style={{ marginTop: 8 }}
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Request Change"
              trigger="click"
            >
              <Button type="link">Request Change</Button>
            </Popover>
          </Space>
        );
      },
    },
  ];

  // --- Filter Component remains unchanged ---
  const FilterComponent = ({ onFilter }) => {
    const [form] = Form.useForm();
    const handleReset = () => {
      form.resetFields();
      onFilter({});
    };
    return (
      <Form form={form} onFinish={onFilter}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Form.Item name="requestId" style={{ marginBottom: 10 }}>
              <Input placeholder="Request ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="workflowId" style={{ marginBottom: 10 }}>
              <Input placeholder="Workflow ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="workflowName" style={{ marginBottom: 10 }}>
              <Input placeholder="Workflow Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Space style={{ marginBottom: 10 }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Search
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Display the logged-in user's role details */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Role ID:</Text> {auth.roleId || "N/A"}
        </Col>
        <Col>
          <Text strong>Role Name:</Text> {auth.role || "N/A"}
        </Col>
        <Col>
          <Text strong>User ID:</Text> {actionPerformer}
        </Col>
      </Row>

      <FilterComponent onFilter={(filters) => console.log(filters)} />

      {loading ? (
        <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Table columns={columns} dataSource={data} />
      )}

      {/* Details Modal */}
      <Modal
        title={`${selectedRecord?.workflowName || "Details"} - ${
          selectedRecord?.requestId || "N/A"
        }`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
      >
        {detailsData ? (
          <>
            {parseInt(selectedRecord?.workflowId, 10) === 1 && (
              <div>
                {/* Indent Details */}
                <p>
                  <strong>Indentor Name:</strong> {detailsData.indentorName}
                </p>
                <p>
                  <strong>Email:</strong> {detailsData.indentorEmailAddress}
                </p>
                <p>
                  <strong>Mobile No:</strong> {detailsData.indentorMobileNo}
                </p>
                <p>
                  <strong>Project Name:</strong> {detailsData.projectName}
                </p>
                <p>
                  <strong>Location:</strong> {detailsData.consignesLocation}
                </p>
                <p>
                  <strong>Estimated Rate:</strong> ₹
                  {detailsData.estimatedRate &&
                    detailsData.estimatedRate.toFixed(2)}
                </p>
                <p>
                  <strong>Total Price of Materials:</strong> ₹
                  {detailsData.totalPriceOfAllMaterials &&
                    detailsData.totalPriceOfAllMaterials.toFixed(2)}
                </p>
                {detailsData.isPreBidMeetingRequired && (
                  <div>
                    <h3>Pre-Bid Meeting</h3>
                    <p>
                      <strong>Date:</strong> {detailsData.preBidMeetingDate}
                    </p>
                    <p>
                      <strong>Venue:</strong> {detailsData.preBidMeetingVenue}
                    </p>
                  </div>
                )}
                <h3>Material Details</h3>
                <Table
                  dataSource={detailsData.materialDetails}
                  pagination={false}
                  bordered
                  columns={[
                    {
                      title: "Material Code",
                      dataIndex: "materialCode",
                      key: "materialCode",
                    },
                    {
                      title: "Description",
                      dataIndex: "materialDescription",
                      key: "materialDescription",
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Unit Price",
                      dataIndex: "unitPrice",
                      key: "unitPrice",
                      render: (text) => `₹${text.toFixed(2)}`,
                    },
                    {
                      title: "Total Price",
                      dataIndex: "totalPrice",
                      key: "totalPrice",
                      render: (text) => `₹${text.toFixed(2)}`,
                    },
                    { title: "UOM", dataIndex: "uom", key: "uom" },
                    {
                      title: "Budget Code",
                      dataIndex: "budgetCode",
                      key: "budgetCode",
                    },
                  ]}
                />
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 2 && (
              <div>
                {/* Contingency Purchase Details */}
                <p>
                  <strong>Contingency ID:</strong>{" "}
                  {detailsData.contigencyId || "N/A"}
                </p>
                <p>
                  <strong>Vendor Name:</strong>{" "}
                  {detailsData.vendorsName || "N/A"}
                </p>
                <p>
                  <strong>Vendor Invoice No:</strong>{" "}
                  {detailsData.vendorsInvoiceNo || "N/A"}
                </p>
                <p>
                  <strong>Material Code:</strong>{" "}
                  {detailsData.materialCode || "N/A"}
                </p>
                <p>
                  <strong>Material Description:</strong>{" "}
                  {detailsData.materialDescription || "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {detailsData.quantity || "N/A"}
                </p>
                <p>
                  <strong>Unit Price:</strong>{" "}
                  {detailsData.unitPrice
                    ? `₹${detailsData.unitPrice.toFixed(2)}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Remarks For Purchase:</strong>{" "}
                  {detailsData.remarksForPurchase || "N/A"}
                </p>
                <p>
                  <strong>Amount To Be Paid:</strong>{" "}
                  {detailsData.amountToBePaid
                    ? `₹${detailsData.amountToBePaid.toFixed(2)}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Upload Copy Of Invoice:</strong>{" "}
                  {detailsData.uploadCopyOfInvoice || "N/A"}
                </p>
                <p>
                  <strong>Predefined Purchase Statement:</strong>{" "}
                  {detailsData.predifinedPurchaseStatement || "N/A"}
                </p>
                <p>
                  <strong>Project Detail:</strong>{" "}
                  {detailsData.projectDetail || "N/A"}
                </p>
                <p>
                  <strong>Project Name:</strong>{" "}
                  {detailsData.projectName || "N/A"}
                </p>
                <p>
                  <strong>Created By:</strong> {detailsData.createdBy || "N/A"}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {detailsData.createdDate || "N/A"}
                </p>
                <p>
                  <strong>Updated By:</strong> {detailsData.updatedBy || "N/A"}
                </p>
                <p>
                  <strong>Updated Date:</strong>{" "}
                  {detailsData.updatedDate || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {detailsData.date || "N/A"}
                </p>
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 3 && (
              <div>
                {/* Purchase Order Details */}
                <p>
                  <strong>PO ID:</strong> {detailsData.poId || "N/A"}
                </p>
                <p>
                  <strong>Tender ID:</strong> {detailsData.tenderId || "N/A"}
                </p>
                <p>
                  <strong>Indent ID:</strong> {detailsData.indentId || "N/A"}
                </p>
                <p>
                  <strong>Warranty:</strong> {detailsData.warranty || "N/A"}
                </p>
                <p>
                  <strong>Consignes Address:</strong>{" "}
                  {detailsData.consignesAddress || "N/A"}
                </p>
                <p>
                  <strong>Billing Address:</strong>{" "}
                  {detailsData.billingAddress || "N/A"}
                </p>
                <p>
                  <strong>Delivery Period:</strong>{" "}
                  {detailsData.deliveryPeriod
                    ? `${detailsData.deliveryPeriod} days`
                    : "N/A"}
                </p>
                <p>
                  <strong>LD Clause Applicable:</strong>{" "}
                  {detailsData.ifLdClauseApplicable ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Inco Terms:</strong> {detailsData.incoTerms || "N/A"}
                </p>
                <p>
                  <strong>Payment Terms:</strong>{" "}
                  {detailsData.paymentTerms || "N/A"}
                </p>
                <p>
                  <strong>Vendor Name:</strong>{" "}
                  {detailsData.vendorName || "N/A"}
                </p>
                <p>
                  <strong>Vendor Address:</strong>{" "}
                  {detailsData.vendorAddress || "N/A"}
                </p>
                <p>
                  <strong>Applicable PBG To Be Submitted:</strong>{" "}
                  {detailsData.applicablePbgToBeSubmitted || "N/A"}
                </p>
                <p>
                  <strong>Transporter & Freight For Warer Details:</strong>{" "}
                  {detailsData.transporterAndFreightForWarderDetails || "N/A"}
                </p>
                <p>
                  <strong>Vendor Account Number:</strong>{" "}
                  {detailsData.vendorAccountNumber || "N/A"}
                </p>
                <p>
                  <strong>Vendor ZFSC Code:</strong>{" "}
                  {detailsData.vendorsZfscCode || "N/A"}
                </p>
                <p>
                  <strong>Vendor Account Name:</strong>{" "}
                  {detailsData.vendorAccountName || "N/A"}
                </p>
                <p>
                  <strong>Total Value Of PO:</strong>{" "}
                  {detailsData.totalValueOfPo !== undefined
                    ? `₹${detailsData.totalValueOfPo}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Project Name:</strong>{" "}
                  {detailsData.projectName || "N/A"}
                </p>
                <h3>Purchase Order Attributes</h3>
                <Table
                  dataSource={detailsData.purchaseOrderAttributes}
                  pagination={false}
                  bordered
                  columns={[
                    {
                      title: "Material Code",
                      dataIndex: "materialCode",
                      key: "materialCode",
                    },
                    {
                      title: "Material Description",
                      dataIndex: "materialDescription",
                      key: "materialDescription",
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Rate",
                      dataIndex: "rate",
                      key: "rate",
                      render: (text) =>
                        text !== undefined ? `${text}` : "N/A",
                    },
                    {
                      title: "Currency",
                      dataIndex: "currency",
                      key: "currency",
                    },
                    {
                      title: "Exchange Rate",
                      dataIndex: "exchangeRate",
                      key: "exchangeRate",
                    },
                    {
                      title: "GST",
                      dataIndex: "gst",
                      key: "gst",
                      render: (text) =>
                        text !== undefined ? `${text}%` : "N/A",
                    },
                    {
                      title: "Duties",
                      dataIndex: "duties",
                      key: "duties",
                      render: (text) =>
                        text !== undefined ? `${text}%` : "N/A",
                    },
                    {
                      title: "Freight Charge",
                      dataIndex: "freightCharge",
                      key: "freightCharge",
                      render: (text) =>
                        text !== undefined ? `${text}` : "N/A",
                    },
                    {
                      title: "Budget Code",
                      dataIndex: "budgetCode",
                      key: "budgetCode",
                    },
                  ]}
                />
                <p>
                  <strong>Created By:</strong> {detailsData.createdBy || "N/A"}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {detailsData.createdDate || "N/A"}
                </p>
                <p>
                  <strong>Updated By:</strong> {detailsData.updatedBy || "N/A"}
                </p>
                <p>
                  <strong>Updated Date:</strong>{" "}
                  {detailsData.updatedDate || "N/A"}
                </p>
                {detailsData.tenderDetails && (
                  <>
                    <h3>Tender Details</h3>
                    <p>
                      <strong>Tender ID:</strong>{" "}
                      {detailsData.tenderDetails.tenderId || "N/A"}
                    </p>
                    <p>
                      <strong>Title of Tender:</strong>{" "}
                      {detailsData.tenderDetails.titleOfTender || "N/A"}
                    </p>
                    <p>
                      <strong>Opening Date:</strong>{" "}
                      {detailsData.tenderDetails.openingDate || "N/A"}
                    </p>
                    <p>
                      <strong>Closing Date:</strong>{" "}
                      {detailsData.tenderDetails.closingDate || "N/A"}
                    </p>
                    {/* Additional tender details can be added here if needed */}
                  </>
                )}
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 4 && (
              <div>
                {/* Tender Details */}
                <p>
                  <strong>Tender ID:</strong> {detailsData.tenderId || "N/A"}
                </p>
                <p>
                  <strong>Title of Tender:</strong>{" "}
                  {detailsData.titleOfTender || "N/A"}
                </p>
                <p>
                  <strong>Opening Date:</strong>{" "}
                  {detailsData.openingDate || "N/A"}
                </p>
                <p>
                  <strong>Closing Date:</strong>{" "}
                  {detailsData.closingDate || "N/A"}
                </p>
                <p>
                  <strong>Bid Type:</strong> {detailsData.bidType || "N/A"}
                </p>
                <p>
                  <strong>Last Date Of Submission:</strong>{" "}
                  {detailsData.lastDateOfSubmission || "N/A"}
                </p>
                <p>
                  <strong>Applicable Taxes:</strong>{" "}
                  {detailsData.applicableTaxes || "N/A"}
                </p>
                <p>
                  <strong>Consignes And Billing Address:</strong>{" "}
                  {detailsData.consignesAndBillinngAddress || "N/A"}
                </p>
                <p>
                  <strong>Inco Terms:</strong> {detailsData.incoTerms || "N/A"}
                </p>
                <p>
                  <strong>Payment Terms:</strong>{" "}
                  {detailsData.paymentTerms || "N/A"}
                </p>
                <p>
                  <strong>LD Clause:</strong> {detailsData.ldClause || "N/A"}
                </p>
                <p>
                  <strong>Applicable Performance:</strong>{" "}
                  {detailsData.applicablePerformance || "N/A"}
                </p>
                <p>
                  <strong>Bid Security Declaration:</strong>{" "}
                  {detailsData.bidSecurityDeclaration ? "Yes" : "No"}
                </p>
                <p>
                  <strong>MLL Status Declaration:</strong>{" "}
                  {detailsData.mllStatusDeclaration ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Upload Tender Documents:</strong>{" "}
                  {detailsData.uploadTenderDocuments || "N/A"}
                </p>
                <p>
                  <strong>Upload General Terms And Conditions:</strong>{" "}
                  {detailsData.uploadGeneralTermsAndConditions || "N/A"}
                </p>
                <p>
                  <strong>Upload Specific Terms And Conditions:</strong>{" "}
                  {detailsData.uploadSpecificTermsAndConditions || "N/A"}
                </p>
                {detailsData.indentResponseDTO &&
                  detailsData.indentResponseDTO.length > 0 && (
                    <>
                      <h3>Indent Response Details</h3>
                      <p>
                        <strong>Indentor Name:</strong>{" "}
                        {detailsData.indentResponseDTO[0].indentorName || "N/A"}
                      </p>
                      <p>
                        <strong>Indent ID:</strong>{" "}
                        {detailsData.indentResponseDTO[0].indentId || "N/A"}
                      </p>
                      <p>
                        <strong>Indentor Mobile No:</strong>{" "}
                        {detailsData.indentResponseDTO[0].indentorMobileNo ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Indentor Email Address:</strong>{" "}
                        {detailsData.indentResponseDTO[0]
                          .indentorEmailAddress || "N/A"}
                      </p>
                      <p>
                        <strong>Consignes Location:</strong>{" "}
                        {detailsData.indentResponseDTO[0].consignesLocation ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Project Name:</strong>{" "}
                        {detailsData.indentResponseDTO[0].projectName || "N/A"}
                      </p>
                      <p>
                        <strong>Pre-Bid Meeting Required:</strong>{" "}
                        {detailsData.indentResponseDTO[0]
                          .isPreBidMeetingRequired
                          ? "Yes"
                          : "No"}
                      </p>
                      {detailsData.indentResponseDTO[0]
                        .isPreBidMeetingRequired && (
                        <>
                          <p>
                            <strong>Pre-Bid Meeting Date:</strong>{" "}
                            {detailsData.indentResponseDTO[0]
                              .preBidMeetingDate || "N/A"}
                          </p>
                          <p>
                            <strong>Pre-Bid Meeting Venue:</strong>{" "}
                            {detailsData.indentResponseDTO[0]
                              .preBidMeetingVenue || "N/A"}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Estimated Rate:</strong>{" "}
                        {detailsData.indentResponseDTO[0].estimatedRate
                          ? `₹${detailsData.indentResponseDTO[0].estimatedRate.toFixed(
                              2
                            )}`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Total Tender Value:</strong>{" "}
                        {detailsData.totalTenderValue
                          ? `₹${detailsData.totalTenderValue.toFixed(2)}`
                          : "N/A"}
                      </p>
                      <h3>Material Details</h3>
                      <Table
                        dataSource={
                          detailsData.indentResponseDTO[0].materialDetails
                        }
                        pagination={false}
                        bordered
                        columns={[
                          {
                            title: "Material Code",
                            dataIndex: "materialCode",
                            key: "materialCode",
                          },
                          {
                            title: "Description",
                            dataIndex: "materialDescription",
                            key: "materialDescription",
                          },
                          {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                          },
                          {
                            title: "Unit Price",
                            dataIndex: "unitPrice",
                            key: "unitPrice",
                            render: (text) => `₹${text.toFixed(2)}`,
                          },
                          {
                            title: "Total Price",
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: (text) => `₹${text.toFixed(2)}`,
                          },
                          { title: "UOM", dataIndex: "uom", key: "uom" },
                          {
                            title: "Budget Code",
                            dataIndex: "budgetCode",
                            key: "budgetCode",
                          },
                        ]}
                      />
                    </>
                  )}
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 5 && (
              <div>
                {/* Service Order Details */}
                <p>
                  <strong>Service Order ID:</strong> {detailsData.soId || "N/A"}
                </p>
                <p>
                  <strong>Service Details:</strong>{" "}
                  {detailsData.details || "N/A"}
                </p>
                {/* Additional service order details can be added here */}
              </div>
            )}
          </>
        ) : (
          <Spin tip="Loading details..." />
        )}
      </Modal>
    </div>
  );
};

export default QueueTable;
