import React, { useEffect, useState } from 'react';
import { message, Table } from 'antd';
import axios from 'axios';
import TableComponent from '../../../components/DKG_Table';

const GatePass = () => {
  const columns = [
    { 
      title: 'Issue Note ID', 
      dataIndex: 'issueNoteId', 
      key: 'issueNoteId', 
      searchable: true,
      fixed: 'left'
    },
    { 
      title: 'OGP Sub Process ID', 
      dataIndex: 'ogpSubProcessId', 
      key: 'ogpSubProcessId', 
      searchable: true 
    },
    { 
      title: 'IGP Sub Process ID', 
      dataIndex: 'igpSubProcessId', 
      key: 'igpSubProcessId', 
      searchable: true 
    },
    { 
      title: 'PO ID', 
      dataIndex: 'poId', 
      key: 'poId', 
      searchable: true 
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
    }
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
