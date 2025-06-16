import React from 'react'
import CustomReport from '../../components/DKG_Report';

const VendorContract = () => {
  const api = "/api/reports/vendor-contracts/report"
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      filterable: true
    },
    {
      title: "Mode of Procurement",
      dataIndex: "modeOfProcurement",
      key: "modeOfProcurement",
      filterable: true
    },
    {
      title: "Under AMC",
      dataIndex: "underAmc",
      key: "underAmc",
      filterable: true
    },
    {
      title: "AMC Expiry Date",
      dataIndex: "amcExpiryDate",
      key: "amcExpiryDate",
      filterable: true
    },
    {
      title: "AMC For",
      dataIndex: "amcFor",
      key: "amcFor",
      filterable: true
    },
    {
      title: "End User",
      dataIndex: "endUser",
      key: "endUser",
      filterable: true
    },
    {
      title: "No. of Participants",
      dataIndex: "noOfParticipants",
      key: "noOfParticipants",
      filterable: true
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      filterable: true
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      filterable: true
    },
    {
      title: "Previously Renewed AMCs",
      dataIndex: "previouslyRenewedAmcs",
      key: "previouslyRenewedAmcs",
      filterable: true
    },
    {
      title: "Category of Security",
      dataIndex: "categoryOfSecurity",
      key: "categoryOfSecurity",
      filterable: true
    },
    {
      title: "Validity of Security",
      dataIndex: "validityOfSecurity",
      key: "validityOfSecurity",
      filterable: true
    },
  ];
  return <CustomReport api={api} columns={columns} title="Vendor Contract Report" filterType="date" />
}

export default VendorContract
