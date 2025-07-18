import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const MonthlyProcurementReport = () => {
 const columns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month_m',
    filterable: true,
  },
  {
    title: 'PO Number',
    dataIndex: 'poNumber',
    key: 'poNumber_m',
    filterable: true,
  },
  {
    title: 'Gem or Non-Gem',
    dataIndex: 'modeOfProcurement',
    key: 'modeOfProcurement_m',
    filterable: true,
  },
  {
    title: 'PO Date',
    dataIndex: 'date',
    key: 'date_m',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_m',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_m',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_m',
    filterable: true,
  },
  
];


  const api = "/api/reports/MonthlyProcurementReport";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Monthly Procurement Report" filterType="date" storageKey="MONTHLYPROC_REPORT_COLUMNS"/>
    </div>
  );
};

export default MonthlyProcurementReport;
