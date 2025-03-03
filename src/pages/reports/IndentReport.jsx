import React from 'react'
import CustomReport from '../../components/DKG_Report';

const IndentReport = () => {
  const api = "/astro-service/api/reports/indent"
  const columns = [
    {
      title: "Indent ID",
      dataIndex: "indentId",
      key: "indentId",
      filterable: true
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate",
      filterable: true
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      filterable: true
    },
    {
      title: "Tender Request",
      dataIndex: "tenderRequest",
      key: "tenderRequest",
      filterable: true
    },
    {
      title: "Mode of Tendering",
      dataIndex: "modeOfTendering",
      key: "modeOfTendering",
      filterable: true
    },
    {
      title: "Corresponding PO/SO",
      dataIndex: "correspondingPoSo",
      key: "correspondingPoSo",
      filterable: true
    },
    {
      title: "Status of PO/SO",
      dataIndex: "statusOfPoSo",
      key: "statusOfPoSo",
      filterable: true
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      filterable: true
    },
    {
      title: "Pending Approval With",
      dataIndex: "pendingApprovalWith",
      key: "pendingApprovalWith",
      filterable: true
    },
    {
      title: "PO/SO Approved Date",
      dataIndex: "poSoApprovedDate",
      key: "poSoApprovedDate",
      filterable: true
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      filterable: true
    },
    {
      title: "Material Category",
      dataIndex: "materialCategory",
      key: "materialCategory",
      filterable: true
    },
    {
      title: "Material Sub Category",
      dataIndex: "materialSubCategory",
      key: "materialSubCategory",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      filterable: true
    },
    {
      title: "Indentor Name",
      dataIndex: "indentorName",
      key: "indentorName",
      filterable: true
    },
    {
      title: "Value of Indent",
      dataIndex: "valueOfIndent",
      key: "valueOfIndent",
      filterable: true
    },
    {
      title: "Value of PO",
      dataIndex: "valueOfPo",
      key: "valueOfPo",
      filterable: true
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      filterable: true
    },
    {
      title: "GRIN No",
      dataIndex: "grinNo",
      key: "grinNo",
      filterable: true
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      filterable: true
    },
    {
      title: "GISS No",
      dataIndex: "gissNo",
      key: "gissNo",
      filterable: true
    },
    {
      title: "Value Pending to be Paid",
      dataIndex: "valuePendingToBePaid",
      key: "valuePendingToBePaid",
      filterable: true
    },
    {
      title: "Current Stage of Indent",
      dataIndex: "currentStageOfIndent",
      key: "currentStageOfIndent",
      filterable: true
    },
    {
      title: "Short Closed and Cancelled",
      dataIndex: "shortClosedAndCancelled",
      key: "shortClosedAndCancelled",
      filterable: true
    },
    {
      title: "Reason for Short Closure",
      dataIndex: "reasonForShortClosure",
      key: "reasonForShortClosure",
      filterable: true
    },
  ];
  
  
  return <CustomReport api={api} columns={columns} title="Indent Report" />
}

export default IndentReport
