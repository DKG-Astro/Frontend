import React , {useState,useEffect} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const MonthlyProcurementReport = ({ selectedBarKey, selectedPieKey, onChartData }) => {
  const [reportData, setReportData] = useState([]);

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

   const generateChart = (data) => {
    const barDataMap = data.reduce((acc, item) => {
      const key = item[selectedBarKey] || 'Unknown';
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const pieDataMap = data.reduce((acc, item) => {
      const key = item[selectedPieKey] || 'Unknown';
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const barData = Object.keys(barDataMap).map(k => ({ name: k, value: barDataMap[k] }));
    const pieData = Object.keys(pieDataMap).map(k => ({ name: k, value: pieDataMap[k] }));

    if (onChartData) onChartData(barData, pieData);
  };

  // Handle fetched data
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  // Regenerate charts if selected keys change
  useEffect(() => {
    if (reportData.length > 0) generateChart(reportData);
  }, [selectedBarKey, selectedPieKey]);

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Monthly Procurement Report" filterType="date" storageKey="MONTHLYPROC_REPORT_COLUMNS"  onFetch={handleFetch}/>
    </div>
  );
};

export default MonthlyProcurementReport;
