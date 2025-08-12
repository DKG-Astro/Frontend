import React, { useEffect, useState } from 'react';
import { message, Table, Button, Space } from 'antd';
import axios from 'axios';
import TableComponent from '../../../components/DKG_Table';
import { useSelector } from 'react-redux';

const GoodsTransferQueue = () => {
  const { role } = useSelector(state => state?.auth);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGatePassQueue = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/process-controller/getPendingGt');

      const rows = (data?.responseData || []).map(item => ({
        ...item,
        status: 'AWAITING APPROVAL',
        details: item.materialDtlList || [],
      }));

      setDataSource(rows);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.responseStatus?.message || 'Error fetching pending gate transfers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatePassQueue();
  }, []);

  const handleApprove = async (record) => {
    try {
      await axios.post('/api/process-controller/approveGt', { gtId: record.id });
      message.success('GT approved successfully');
      fetchGatePassQueue();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to approve GT');
    }
  };

  const handleReject = async (record) => {
    try {
      await axios.post('/api/process-controller/rejectGt', { gtId: record.id });
      message.success('GT rejected successfully');
      fetchGatePassQueue();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to reject GT');
    }
  };

  const columns = [
    {
      title: 'GT ID',
      dataIndex: 'id',
      key: 'id',
      searchable: true,
      fixed: 'left',
    },
    {
      title: 'Sender Location',
      dataIndex: 'senderLocationId',
      key: 'senderLocationId',
      searchable: true,
    },
    {
      title: 'Sender Custodian',
      dataIndex: 'senderCustodianId',
      key: 'senderCustodianId',
      searchable: true,
    },
    {
      title: 'Receiver Location',
      dataIndex: 'receiverLocationId',
      key: 'receiverLocationId',
      searchable: true,
    },
    {
      title: 'Receiver Custodian',
      dataIndex: 'receiverCustodianId',
      key: 'receiverCustodianId',
      searchable: true,
    },
    {
      title: 'GT Date',
      dataIndex: 'gtDate',
      key: 'gtDate',
      searchable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Material Details',
      dataIndex: 'details',
      key: 'details',
      render: (details = []) => (
        <Table
          dataSource={details}
          pagination={false}
          rowKey={(r, idx) => r.materialCode || `${r.assetId || 'row'}-${idx}`}
          columns={[
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Sender Locator', dataIndex: 'senderLocatorId', key: 'senderLocatorId' },
            { title: 'Receiver Locator', dataIndex: 'receiverLocatorId', key: 'receiverLocatorId' },
            // { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
            // { title: 'Depreciation Rate', dataIndex: 'depriciationRate', key: 'depriciationRate' },
            // { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue' },
          ]}
        />
      ),
    },
    ...(role === 'Store Purchase Officer'
      ? [
          {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (_, record) =>
              record.status === 'AWAITING APPROVAL' ? (
                <Space>
                  <Button type="primary" onClick={() => handleApprove(record)}>
                    Approve
                  </Button>
                  <Button danger onClick={() => handleReject(record)}>
                    Reject
                  </Button>
                </Space>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div>
      <TableComponent
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        storageKey="GatePassQueue_REPORT_COLUMNS"
      />
    </div>
  );
};

export default GoodsTransferQueue;
