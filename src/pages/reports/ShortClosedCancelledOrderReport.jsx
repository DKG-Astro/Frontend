import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const ShortClosedCancelledOrderReport = () => {
 const columns = [
    {
      title: 'PO ID',
      dataIndex: 'poId',
      key: 'poId',
      filterable: true,
    },
    {
      title: 'Tender ID',
      dataIndex: 'tenderId',
      key: 'tenderId',
      filterable: true,
    },
    {
      title: 'Indent IDs',
      dataIndex: 'indentIds',
      key: 'indentIds',
      filterable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filterable: true,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      filterable: true,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      filterable: true,
    },
    {
      title: 'Materials',
      dataIndex: 'materials',
      key: 'materials',
      render: (materials) => (
        <Table
          dataSource={materials}
          pagination={false}
          rowKey={(record, index) => index}
          columns={[
            {
              title: 'Material Code',
              dataIndex: 'materialCode',
              key: 'materialCode',
            },
            {
              title: 'Material Description',
              dataIndex: 'materialDescription',
              key: 'materialDescription',
            },
          ]}
        />
      ),
    },
  ];

  const api = "/api/reports/ShortClosedCancelledOrderReport";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Short Closed Cancelled Order Report" showFilter />
    </div>
  );
};

export default ShortClosedCancelledOrderReport;
