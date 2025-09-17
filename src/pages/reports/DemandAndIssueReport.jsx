import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const DemandAndIssueReport = () => {
  const columns = [
    { title: 'DI ID', dataIndex: 'id', key: 'id', render: (text) => `INV/${text}`, searchable: true },
    { title: 'Location', dataIndex: 'senderLocationId', key: 'senderLocationId', searchable: true },
    { title: 'Status', dataIndex: 'status', key: 'status', searchable: true },
    { title: 'User ID', dataIndex: 'senderCustodianId', key: 'senderCustodianId', searchable: true },
    { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
    { title: 'Issued By', dataIndex: 'issuedBy', key: 'issuedBy', searchable: true },

    {
      title: 'Material Details',
      dataIndex: 'materialDtos',
      key: 'materialDtos',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Desc', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'UOM', dataIndex: 'uom', key: 'uom' },
          ]}
        />
      ),
    },
  ];

  // Backend API for Demand & Issue Report with date filters
  const api = "/api/reports/demand-issue-report";

  return (
    <div>
      <CustomReport
        columns={columns}
        api={api}
        title="Demand & Issue Report"
        filterType="date"
        storageKey="DI_REPORT_COLUMNS"
      />
    </div>
  );
};

export default DemandAndIssueReport;
