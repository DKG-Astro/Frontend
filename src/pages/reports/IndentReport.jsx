import React from 'react'
import CustomReport from '../../components/DKG_Report';

const IndentReport = () => {
  const api = "/api/reports/indent"
  const columns = [
    {
      title: "Indent ID",
      dataIndex: "indentId",
      key: "indentId_INDENTR",
      filterable: true
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate_INDENTR",
      filterable: true
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo_INDENTR",
      filterable: true
    },
    {
      title: "Tender Request",
      dataIndex: "tenderRequest",
      key: "tenderRequest_INDENTR",
      filterable: true
    },
    {
      title: "Mode of Tendering",
      dataIndex: "modeOfTendering",
      key: "modeOfTendering_INDENTR",
      filterable: true
    },
    {
      title: "Corresponding PO/SO",
      dataIndex: "correspondingPoSo",
      key: "correspondingPoSo_INDENTR",
      filterable: true
    },
    {
      title: "Status of PO/SO",
      dataIndex: "statusOfPoSo",
      key: "statusOfPoSo_INDENTR",
      filterable: true
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate_INDENTR",
      filterable: true
    },
    {
      title: "Pending Approval With",
      dataIndex: "pendingApprovalWith",
      key: "pendingApprovalWith_INDENTR",
      filterable: true
    },
    {
      title: "PO/SO Approved Date",
      dataIndex: "poSoApprovedDate",
      key: "poSoApprovedDate_INDENTR",
      filterable: true
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material_INDENTR",
      filterable: true
    },
    {
      title: "Material Category",
      dataIndex: "materialCategory",
      key: "materialCategory_INDENTR",
      filterable: true
    },
    {
      title: "Material Sub Category",
      dataIndex: "materialSubCategory",
      key: "materialSubCategory_INDENTR",
      filterable: true
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName_INDENTR",
      filterable: true
    },
    {
      title: "Indentor Name",
      dataIndex: "indentorName",
      key: "indentorName_INDENTR",
      filterable: true
    },
    {
      title: "Value of Indent",
      dataIndex: "valueOfIndent",
      key: "valueOfIndent_INDENTR",
      filterable: true
    },
    {
      title: "Value of PO",
      dataIndex: "valueOfPo",
      key: "valueOfPo_INDENTR",
      filterable: true
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project_INDENTR",
      filterable: true
    },
    {
      title: "GRIN No",
      dataIndex: "grinNo",
      key: "grinNo_INDENTR",
      filterable: true
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo_INDENTR",
      filterable: true
    },
    {
      title: "GISS No",
      dataIndex: "gissNo",
      key: "gissNo_INDENTR",
      filterable: true
    },
    {
      title: "Value Pending to be Paid",
      dataIndex: "valuePendingToBePaid",
      key: "valuePendingToBePaid_INDENTR",
      filterable: true
    },
    {
      title: "Current Stage of Indent",
      dataIndex: "currentStageOfIndent",
      key: "currentStageOfIndent_INDENTR",
      filterable: true
    },
    {
      title: "Short Closed and Cancelled",
      dataIndex: "shortClosedAndCancelled",
      key: "shortClosedAndCancelled_INDENTR",
      filterable: true
    },
    {
      title: "Reason for Short Closure",
      dataIndex: "reasonForShortClosure",
      key: "reasonForShortClosure_INDENTR",
      filterable: true
    },
  ];
  
  
  return <CustomReport showFilter api={api} columns={columns} title="Indent Report" filterType="date" storageKey="INDENTREPORT_REPORT_COLUMNS"/>
}

export default IndentReport
