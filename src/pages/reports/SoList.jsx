import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const SoList = () => {
  const columns = [
    {
    title: 'Approved Date',
    dataIndex: 'approvedDate',
    key: 'approvedDate',
    filterable: true,
  },
  {
    title: 'SO ID',
    dataIndex: 'soId',
    key: 'soId',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId',
    filterable: true,
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    filterable: true,
  },
  {
    title: 'Vendor ID',
    dataIndex: 'vendorId',
    key: 'vendorId',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds',
    filterable: true,
  },
  {
    title: 'Mode of Procurement',
    dataIndex: 'modeOfProcurement',
    key: 'modeOfProcurement',
    filterable: true,
  },
    {
      title: 'Service Order Materials',
      dataIndex: 'materials',
      key: 'materials',
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

  const api = "/api/reports/soList-report";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="So List" filterType="date"/>
    </div>
  );
};

export default SoList;
