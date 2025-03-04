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
import { SearchOutlined } from "@ant-design/icons";
// import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

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

const QueueRequest = () => {
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

  const fetchData = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/pendingWorkflowTransition?roleName=${encodeURIComponent(
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
        workflowTransitionId,
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
    <div>
      <FilterComponent
        onSearch={handleSearch}
        searchRequestId={searchRequestId}
        onReset={handleReset}
      />
      {loading ? (
        <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="key" />
      )}
    </div>
  );
};

export default QueueRequest;
