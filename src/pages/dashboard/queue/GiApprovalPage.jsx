import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Space, Modal, Input, Popover } from 'antd';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import InventoryQueueModal from './InventoryQueueModel';
import { SearchOutlined } from "@ant-design/icons";


const { TextArea } = Input;
// Search Input Component
const FilterComponent = ({ searchTerm, setSearchTerm, onSearch, onReset }) => (
  <div style={{ marginBottom: 16 }}>
    <Space>
      <Input
        placeholder="Search by Request ID"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  //Only update input value
        style={{ width: 300 }}
        allowClear
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={onSearch} //Search only on button click
      >
        Search
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </Space>
  </div>
);

const GiApprovalPage = () => {
  const [data, setData] = useState([]);
  const [activePopoverKey, setActivePopoverKey] = useState(null);
  const [comments, setComments] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [rejectComments, setRejectComments] = useState({});
  const [activeRejectKey, setActiveRejectKey] = useState(null);



  const auth = useSelector((state) => state.auth);
  const roleName=auth.role;
  const navigate = useNavigate(); 
  console.log(roleName);

   const fetchData = async () => {
    try {
      const url =
        roleName === 'Store Purchase Officer'
          ? '/api/process-controller/getGiByStatuses'
          : '/api/process-controller/getGiByIndentorStatuses';

      const res = await axios.get(url);
      setData(res.data.responseData || []);
      setFilteredData(res.data.responseData || []); 
    } catch (error) {
      message.error('Failed to fetch GI list');
    }
  };
 
const handleSearch = () => {
  if (!searchTerm.trim()) {
    setFilteredData(data);
    return;
  }
  const lower = searchTerm.toLowerCase();
  const filtered = data.filter(
    (item) =>
      `INV${item.gprnProcessId}/${item.inspectionSubProcessId}`.toLowerCase().includes(lower) ||
      (item.locationId && item.locationId.toLowerCase().includes(lower))
  );
  setFilteredData(filtered);
};

// Reset Button
const handleReset = () => {
  setSearchTerm("");
  setFilteredData(data);
};

  const handleProcessIdClick = async (record) => {
  setModalVisible(true);
  setLoading(true);
  try {
    const processNo = `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`;
    const response = await axios.get(`/api/process-controller/getSubProcessDtls?processStage=GI&processNo=${processNo}`);
    setSelectedRecord(response.data.responseData);
  } catch (error) {
    message.error("Failed to fetch process details");
  } finally {
    setLoading(false);
  }
};


/*
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/process-controller/getGiByStatuses');
      setData(res.data.responseData || []);
    } catch (error) {
      message.error('Failed to fetch GI list');
    }
  };*/

  useEffect(() => {
    fetchData();
  }, []);

  const rowKey = (record) => `${record.gprnProcessId}_${record.inspectionSubProcessId}`;
/*
  const handleApprove = async (record) => {
    try {
      await axios.post('/api/process-controller/approveGi', {
        processNo: `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
      });
      message.success('GI Approved successfully');
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to approve GI');
    }
  };*/
  const handleApprove = async (record) => {
  try {
    const payload = {
      processNo: `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
      remarks: 'Approved',
      createdBy: auth.userId, 
      status: roleName === 'Store Purchase Officer' ? 'APPROVED' : 'AWAITING APPROVAL',
    };

    await axios.post('/api/process-controller/approveGi', payload);

    message.success('GI Approved successfully');
    fetchData();
  } catch (error) {
    message.error(error?.response?.data?.responseStatus?.message || 'Failed to approve GI');
  }
};

/*
  const handleReject = async (record) => {
    Modal.confirm({
      title: 'Reject GI',
      content: 'Are you sure you want to reject this GI?',
      onOk: async () => {
        try {
          await axios.post('/api/process-controller/rejectGi', {
            processNo: `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
          });
          message.success('GI Rejected successfully');
          fetchData();
        } catch (error) {
          message.error(error?.response?.data?.responseStatus?.message || 'Failed to reject GI');
        }
      },
    });
  };*/
  const handleReject = async (record) => {
  const uniqueKey = rowKey(record);
  try {
    await axios.post('/api/process-controller/rejectGi', {
      processNo: `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
      createdBy: auth.userId,
      remarks: rejectComments[uniqueKey],
      status: "REJECTED",
    });
    message.success('GI Rejected successfully');
    setActiveRejectKey(null);
    setRejectComments((prev) => ({ ...prev, [uniqueKey]: '' }));
    fetchData();
  } catch (error) {
    message.error(error?.response?.data?.responseStatus?.message || 'Failed to reject GI');
  }
};


  const handleSubmitChangeRequest = async (record) => {
    const uniqueKey = rowKey(record);
    try {
      await axios.post('/api/process-controller/changeReqGi', {
        processNo: `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
        createdBy: auth.userId,
        remarks: comments[uniqueKey],
        status: "CHANGE REQUEST",
      });
      message.success('GI Change Request sent successfully');
      setActivePopoverKey(null);
      setComments((prev) => ({ ...prev, [uniqueKey]: '' }));
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to send change request');
    }
  };
   const handleEdit = async (record) => {
      navigate("/inventory/goodsInspection", {state: {processNo: "INV" + record.gprnProcessId + "/" + record.inspectionSubProcessId, data: record}});
    };

  const columns = [ 
    {
      title: 'Process ID',
     // render: (_, record) => `INV${record.gprnProcessId}/${record.inspectionSubProcessId}`,
   
  render: (_, record) => (
    <Button type="link" onClick={() => handleProcessIdClick(record)}>
      {`INV${record.gprnProcessId}/${record.inspectionSubProcessId}`}
    </Button>
  ),


    },
    { title: 'Location', dataIndex: 'locationId' },
    { title: 'Installation Date', dataIndex: 'installationDate' },
    { title: 'Commissioning Date', dataIndex: 'commissioningDate' },
    { title: 'Status', dataIndex: 'status' },
    {
  title: 'Actions',
  render: (_, record) => {
    const uniqueKey = rowKey(record);
    if (roleName === 'Indent Creator') {
      return (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit data
        </Button>
      );
    }

    return (
      <Space>
        <Button type="primary" onClick={() => handleApprove(record)}>Approve</Button>
       {/* <Button danger onClick={() => handleReject(record)}>Reject</Button>*/}
       <Popover
      content={
        <div style={{ width: 250 }}>
          <TextArea
            rows={3}
            placeholder="Enter rejection comment"
            value={rejectComments[uniqueKey] || ''}
            onChange={(e) =>
              setRejectComments((prev) => ({
                ...prev,
                [uniqueKey]: e.target.value,
              }))
            }
          />
          <Button
            danger
            style={{ marginTop: 8 }}
            onClick={() => handleReject(record)}
            disabled={!rejectComments[uniqueKey]?.trim()}
          >
            Reject
          </Button>
        </div>
      }
      title="Reject GI"
      trigger="click"
      open={activeRejectKey === uniqueKey}
      onOpenChange={(visible) => {
        setActiveRejectKey(visible ? uniqueKey : null);
      }}
    >
      <Button danger>Reject</Button>
    </Popover>


        <Popover
          content={
            <div style={{ width: 250 }}>
              <TextArea
                rows={3}
                placeholder="Enter comment"
                value={comments[uniqueKey] || ''}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [uniqueKey]: e.target.value,
                  }))
                }
              />
              <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={() => handleSubmitChangeRequest(record)}
                disabled={!comments[uniqueKey]?.trim()}
              >
                Submit
              </Button>
            </div>
          }
          title="Change Request"
          trigger="click"
          open={activePopoverKey === uniqueKey}
          onOpenChange={(visible) => {
            setActivePopoverKey(visible ? uniqueKey : null);
          }}
        >
          <Button type="link">Change Request</Button>
        </Popover>
      </Space>
    );
  },

    },
  ];

  return (
    <>
 <FilterComponent
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  onSearch={handleSearch}
  onReset={handleReset}
/>




    <Table
     // dataSource={data}
      dataSource={filteredData}
      columns={columns}
      rowKey={rowKey}
    />
   <InventoryQueueModal
    modalVisible={modalVisible}
    setModalVisible={setModalVisible}
    selectedRecord={selectedRecord}
    detailsData={selectedRecord} 
    type="GI"
    loading={loading}
    historyVisible={false}
    setHistoryVisible={() => {}}
   />

</>
  );
};

export default GiApprovalPage;
