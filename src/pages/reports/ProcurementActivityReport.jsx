import React from 'react'
import CustomReport from '../../components/DKG_Report';

const ProcurementActivityReport = () => {
  const api = "/api/reports/procurement-activity-report"
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId_p",
      filterable: true
    },
    {
      title: "Gem or Non-Gem",
      dataIndex: "gemOrNonGem",
      key: "gemOrNonGem_p",
      filterable: true
    },
    {
      title: "Indentor",
      dataIndex: "indentor",
      key: "indentor_p",
      filterable: true
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value_p",
      filterable: true
    },
    {
      title: "Description of Goods",
      dataIndex: "descriptionOfGoods",
      key: "descriptionOfGoods_p",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName_p",
      filterable: true
    },
  ];
  return <CustomReport api={api} columns={columns} title="Procurement Activity Report" filterType="date" storageKey="PROCUREMENTACT_REPORT_COLUMNS"/>
}

export default ProcurementActivityReport
