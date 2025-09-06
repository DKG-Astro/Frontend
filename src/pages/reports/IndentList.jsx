import React, {useEffect,useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IndentList = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);

  const columns = [
    {
      title: 'Indent ID',
      dataIndex: 'indentId',
      key: 'indentId_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Name',
      dataIndex: 'indentorName',
      key: 'indentorName_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Mobile No',
      dataIndex: 'indentorMobileNo',
      key: 'indentorMobileNo_INDENT',
      filterable: true,
    },
    {
      title: 'Indentor Email',
      dataIndex: 'indentorEmailAddress',
      key: 'indentorEmailAddress_INDENT',
      filterable: true,
    },
    {
      title: 'Consignes Location',
      dataIndex: 'consignesLocation',
      key: 'consignesLocation_INDENT',
      filterable: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName_INDENT',
      filterable: true,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate_INDENT',
      filterable: true,
    },
    {
      title: 'Pending With',
      dataIndex: 'pendingWith',
      key: 'pendingWith_INDENT',
      filterable: true,
    },
    {
      title: 'Pending From',
      dataIndex: 'pendingFrom',
      key: 'pendingFrom_INDENT',
      filterable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status_INDENT',
      filterable: true,
    },
    {
      title: 'As On Date',
      dataIndex: 'asOnDate',
      key: 'asOnDate_INDENT',
      filterable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy_INDENT',
      filterable: true,
    },
    {
      title: 'Material Details',
      dataIndex: 'materialDetails',
      key: 'materialDetails_INDENT',
      render: (materialDetails) => (
        <Table
          dataSource={materialDetails}
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
              title: 'Unit Price',
              dataIndex: 'unitPrice',
              key: 'unitPrice',
            },
            {
              title: 'UOM',
              dataIndex: 'uom',
              key: 'uom',
            },
            {
              title: 'Total Price',
              dataIndex: 'totalPrice',
              key: 'totalPrice',
            },
            {
              title: 'Budget Code',
              dataIndex: 'budgetCode',
              key: 'budgetCode',
            },
            {
              title: 'Material Category',
              dataIndex: 'materialCategory',
              key: 'materialCategory',
            },
            {
              title: 'Material Sub Category',
              dataIndex: 'materialSubCategory',
              key: 'materialSubCategory',
            },
            {
              title: 'Mode of Procurement',
              dataIndex: 'modeOfProcurement',
              key: 'modeOfProcurement',
            },
            {
              title: 'Currency',
              dataIndex: 'currency',
              key: 'currency',
            },
            {
              title: 'Vendor Names',
              dataIndex: 'vendorNames',
              key: 'vendorNames',
            },
          ]}
        />
      ),
    },
  ];


  const api = "/api/reports/indentList-report";
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };


  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const barData = Object.keys(barDataMap).map(k => ({ name: k, value: barDataMap[k] }));
    const pieData = Object.keys(pieDataMap).map(k => ({ name: k, value: pieDataMap[k] }));

    if (onChartData) onChartData(barData, pieData);
  };

 
  useEffect(() => {
    if (reportData.length > 0) generateChart(reportData);
  }, [selectedBarKey, selectedPieKey]);

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Indent List" filterType="date" storageKey="INDENTLIST_REPORT_COLUMNS" onFetch={handleFetch}/>
    </div>
  );
};

export default IndentList;
