import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const PoStatus = () => {
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
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    key: 'submittedDate',
    filterable: true,
  },
  {
    title: 'Pending With',
    dataIndex: 'pendingWith',
    key: 'pendingWith',
    filterable: true,
  },
  
  {
    title: 'Pending From',
    dataIndex: 'pendingFrom',
    key: 'pendingFrom',
    filterable: true,
  },
    {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    filterable: true,
  },
  {
    title: 'On Date',
    dataIndex: 'asOnDate',
    key: 'asOnDate',
    filterable: true,
  },
    {
      title: 'purchase Order Materials',
      dataIndex: 'purchaseOrderAttributes',
      key: 'purchaseOrderAttributes',
      render: (purchaseOrderAttributes) => (
        <Table
          dataSource={purchaseOrderAttributes}
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
    title: 'Freight Charge',
    dataIndex: 'freightCharge',
    key: 'freightCharge',
  },
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/pending-po-report";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Po Status" filterType="date"/>
    </div>
  );
};

export default PoStatus;
