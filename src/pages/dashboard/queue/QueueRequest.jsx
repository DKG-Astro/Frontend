import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Popover,
  Tag,
  message,
  Spin,
  Select,
  Descriptions, Badge,
  Modal
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import QueueModal from "./QueueModal";
import { useNavigate } from "react-router-dom";
// import { render } from "@testing-library/react";

const { Text } = Typography;


const MaterialDetailModal = ({ visible, setVisible, materialData }) => {
  if (!materialData) return null;
  
  return (
    <Modal
      title="Material Details"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="close" onClick={() => setVisible(false)}>
          Close
        </Button>
      ]}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Material Code" span={2}>
          {materialData.materialCode}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {materialData.description}
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {materialData.category}
        </Descriptions.Item>
        <Descriptions.Item label="Sub Category">
          {materialData.subCategory}
        </Descriptions.Item>
        <Descriptions.Item label="UOM">
          {materialData.uom}
        </Descriptions.Item>
        <Descriptions.Item label="Unit Price">
          {materialData.currency} {materialData.unitPrice}
        </Descriptions.Item>
        <Descriptions.Item label="Origin">
          {materialData.indigenousOrImported ? "Indigenous" : "Imported"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {materialData.createdBy}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {new Date(materialData.createdDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated Date">
          {new Date(materialData.updatedDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={2}>
          <Badge 
            status={materialData.approvalStatus === "APPROVED" ? "success" : 
                   materialData.approvalStatus === "REJECTED" ? "error" : "warning"} 
            text={materialData.approvalStatus.replace("_", " ")} 
          />
        </Descriptions.Item>
        <Descriptions.Item label="Comments" span={2}>
          {materialData.comments || "No comments"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const FilterComponent = (
  { onSearch, searchTerm, onReset } // Changed prop name
) => (
  <div style={{ marginBottom: 16 }}>
    <Space>
      <Input
        placeholder="Search by Request ID"
        prefix={<SearchOutlined />}
        value={searchTerm} // Now using searchTerm
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 300 }}
        onPressEnter={() => onSearch(searchTerm)}
        allowClear
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={() => onSearch(searchTerm)}
      >
        Search
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </Space>
  </div>
);

const QueueRequest = () => {
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
  //   const [searchRequestId, setSearchRequestId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [queueData, setQueueData] = useState([]);

  // --- 2. Fetch the current user details from the UserMaster API ---
  //   useEffect(() => {
  //     const fetchCurrentUser = async () => {
  //       try {
  //         const response = await axios.get(
  //           "http://103.181.158.220:8081/astro-service/api/userMaster"
  //         );
  //         const userData = response.data.responseData;
  //         if (userData && userData.length > 0) {
  //           setCurrentUserId(userData[0].userId);
  //         } else {
  //           message.error("No user data found.");
  //         }
  //       } catch (error) {
  //         message.error("Failed to fetch user details.");
  //         console.error("User fetch error:", error);
  //       }
  //     };
  //     fetchCurrentUser();
  //   }, []);

  // When the logged-in role information is available, fetch queue data
  useEffect(() => {
    if (auth && auth.role) {
      fetchData(auth.role);
    }
  }, [auth.role]);

  // // --- Helper function: Fetch workflowTransitionId for a given requestId ---
  // const fetchWorkflowTransitionId = async (requestId) => {
  //   try {
  //     const response = await axios.get(
  //       `http://103.181.158.220:8081/astro-service/pendingWorkflowTransitionQueue?requestId=${requestId}`
  //     );
  //     const data = response.data.responseData;
  //     if (Array.isArray(data) && data.length > 0) {
  //       return data[0].workflowTransitionId;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error fetching workflowTransitionId:", error);
  //     return null;
  //   }
  // };

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
    console.log("Handleapprove clicked: ", record);
    // if (!currentUserId) {
    //   message.error("User details not loaded yet.");
    //   return;
    // }
    try {
      // const workflowTransitionId = await fetchWorkflowTransitionId(
      //   record.requestId
      // );

      if (record.requestId.startsWith("V")) {
        await axios.post("/api/vendor-master-util/performAction", {
          action: "APPROVED",
          actionBy: actionPerformer,
          remarks: "Vendor approved",
          requestId: record.requestId,
        });
      } else if (record.requestId.startsWith("M")) {
        await axios.post("/api/material-master-util/performActionForMaterial", {
          action: "APPROVED",
          actionBy: actionPerformer,
          remarks: "Material approved",
          requestId: record.requestId,
        });
      } else {
        const workflowTransitionId = record.workflowTransitionId;
        if (!workflowTransitionId) {
          message.error("Workflow transition ID not found for this request.");
          return;
        }
        // Existing approval logic
        const payload = {
          action: "APPROVED",
          actionBy: actionPerformer,
          assignmentRole: null,
          remarks: "Approved successfully",
          requestId: record.requestId,
          workflowTransitionId: record.workflowTransitionId,
        };
        await axios.post("/performTransitionAction", payload);
      }
      message.success(`Request ${record.requestId} processed`);
      setData((prev) => prev.filter((item) => item.key !== record.key));
    } catch (error) {
      message.error("Failed to approve");
      console.error("Approval error:", error);
    }
  };

  const navigate = useNavigate()

  const fetchWorkflowTransitionHistory = async (requestId) => {
    try {
      const response = await axios.get(
        `/workflowTransitionHistory?requestId=${requestId}`
      );
      if (!response.data.responseData?.[0]?.remarks) {
        console.warn("No remarks found in transition history");
      }
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
    // if (!currentUserId) {
    //   message.error("User details not loaded yet.");
    //   return;
    // }
    try {
      // Get full transition history
      if (record.requestId.startsWith("V")) {
        await axios.post("/api/vendor-master-util/performAction", {
          action: "REJECTED",
          actionBy: actionPerformer,
          remarks: rejectComment,
          requestId: record.requestId,
        });
      } else if (record.requestId.startsWith("M")) {
        await axios.post("/api/material-master-util/performActionForMaterial", {
          action: "REJECTED",
          actionBy: actionPerformer,
          remarks: rejectComment,
          requestId: record.requestId,
        });
      } else {
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

        await axios.post("/performTransitionAction", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      message.success(`Request ${record.requestId} rejected and out of queue`);
      setData((prevData) => prevData.filter((item) => item.key !== record.key));
      setRejectComment("");
    } catch (error) {
      message.error("Failed to reject");
      console.error("Rejection error:", error);
    }
  };

  const handleRequestChangeSubmit = async (record) => {
    if (!requestChangeComment.trim()) {
      message.warning("Please enter request change comments.");
      return;
    }
    // if (!currentUserId) {
    //   message.error("User details not loaded yet.");
    //   return;
    // }

    try {
      // const workflowTransitionId = await fetchWorkflowTransitionId(
      //   record.requestId
      // );
      if (record.requestId.startsWith("V")) {
        await axios.post("/api/vendor-master-util/performAction", {
          action: "CHANGE REQUEST",
          actionBy: actionPerformer,
          remarks: requestChangeComment,
          requestId: record.requestId,
        });
      } else if (record.requestId.startsWith("M")) {
        await axios.post("/api/material-master-util/performActionForMaterial", {
          action: "CHANGE REQUEST",
          actionBy: actionPerformer,
          remarks: requestChangeComment,
          requestId: record.requestId,
        });
      } else {
        if (!selectedRole) {
          message.warning("Please select a role.");
          return;
        }
        const workflowTransitionId = record.workflowTransitionId;
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
          // workflowTransitionId: await fetchWorkflowTransitionId(record.requestId),
          workflowTransitionId: record.workflowTransitionId,
        };

        await axios.post("/performTransitionAction", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

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

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialDtl, setMaterialDtl] = useState(null);

  // --- Fetch details based on workflowId ---
  const fetchWorkflowDetails = async (record) => {
    if (!record.requestId) {
      message.error("No ID found.");
      return;
    }

    if(record.requestId.startsWith("M")) {
      const {data} = await axios.get(
        `/api/material-master-util/${record.requestId}`
      )
      setMaterialDtl(data.responseData)
      setMaterialModalOpen(true)
      return
    }
    // Save the selected record so we can use its details in the Modal
    setSelectedRecord(record);
    setLoading(true);

    let endpoint = "";
    const workflowId = parseInt(record.workflowId, 10);

    switch (workflowId) {
      case 1:
        endpoint = `/api/indents/${record.requestId}`;
        break;
      case 2:
        endpoint = `/api/contigency-purchase/${record.requestId}`;
        break;
      case 3:
        endpoint = `/api/purchase-orders/${record.requestId}`;
        break;
      case 4:
        endpoint = `/api/tender-requests/${record.requestId}`;
        break;
      case 5:
        endpoint = `/api/service-orders/${record.requestId}`;
        break;
      case 6:
        endpoint = `/api/vendor-master-util/${record.requestId}`;
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
      setData((prev) =>
        prev.map((item) =>
          item.requestId === record.requestId
            ? {
                ...item,
                ...getCommonFields(response.data),
              }
            : item
        )
      );
    } catch (err) {
      message.error("Failed to fetch details.");
      console.error("Fetch details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCommonFields = (apiResponse) => {
    const workflowId = apiResponse.responseData.workflowId; // Add workflowId to API response
    return {
      indentor: getCommonField(workflowId, apiResponse, "indentor"),
      amount: getCommonField(workflowId, apiResponse, "amount"),
      project: getCommonField(workflowId, apiResponse, "project"),
      // Add other fields
    };
  };

  const fetchData = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/pendingWorkflowTransitionQueue?roleName=${encodeURIComponent(
          roleName
        )}`
      );
      //   const apiData = response.data.responseData;
      //   const formattedData = apiData.map((item, index) => ({
      //     key: index.toString(),
      //     requestId: item.requestId,
      //     originalRequestId: item.requestId,
      //     workflowId: item.workflowId, // Note: we'll use workflowId here
      //     workflowName: item.workflowName,
      //     status: item.nextAction,
      //     remarks: item.remarks || "No remarks",
      //   }));
      const formattedData = response.data.responseData
        .map((item) => ({
          key: item.requestId,
          requestId: item.requestId,
          workflowId: item.workflowId,
          workflowName: item.workflowName,
          createdDate: new Date(item.createdDate),
          remarks: item.transitionHistory?.[0]?.remarks || "No remarks",
          // Correct field mappings based on workflowId
          ...(item.workflowId === 1 && {
            // Indent
            indentorName: item.indentorName,
            amount: item.amount,
            projectName: item.projectName,
            budgetName: item.budgetName,
            modeOfProcurement: item.modeOfProcurement,
            consignee: item.consignee,
          }),
          ...(item.workflowId === 2 && {
            // Contingency Purchase
            createdBy: item.createdBy,
            amount: item.amount,
            projectName: item.projectName,
            consignee: item.deliveryLocation,
          }),
          ...(item.workflowId === 3 && {
            // Purchase Order
            createdBy: item.createdBy,
            amount: item.amount,
            projectName: item.projectName,
            budgetCode: item.budgetCode,
            procurementType: item.procurementType,
            consignee: item.consignee,
          }),
          ...(item.workflowId === 4 && {
            // Tender
            createdBy: item.createdBy,
            projectName: item.projectName,
            budgetCode: item.budgetCode,
            procurementType: item.procurementType,
            consignee: item.deliveryAddress,
          }),
          ...(item.workflowId === 5 && {
            createdBy: item.createdBy,
            projectName: item.projectName,
            budgetCode: item.budgetCode,
            procurementType: item.procurementType,
            consignee: item.consignee,
          }),
          status: item.nextAction,
          workflowTransitionId: item.workflowTransitionId,
        }))
        .sort((a, b) => b.createdDate - a.createdDate);
      setData(formattedData);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch queue data from the API.");
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };

const {userId} = useSelector(state => state.auth)

  const getCommonField = (workflowId, apiData, field) => {
    switch (workflowId) {
      // Indent (workflowId=1)
      case 1:
        return {
          indentor: apiData.indentorName,
          amount: apiData.amount,
          project: apiData.projectName,
          budgetName: apiData.budgetName,
          indentTitle: apiData.workflowName,
          modeOfProcurement: apiData.modeOfProcurement,
          consignee: apiData.consignee,
        }[field];

      // Contingency Purchase (workflowId=2)
      case 2:
        return {
          indentor: apiData.createdBy,
          amount: apiData.amount,
          project: apiData.projectName,
          budgetName: "-", // Contingency may not have budget
          indentTitle: "Contingency Purchase",
          procurementMode: "Direct Purchase",
          indentor: apiData.vendorsName
            ? `${apiData.vendorsName} (${apiData.createdBy})`
            : `User ${apiData.createdBy}`,
          consignee: apiData.consignee,
        }[field];

      // Purchase Order (workflowId=3)
      case 3:
        return {
          indentor: apiData.createdBy,
          amount: apiData.amount,
          project:
            apiData.tenderDetails?.indentResponseDTO?.[0]?.projectName || "N/A",
          budgetName: apiData.budgetCode,
          indentTitle: "Purchase Order",
          procurementMode: apiData.procurementType,
          consignee: apiData.consignee,
        }[field];

      // Add cases 4 (Tender) and 5 (Service Order) similarly
      case 4:
        return {
          indentor: apiData.createdBy,
          //   amount: apiData.totalValueOfPo,
          project: apiData.projectName,
          budgetName: apiData.budgetCode,
          indentTitle: "Tender",
          procurementMode: apiData.procurementType,
          consignee: apiData.deliveryAddress,
        }[field];

      case 5:
        return {
          indentor: apiData.createdBy,
          //   amount: apiData.totalValueOfPo,
          project: apiData.projectName,
          budgetName: apiData.budgetCode,
          indentTitle: "Service Order",
          procurementMode: apiData.procurementType,
          consignee: apiData.consignee,
        }[field];

      default:
        return "-";
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      render: (text, record) => (
        <Button type="link" onClick={() => fetchWorkflowDetails(record)}>
          {text}
        </Button>
      ),
      fixed: "left",
    },
    {
      title: "Indentor",
      dataIndex: "indentor",
      key: "indentor",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "indentor") || "-",
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => {
        const amount = getCommonField(record.workflowId, record, "amount");
        return amount ? `₹${amount}` : "-";
      },
      sorter: (a, b) => a.totalPriceOfAllMaterials - b.totalPriceOfAllMaterials,
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "project",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "project") || "-",
    },
    {
      title: "Budget Name",
      dataIndex: "budgetName",
      key: "budgetName",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "budget") || "-",
    },
    {
      title: "Indentor Title",
      dataIndex: "workflowName",
      key: "indentTitle",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "indentTitle") || "-",
    },
    {
      title: "Mode of Procurement",
      dataIndex: "modeOfProcurement",
      key: "modeOfProcurement",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "modeOfProcurement") || "-",
    },
    {
      title: "Consignee",
      dataIndex: "consignee", // Match modal's consignesLocation
      key: "consignee",
      render: (_, record) =>
        getCommonField(record.workflowId, record, "consignee") || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    // {
    //   title: "Remarks",
    //   dataIndex: "remarks",
    //   key: "remarks",
    //   render: (text, record) => (
    //     <span>
    //       {text || record.transitionHistory?.[0]?.action || "No remarks"}
    //     </span>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => {
        // For Material requests (IDs starting with 'M'), show only Edit button
        // if (record.requestId.startsWith('M')) {
        //   return (
        //     <Button 
        //       type="primary" 
        //       onClick={() => navigate("/masters", {state: {materialCode: record.requestId, master: "Material"}})}
        //     >
        //       Edit
        //     </Button>
        //   );
        // }
        
        // For user ID 18, only show edit button for all request types
        if ((userId === 18) && record.requestId.startsWith('M')) {
          return (
            <Button 
              type="primary" 
              onClick={() => navigate("/masters", {state: {materialCode: record.requestId, master: "Material"}})}
            >
              Edit
            </Button>
          )
        }

        if((userId === 18) && !record.requestId.startsWith('M')) {
          return (
            <Button
              type="primary"
              onClick={() => fetchWorkflowDetails(record)}
            >
              Edit
            </Button>
          )
        }
        
        // For user ID 29, show all options
        if (userId === 29) {

          if (record.status === "Approved") return null;
          return (
            <Space>
              {
                record.requestId.startsWith('M') ? (
                  <Button
                    type="primary"
                    onClick={() => navigate("/masters", {state: {materialCode: record.requestId, master: "Material"}})}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => fetchWorkflowDetails(record)}
                  >
                    Edit
                  </Button>
                )
              }
              {/* <Button 
                type="primary" 
                onClick={() => fetchWorkflowDetails(record)}
                style={{ marginRight: 8 }}
              >
                Editss
              </Button> */}
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
                    if (record.requestId.startsWith("M")) {
                      // Hardcode for material workflow
                      setPreviousRoles(["Indent Creator"]);
                      setSelectedRole("Indent Creator");
                      setLoadingPreviousRoles(false);
                    } else {
                      // Normal workflow - fetch previous roles
                      fetchPreviousRoles(record.workflowId, record.requestId);
                    }
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
        }
        
        // For other users, show the default options
        if (record.status === "Approved") return null;
        return (
          <Space>
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
                  if (record.requestId.startsWith("M")) {
                    // Hardcode for material workflow
                    setPreviousRoles(["Indent Creator"]);
                    setSelectedRole("Indent Creator");
                    setLoadingPreviousRoles(false);
                  } else {
                    // Normal workflow - fetch previous roles
                    fetchPreviousRoles(record.workflowId, record.requestId);
                  }
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
    item.requestId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleReset = useCallback(() => {
    // setSearchRequestId("");
    setSearchTerm("");
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <FilterComponent
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onReset={handleReset}
      />

      {loading ? (
        <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="key" />
      )}
      <QueueModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedRecord={selectedRecord}
        detailsData={detailsData}
        historyVisible={historyVisible}
        setHistoryVisible={setHistoryVisible}
      />
      <MaterialDetailModal 
        visible={materialModalOpen}
        setVisible={setMaterialModalOpen}
        materialData={materialDtl}
      />
    </div>
  );
};

export default QueueRequest;
