import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const MonthlyProcurementReport = () => {
 const columns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    filterable: true,
  },
  {
    title: 'PO Number',
    dataIndex: 'poNumber',
    key: 'poNumber',
    filterable: true,
  },
  {
    title: 'Gem or Non-Gem',
    dataIndex: 'modeOfProcurement',
    key: 'modeOfProcurement',
    filterable: true,
  },
  {
    title: 'PO Date',
    dataIndex: 'date',
    key: 'date',
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
  
];


  const api = "/api/reports/MonthlyProcurementReport";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Monthly Procurement Report" filterType="date" />
    </div>
  );
};

export default MonthlyProcurementReport;
