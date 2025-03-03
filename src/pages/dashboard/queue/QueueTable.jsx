import React, { useState, useEffect, useCallback } from "react";
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
  Select,
  Collapse,
  Divider,
  Empty,
  Tabs,
} from "antd";
import {
  AuditOutlined,
  BarsOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  ProjectOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import QueueHistory from "./QueueHistory";
import TabPane from "antd/es/tabs/TabPane";
// import { render } from "@testing-library/react";

const { Text } = Typography;

const FilterComponent = ({ onSearch, searchRequestId, onReset }) => (
  <div style={{ marginBottom: 16 }}>
    <Space>
      <Input
        placeholder="Search by Request ID"
        prefix={<SearchOutlined />}
        value={searchRequestId}
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 300 }}
        onPressEnter={() => onSearch(searchRequestId)}
        allowClear
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={() => onSearch(searchRequestId)}
      >
        Search
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </Space>
  </div>
);

const QueueTable = () => {
  // Get the logged-in user's role details from Redux
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [requestChangeComment, setRequestChangeComment] = useState("");
  const [detailsData, setDetailsData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [previousRoles, setPreviousRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loadingPreviousRoles, setLoadingPreviousRoles] = useState(false);
  const [searchRequestId, setSearchRequestId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [activeTab, setActiveTab] = useState("request");

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

  const fetchPreviousRoles = async (workflowId, requestId) => {
    setLoadingPreviousRoles(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/allPreviousWorkflowRole?workflowId=${encodeURIComponent(
          workflowId
        )}&requestId=${encodeURIComponent(requestId)}`
      );
      setPreviousRoles(response.data.responseData || []);
    } catch (error) {
      message.error("Failed to fetch previous roles.");
      console.error("Fetch previous roles error:", error);
    } finally {
      setLoadingPreviousRoles(false);
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

  const handleRequestChangeSubmit = async (record) => {
    if (!selectedRole) {
      message.warning("Please select a role.");
      return;
    }
    if (!requestChangeComment.trim()) {
      message.warning("Please enter request change comments.");
      return;
    }
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
        action: "Change requested",
        actionBy: actionPerformer,
        assignmentRole: selectedRole,
        remarks: requestChangeComment,
        // requestId: record.requestId,
        // workflowTransitionId,
        // assignmentRole: lastApproval.assignmentRole, // Assign to previous approver's role
        // remarks: rejectComment, // Use user's reject comments
        requestId: record.requestId,
        workflowTransitionId: currentTransition.workflowTransitionId,
      };

      await axios.post(
        "http://103.181.158.220:8081/astro-service/performTransitionAction",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Request change submitted successfully.");
      setData((prevData) => prevData.filter((item) => item.key !== record.key));
      setRequestChangeComment("");
      setSelectedRole(null);
      setPreviousRoles([]);
    } catch (error) {
      message.error("Failed to submit request change.");
      console.error("Request change error:", error);
    }
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
      setQueueData(response.data.responseData);
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
    // {
    //   title: "Workflow ID",
    //   dataIndex: "workflowId",
    //   key: "workflowId",
    //   filters: [
    //     { text: "1", value: "1" },
    //     { text: "2", value: "2" },
    //     { text: "3", value: "3" },
    //   ],
    //   onFilter: (value, record) => record.workflowId === value,
    // },
    {
      title: "Indentor",
      dataIndex: "indentor",
      key: "indentor",
      render: (_, record) => record.indentorName || "N/A",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => `₹${record.totalPriceOfAllMaterials?.toFixed(2)}`, // Match modal's totalPriceOfAllMaterials
      sorter: (a, b) => a.totalPriceOfAllMaterials - b.totalPriceOfAllMaterials,
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "project",
      render: (text) => text || "N/A",
    },
    {
      title: "Budget Name",
      dataIndex: "budgetName",
      key: "budgetName",
      render: (text, record) => text || record.budgetName || "N/A",
    },
    {
      title: "Indentor Title",
      dataIndex: "workflowName",
      key: "indentTitle",
    },
    {
      title: "Mode of Procurement",
      dataIndex: "modeOfProcurement",
      key: "modeOfProcurement",
    },
    {
      title: "Consignee",
      dataIndex: "consignesLocation", // Match modal's consignesLocation
      key: "consignee",
      render: (text) => text || "N/A",
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
                <div style={{ padding: 12, width: 300 }}>
                  <Select
                    placeholder={
                      loadingPreviousRoles
                        ? "Loading roles..."
                        : "Select a role"
                    }
                    value={selectedRole}
                    onChange={setSelectedRole}
                    style={{ width: "100%", marginBottom: 8 }}
                    loading={loadingPreviousRoles}
                    disabled={
                      loadingPreviousRoles || previousRoles.length === 0
                    }
                  >
                    {previousRoles.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role}
                      </Select.Option>
                    ))}
                  </Select>
                  {previousRoles.length === 0 && !loadingPreviousRoles && (
                    <Text type="secondary">No previous roles available.</Text>
                  )}
                  <Input.TextArea
                    placeholder="Request Change Comments"
                    rows={3}
                    value={requestChangeComment}
                    onChange={(e) => setRequestChangeComment(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleRequestChangeSubmit(record)}
                    style={{ marginTop: 8 }}
                    disabled={
                      !selectedRole ||
                      !requestChangeComment.trim() ||
                      loadingPreviousRoles
                    }
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Request Change"
              trigger="click"
              onVisibleChange={(visible) => {
                if (visible) {
                  fetchPreviousRoles(record.workflowId, record.requestId);
                } else {
                  // Reset when popover closes
                  setPreviousRoles([]);
                  setSelectedRole(null);
                  setRequestChangeComment("");
                  setLoadingPreviousRoles(false);
                }
              }}
            >
              <Button type="link">Request Change</Button>
            </Popover>
          </Space>
        );
      },
    },
  ];

  const column1 = [
    {
      title: "Bid Type",
      dataIndex: "bidType",
      key: "bidType",
    },
    {
      title: "Last Date",
      dataIndex: "lastDate",
      key: "lastDate",
    },
    {
      title: "Bid Opening Date",
      dataIndex: "bidOpeningDate",
      key: "bidOpeningDate",
    },
    {
      title: "Bid Closing Date",
      dataIndex: "bidClosingDate",
      key: "bidClosingDate",
    },
    {
      title: "Consigne Location",
      dataIndex: "consignesLocation",
      key: "consignesLocation",
    },
  ];

  // --- Filter Component remains unchanged ---

  const filteredData = data.filter((item) =>
    item.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchRequestId("");
    setSearchTerm("");
  }, []);

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

      <FilterComponent
        onSearch={handleSearch}
        searchRequestId={searchRequestId}
        onReset={handleReset}
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Request" key="request">
          {loading ? (
            <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : (
            <Table columns={columns} dataSource={filteredData} rowKey="key" />
          )}
        </TabPane>
        <TabPane tab="Action" key="action">
          <Table columns={column1} rowKey="key" />
        </TabPane>
      </Tabs>
      {/* Details Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>
              {`${selectedRecord?.workflowName || "Details"} - ${
                selectedRecord?.requestId || "N/A"
              }`}
            </span>
            <Button
              type="link"
              icon={<HistoryOutlined />}
              onClick={() => setHistoryVisible(true)}
            >
              View History
            </Button>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        className="custom-modal"
        bodyStyle={{ padding: "24px 24px 8px" }}
      >
        {detailsData ? (
          <>
            <style>{`
        .custom-modal .ant-modal-title { font-size: 18px; font-weight: 600; }
        .detail-section { margin-bottom: 24px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; }
        .detail-item { margin-bottom: 12px; font-size: 14px; }
        .detail-item strong { display: inline-block; width: 220px; color: rgba(0, 0, 0, 0.85); }
        .section-title { margin: 16px 0; font-size: 16px; font-weight: 500; }
        .ant-table-thead > tr > th { background-color: #fafafa; font-weight: 600; }
        .amount { font-weight: 500; color: #1890ff; }
      `}</style>

            {parseInt(selectedRecord?.workflowId, 10) === 1 && (
              <div>
                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <InfoCircleOutlined /> Indent Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Indentor Name:</strong>{" "}
                        {detailsData.indentorName}
                      </div>
                      <div className="detail-item">
                        <strong>Email:</strong>{" "}
                        {detailsData.indentorEmailAddress}
                      </div>
                      <div className="detail-item">
                        <strong>Mobile No:</strong>{" "}
                        {detailsData.indentorMobileNo}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Project Name:</strong> {detailsData.projectName}
                      </div>
                      <div className="detail-item">
                        <strong>Location:</strong>{" "}
                        {detailsData.consignesLocation}
                      </div>
                      <div className="detail-item">
                        <strong>Total Price:</strong> ₹
                        {detailsData.totalPriceOfAllMaterials?.toFixed(2)}
                      </div>
                    </Col>
                  </Row>
                </div>

                {detailsData.isPreBidMeetingRequired && (
                  <div className="detail-section">
                    <Typography.Title level={5} className="section-title">
                      <CalendarOutlined /> Pre-Bid Meeting
                    </Typography.Title>
                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="detail-item">
                          <strong>Date:</strong> {detailsData.preBidMeetingDate}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="detail-item">
                          <strong>Venue:</strong>{" "}
                          {detailsData.preBidMeetingVenue}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <BarsOutlined /> Material Details
                  </Typography.Title>
                  <Table
                    dataSource={detailsData.materialDetails}
                    pagination={false}
                    bordered
                    scroll={{ x: true }}
                    rowKey="materialCode"
                    columns={[
                      {
                        title: "Material Code",
                        dataIndex: "materialCode",
                        width: 120,
                      },
                      {
                        title: "Description",
                        dataIndex: "materialDescription",
                        ellipsis: true,
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        align: "right",
                      },
                      {
                        title: "Unit Price",
                        dataIndex: "unitPrice",
                        align: "right",
                        render: (text) => `₹${text?.toFixed(2)}`,
                      },
                      {
                        title: "Total Price",
                        dataIndex: "totalPrice",
                        align: "right",
                        render: (text) => (
                          <span style={{ fontWeight: 500 }}>
                            ₹{text?.toFixed(2)}
                          </span>
                        ),
                      },
                      { title: "UOM", dataIndex: "uom", width: 100 },
                      {
                        title: "Budget Code",
                        dataIndex: "budgetCode",
                        width: 120,
                      },
                    ]}
                  />
                </div>
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 2 && (
              <div>
                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <ShoppingOutlined /> Contingency Purchase Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Contingency ID:</strong>{" "}
                        {detailsData.contigencyId || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Vendor Name:</strong>{" "}
                        {detailsData.vendorsName || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Invoice No:</strong>{" "}
                        {detailsData.vendorsInvoiceNo || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Amount To Be Paid:</strong>
                        <span className="amount">
                          {detailsData.amountToBePaid
                            ? `₹${detailsData.amountToBePaid.toFixed(2)}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Purchase Statement:</strong>{" "}
                        {detailsData.predifinedPurchaseStatement || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Invoice Copy:</strong>{" "}
                        {detailsData.uploadCopyOfInvoice || "N/A"}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <ProfileOutlined /> Material Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Material Code:</strong>{" "}
                        {detailsData.materialCode || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Description:</strong>{" "}
                        {detailsData.materialDescription || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Quantity:</strong>{" "}
                        {detailsData.quantity || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Unit Price:</strong>{" "}
                        {detailsData.unitPrice
                          ? `₹${detailsData.unitPrice.toFixed(2)}`
                          : "N/A"}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <ProjectOutlined /> Project Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Project Name:</strong>{" "}
                        {detailsData.projectName || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Created By:</strong>{" "}
                        {detailsData.createdBy || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Last Updated:</strong>{" "}
                        {detailsData.updatedDate || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Updated By:</strong>{" "}
                        {detailsData.updatedBy || "N/A"}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 3 && (
              <div>
                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <FileTextOutlined /> PO Basic Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>PO ID:</strong> {detailsData.poId || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Tender ID:</strong>{" "}
                        {detailsData.tenderId || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Delivery Period:</strong>{" "}
                        {detailsData.deliveryPeriod
                          ? `${detailsData.deliveryPeriod} days`
                          : "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Total PO Value:</strong>
                        <span className="amount">
                          {detailsData.totalValueOfPo !== undefined
                            ? `₹${detailsData.totalValueOfPo.toFixed(2)}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Payment Terms:</strong>{" "}
                        {detailsData.paymentTerms || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>LD Clause:</strong>{" "}
                        {detailsData.ifLdClauseApplicable ? "Yes" : "No"}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <ShopOutlined /> Vendor Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Vendor Name:</strong>{" "}
                        {detailsData.vendorName || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Account Number:</strong>{" "}
                        {detailsData.vendorAccountNumber || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>ZFSC Code:</strong>{" "}
                        {detailsData.vendorsZfscCode || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Account Name:</strong>{" "}
                        {detailsData.vendorAccountName || "N/A"}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <BarsOutlined /> Purchase Order Items
                  </Typography.Title>
                  <Table
                    dataSource={detailsData.purchaseOrderAttributes}
                    pagination={false}
                    bordered
                    scroll={{ x: true }}
                    rowKey="materialCode"
                    columns={[
                      {
                        title: "Material Code",
                        dataIndex: "materialCode",
                        width: 120,
                      },
                      {
                        title: "Description",
                        dataIndex: "materialDescription",
                        ellipsis: true,
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        align: "right",
                      },
                      {
                        title: "Rate",
                        dataIndex: "rate",
                        align: "right",
                        render: (text) => `₹${text?.toFixed(2)}`,
                      },
                      { title: "Currency", dataIndex: "currency", width: 100 },
                      {
                        title: "GST",
                        dataIndex: "gst",
                        render: (text) => `${text}%`,
                        align: "right",
                      },
                      {
                        title: "Freight",
                        dataIndex: "freightCharge",
                        align: "right",
                        render: (text) => (text ? `₹${text}` : "N/A"),
                      },
                      {
                        title: "Budget Code",
                        dataIndex: "budgetCode",
                        width: 120,
                      },
                    ]}
                  />
                </div>
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 4 && (
              <div>
                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <AuditOutlined /> Tender Overview
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Tender ID:</strong>{" "}
                        {detailsData.tenderId || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Title:</strong>{" "}
                        {detailsData.titleOfTender || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Bid Type:</strong>{" "}
                        {detailsData.bidType || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Opening Date:</strong>{" "}
                        {detailsData.openingDate || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Closing Date:</strong>{" "}
                        {detailsData.closingDate || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Total Value:</strong>
                        <span className="amount">
                          {detailsData.totalTenderValue
                            ? `₹${detailsData.totalTenderValue.toFixed(2)}`
                            : "N/A"}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <FilePdfOutlined /> Document Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={8}>
                      <div className="detail-item">
                        <strong>Tender Documents:</strong>{" "}
                        {detailsData.uploadTenderDocuments || "N/A"}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="detail-item">
                        <strong>Specific Terms & Conditions:</strong>{" "}
                        {detailsData.uploadSpecificTermsAndConditions || "N/A"}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="detail-item">
                        <strong>General Terms & Conditions:</strong>{" "}
                        {detailsData.uploadGeneralTermsAndConditions || "N/A"}
                      </div>
                    </Col>
                  </Row>
                </div>

                {detailsData.indentResponseDTO &&
                  detailsData.indentResponseDTO.length > 0 && (
                    <div className="detail-section">
                      <Typography.Title level={5} className="section-title">
                        <SolutionOutlined /> Associated Indents (
                        {detailsData.indentResponseDTO.length})
                      </Typography.Title>

                      <div style={{ marginBottom: 16 }}>
                        <strong>Indent IDs: </strong>
                        {detailsData.indentResponseDTO.map((indent, index) => (
                          <Tag
                            color="blue"
                            key={indent.indentId}
                            style={{ margin: "4px 4px" }}
                          >
                            {indent.indentId || `Indent ${index + 1}`}
                          </Tag>
                        ))}
                      </div>

                      <Collapse accordion defaultActiveKey={["0"]}>
                        {detailsData.indentResponseDTO.map((indent, index) => (
                          <Collapse.Panel
                            key={index}
                            header={`Indent ${index + 1} - ${
                              indent.indentId || "N/A"
                            }`}
                            extra={
                              <Tag color={indent.statusColor || "processing"}>
                                {indent.status || "Pending"}
                              </Tag>
                            }
                          >
                            <div style={{ padding: "16px 0" }}>
                              <Row gutter={24}>
                                <Col span={12}>
                                  <div className="detail-item">
                                    <strong>Project Name:</strong>{" "}
                                    {indent.projectName || "N/A"}
                                  </div>
                                  <div className="detail-item">
                                    <strong>Indentor:</strong>{" "}
                                    {indent.indentorName || "N/A"}
                                  </div>
                                  <div className="detail-item">
                                    <strong>Contact:</strong>{" "}
                                    {indent.indentorMobileNo || "N/A"}
                                  </div>
                                </Col>
                                <Col span={12}>
                                  <div className="detail-item">
                                    <strong>Email:</strong>{" "}
                                    {indent.indentorEmailAddress || "N/A"}
                                  </div>
                                  <div className="detail-item">
                                    <strong>Location:</strong>{" "}
                                    {indent.consignesLocation || "N/A"}
                                  </div>
                                  <div className="detail-item">
                                    <strong>Total Value:</strong> ₹
                                    {indent.totalPriceOfAllMaterials?.toFixed(
                                      2
                                    ) || "N/A"}
                                  </div>
                                </Col>
                              </Row>

                              {indent.isPreBidMeetingRequired && (
                                <div style={{ marginTop: 16 }}>
                                  <Divider orientation="left" plain>
                                    Pre-Bid Meeting Details
                                  </Divider>
                                  <Row gutter={24}>
                                    <Col span={12}>
                                      <div className="detail-item">
                                        <strong>Date:</strong>{" "}
                                        {indent.preBidMeetingDate || "N/A"}
                                      </div>
                                    </Col>
                                    <Col span={12}>
                                      <div className="detail-item">
                                        <strong>Venue:</strong>{" "}
                                        {indent.preBidMeetingVenue || "N/A"}
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              )}

                              <Divider orientation="left" plain>
                                Material Requirements
                              </Divider>

                              {indent.materialDetails?.length > 0 ? (
                                <Table
                                  dataSource={indent.materialDetails}
                                  pagination={false}
                                  bordered
                                  size="small"
                                  rowKey="materialCode"
                                  columns={[
                                    {
                                      title: "Material Code",
                                      dataIndex: "materialCode",
                                      width: 120,
                                    },
                                    {
                                      title: "Description",
                                      dataIndex: "materialDescription",
                                      ellipsis: true,
                                    },
                                    {
                                      title: "Quantity",
                                      dataIndex: "quantity",
                                      align: "right",
                                    },
                                    {
                                      title: "Unit Price",
                                      dataIndex: "unitPrice",
                                      align: "right",
                                      render: (text) => `₹${text?.toFixed(2)}`,
                                    },
                                    {
                                      title: "Total Price",
                                      dataIndex: "totalPrice",
                                      align: "right",
                                      render: (text) => (
                                        <span style={{ fontWeight: 500 }}>
                                          ₹{text?.toFixed(2)}
                                        </span>
                                      ),
                                    },
                                    {
                                      title: "UOM",
                                      dataIndex: "uom",
                                      width: 100,
                                    },
                                    {
                                      title: "Budget Code",
                                      dataIndex: "budgetCode",
                                      width: 120,
                                    },
                                  ]}
                                />
                              ) : (
                                <div
                                  style={{ textAlign: "center", padding: 16 }}
                                >
                                  <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No material details found"
                                  />
                                </div>
                              )}
                            </div>
                          </Collapse.Panel>
                        ))}
                      </Collapse>
                    </div>
                  )}
              </div>
            )}

            {parseInt(selectedRecord?.workflowId, 10) === 5 && (
              <div>
                <div className="detail-section">
                  <Typography.Title level={5} className="section-title">
                    <ToolOutlined /> Service Order Details
                  </Typography.Title>
                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Service Order ID:</strong>{" "}
                        {detailsData.soId || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Created Date:</strong>{" "}
                        {detailsData.createdDate || "N/A"}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-item">
                        <strong>Service Type:</strong>{" "}
                        {detailsData.serviceType || "N/A"}
                      </div>
                      <div className="detail-item">
                        <strong>Status:</strong> {detailsData.status || "N/A"}
                      </div>
                    </Col>
                  </Row>
                  <div className="detail-item">
                    <strong>Service Description:</strong>
                    <div
                      style={{
                        marginTop: 8,
                        padding: 12,
                        background: "#fafafa",
                        borderRadius: 4,
                      }}
                    >
                      {detailsData.details || "No description provided"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin tip="Loading details..." size="large" />
          </div>
        )}
        <QueueHistory
          requestId={selectedRecord?.requestId}
          open={historyVisible}
          onCancel={() => setHistoryVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default QueueTable;
