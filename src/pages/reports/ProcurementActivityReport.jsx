import React from 'react'
import CustomReport from '../../components/DKG_Report';

const ProcurementActivityReport = () => {
  const api = "/api/reports/procurement-activity-report"
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      filterable: true
    },
    {
      title: "Gem or Non-Gem",
      dataIndex: "gemOrNonGem",
      key: "gemOrNonGem",
      filterable: true
    },
    {
      title: "Indentor",
      dataIndex: "indentor",
      key: "indentor",
      filterable: true
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      filterable: true
    },
    {
      title: "Description of Goods",
      dataIndex: "descriptionOfGoods",
      key: "descriptionOfGoods",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      filterable: true
    },
  ];
  return <CustomReport api={api} columns={columns} title="Procurement Activity Report" filterType="date" />
}

export default ProcurementActivityReport
