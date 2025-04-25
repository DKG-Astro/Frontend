import React, { useEffect, useState } from 'react';
import { message, Table, Button, Space, Popover, Input } from 'antd';
import axios from 'axios';
import TableComponent from '../../../components/DKG_Table';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GatePass = () => {
  const [rejectComment, setRejectComment] = useState('');
  const {role} = useSelector(state => state?.auth);

  const handleApprove = async (record) => {
    try {
      await axios.post(`/api/process-controller/approveOgp?processNo=${"INV/" + record.ogpSubProcessId}`, {
        processNo: record.ogpSubProcessId,
        type: record?.issueNoteId? "ISN" : "PO"
      });
      message.success('Gate Pass approved successfully');
      fetchGatePassData(); // Refresh the data
    } catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to approve Gate Pass');
    }
  };

  const navigate = useNavigate();

  const handleCreateIGP = async (record) => {
    navigate("/inventory/inward", {state: {processNo: `INV/${record.ogpSubProcessId}`, type: record?.issueNoteId ? "Goods Issue" : "PO"}})
  };

  const handleReject = async (record) => {
    try {
      await axios.post(`/api/process-controller/rejectOgp?processNo=${"INV/" + record.ogpSubProcessId}`, {
        processNo: record.ogpSubProcessId,
        type: record?.issueNoteId ? "ISN" : "PO",
        comments: rejectComment
      });
      message.success('Gate Pass rejected successfully');
      setRejectComment('');
      fetchGatePassData();
    } catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to reject Gate Pass');
    }
  };

  const columns = [
    { 
      title: 'Issue Note ID', 
      dataIndex: 'issueNoteId', 
      key: 'issueNoteId', 
      searchable: true,
      fixed: 'left',
      render: (text) => text ? "INV/"+text : ""
    },
    { 
      title: 'OGP Sub Process ID', 
      dataIndex: 'ogpSubProcessId', 
      key: 'ogpSubProcessId', 
      searchable: true,
      render: (text) => text ? "INV/"+text : ""
    },
    { 
      title: 'IGP Sub Process ID', 
      dataIndex: 'igpSubProcessId', 
      key: 'igpSubProcessId', 
      searchable: true,
      render: (text) => text ? "INV/"+text : ""
    },
    { 
      title: 'PO ID', 
      dataIndex: 'poId', 
      key: 'poId',
      searchable: true
    },
    { 
      title: 'Approval Status', 
      dataIndex: 'status', 
      key: 'status', 
      // searchable: true 
    },
    {
      title: 'Material Details',
      dataIndex: 'details',
      key: 'details',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Type', dataIndex: 'type', key: 'type' }
          ]}
        />
      )
    },
    ...(role === "Store Purchase Office" ? [{
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => {
        if (record.status === 'AWAITING APPROVAL') {
          return (
            <Space>
              <Button type="primary" onClick={() => handleApprove(record)}>
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
                <Button danger>
                  Reject
                </Button>
              </Popover>
            </Space>
          );
        }
        
        if (record.status === 'APPROVED' && !record.igpSubProcessId) {
          return (
            <Button type="primary" onClick={() => handleCreateIGP(record)}>
              Create IGP
            </Button>
          );
        }
        
        return null;
      }
    }] : [])
  ];

  const [dataSource, setDataSource] = useState([]);

  const fetchGatePassData = async () => {
    try {
      const { data } = await axios.get('/api/process-controller/getGatePassReport');
      setDataSource(data?.responseData || []);
    } catch (error) {
      message.error('Error fetching gate pass details.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGatePassData();
  }, []);

  return (
    <div>
      <TableComponent dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default GatePass;
