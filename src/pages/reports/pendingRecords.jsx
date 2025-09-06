import React, { useState } from "react";
import CustomReport from "../../components/DKG_Report";
import { Table } from "antd";
import { useSelector } from "react-redux"; 

const PendingRecordsReport = ({ roleName,selectedBarKey, selectedPieKey, onChartData }) => {
  const [data, setData] = useState([]);
   const auth = useSelector((state) => state.auth);
   const userName = auth.role;

  // API with dynamic roleName
  const api = `/allPendingRecords?roleName=${encodeURIComponent(roleName)}`;

  // Handle fetch from CustomReport
 const handleFetch = (reportData) => {
    const finalData = reportData || [];
    setData(finalData);

    if (onChartData && finalData.length > 0) {
      // Count records by status for bar chart
      const barMap = {};
      finalData.forEach(item => {
        barMap[item.status] = (barMap[item.status] || 0) + 1;
      });
      const barData = Object.keys(barMap).map(key => ({ name: key, value: barMap[key] }));

      // Count records by workflowName for pie chart
      const pieMap = {};
      finalData.forEach(item => {
        pieMap[item.workflowName] = (pieMap[item.workflowName] || 0) + 1;
      });
      const pieData = Object.keys(pieMap).map(key => ({ name: key, value: pieMap[key] }));

      onChartData(barData, pieData); // send chart data to MainDashboard
    }
  };
  // Table columns
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filterable: true,
    },
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      filterable: true,
    },
    {
      title: "Process Name",
      dataIndex: "workflowName",
      key: "workflowName",
      filterable: true,
    },
  ];

  return (
    <CustomReport
      showFilter
      api={api}
      columns={columns}
      title="Pending Records Report"
      filterType="none"
      storageKey="PENDING_RECORDS_COLUMNS"
      onFetch={handleFetch}
    />
  );
};

export default PendingRecordsReport;
