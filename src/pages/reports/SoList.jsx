import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const SoList = () => {
  const columns = [
    {
    title: 'Approved Date',
    dataIndex: 'approvedDate',
    key: 'approvedDate_SO',
    filterable: true,
  },
  {
    title: 'SO ID',
    dataIndex: 'soId',
    key: 'soId_SO',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_SO',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_SO',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId_SO',
    filterable: true,
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project_SO',
    filterable: true,
  },
  {
    title: 'Vendor ID',
    dataIndex: 'vendorId',
    key: 'vendorId_SO',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_SO',
    filterable: true,
  },
  {
    title: 'Mode of Procurement',
    dataIndex: 'modeOfProcurement',
    key: 'modeOfProcurement_SO',
    filterable: true,
  },
    {
      title: 'Service Order Materials',
      dataIndex: 'materials',
      key: 'materials_SO',
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
      <CustomReport columns={columns} api={api} title="So List" filterType="date" storageKey="SOLIST_REPORT_COLUMNS"/>
    </div>
  );
};

export default SoList;
