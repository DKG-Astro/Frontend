import React from 'react'
import CustomReport from '../../components/DKG_Report';

const CpReport = () => {
  const api = "/api/reports/cp/report"
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      filterable: true
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      filterable: true
    },
    {
      title: 'Material Category',
      dataIndex: 'materialCategory',
      key: 'materialCategory',
      filterable: true
    },
    {
      title: 'Material Sub-Category',
      dataIndex: 'materialSubCategory',
      key: 'materialSubCategory',
      filterable: true
    },
    {
      title: 'End User',
      dataIndex: 'endUser',
      key: 'endUser',
      filterable: true
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      filterable: true,
      render: (value) => `$${value.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Paid To',
      dataIndex: 'paidTo',
      key: 'paidTo',
      filterable: true
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filterable: true
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      filterable: true
    },
  ];
  
  return <CustomReport showFilter api={api} columns={columns} title="Contingency Purchase Report" />
}

export default CpReport
