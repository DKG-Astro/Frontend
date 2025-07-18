import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const PoStatus = () => {
  const columns = [
  {
    title: 'PO ID',
    dataIndex: 'poId',
    key: 'poId_POS',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId_POS',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_POS',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_POS',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_POS',
    filterable: true,
  },
  
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    key: 'submittedDate_POS',
    filterable: true,
  },
  {
    title: 'Pending With',
    dataIndex: 'pendingWith',
    key: 'pendingWith_POS',
    filterable: true,
  },
  
  {
    title: 'Pending From',
    dataIndex: 'pendingFrom',
    key: 'pendingFrom_POS',
    filterable: true,
  },
    {
    title: 'status',
    dataIndex: 'status',
    key: 'status_POS',
    filterable: true,
  },
  {
    title: 'On Date',
    dataIndex: 'asOnDate',
    key: 'asOnDate_POS',
    filterable: true,
  },
    {
      title: 'purchase Order Materials',
      dataIndex: 'purchaseOrderAttributes',
      key: 'purchaseOrderAttributes_POS',
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
      <CustomReport columns={columns} api={api} title="Po Status" filterType="date" storageKey="POSTATUS_REPORT_COLUMNS"/>
    </div>
  );
};

export default PoStatus;
