import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const SoStatus = () => {
  const columns = [
   {
    title: 'SO ID',
    dataIndex: 'soId',
    key: 'soId_SOS',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId_SOS',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_SOS',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_SOS',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_SOS',
    filterable: true,
  },
  
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    key: 'submittedDate_SOS',
    filterable: true,
  },
  {
    title: 'Pending With',
    dataIndex: 'pendingWith',
    key: 'pendingWith_SOS',
    filterable: true,
  },
  
  {
    title: 'Pending From',
    dataIndex: 'pendingFrom',
    key: 'pendingFrom_SOS',
    filterable: true,
  },
    {
    title: 'status',
    dataIndex: 'status',
    key: 'status_SOS',
    filterable: true,
  },
  {
    title: 'On Date',
    dataIndex: 'asOnDate',
    key: 'asOnDate_SOS',
    filterable: true,
  },
    {
      title: 'Service Order Materials',
      dataIndex: 'materials',
      key: 'materials_SOS',
      render: (materials) => (
        <Table
          dataSource={materials}
          pagination={false}
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
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Exchange Rate',
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
  },
  {
    title: 'GST',
    dataIndex: 'gst',
    key: 'gst',
  },
  {
    title: 'Duties',
    dataIndex: 'duties',
    key: 'duties',
  },
  {
    title: 'budgetCode',
    dataIndex: 'budgetCode',
    key: 'budgetCode',
  },
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/pending-so-report";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="So Status" filterType="date" storageKey="SOSTATUS_REPORT_COLUMNS"/>
    </div>
  );
};

export default SoStatus;
