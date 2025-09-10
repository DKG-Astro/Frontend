import React, { useEffect, useState } from 'react';
import CustomReport from '../../components/DKG_Report';
import dayjs from "dayjs";


const PerformanceAndWarrantySecurity = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);

  const columns = [
    { title: 'PO Number', dataIndex: 'poId', key: 'poId_po', filterable: true },
    { title: 'PO Date', dataIndex: 'createdDate', key: 'createdDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Mode of Procurement', dataIndex: 'modeOfProcurement', key: 'modeOfProcurement_po', filterable: true },
    { title: 'Vendor Name', dataIndex: 'vendorName', key: 'vendorName_po', filterable: true },
    { title: 'Title of PO', dataIndex: 'titleOfTender', key: 'titleOfTender_po', filterable: true },
    { title: 'PO Value', dataIndex: 'totalValueOfPo', key: 'totalValueOfPo_po', filterable: true },
    { title: 'Type of Security', dataIndex: 'typeOfSecurity', key: 'typeOfSecurity_po', filterable: true },
    { title: 'Security Number', dataIndex: 'securityNumber', key: 'securityNumber_po', filterable: true },
    { title: 'Security Date', dataIndex: 'securityDate', key: 'securityDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Security Amount', dataIndex: 'securityAmount', key: 'securityAmount_po', filterable: true },
    
  ];
 const api="/api/reports/performanceSecurityReport"
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.totalValueOfPo || 0);
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.totalValueOfPo || 0);
      return acc;
    }, {});

    const barData = Object.keys(barDataMap).map(k => ({ name: k, value: barDataMap[k] }));
    const pieData = Object.keys(pieDataMap).map(k => ({ name: k, value: pieDataMap[k] }));

    if (onChartData) onChartData(barData, pieData);
  };

  useEffect(() => {
    if (reportData.length > 0) {
      generateChart(reportData);
    }
  }, [selectedBarKey, selectedPieKey]);

  return (
    <div>
      <CustomReport
        columns={columns}
        api={api}
        title="PerformanceAndWarrantySecurity"
        filterType="date"
        storageKey="PerformanceAndWarrantySecurity_REPORT_COLUMNS"
        onFetch={handleFetch}
      />
    </div>
  );
};

export default PerformanceAndWarrantySecurity;
