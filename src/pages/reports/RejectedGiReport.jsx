import {React, useEffect, useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const RejectedGiReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
  const columns = [
    { 
      title: 'OGP Process ID', 
      dataIndex: 'ogpSubProcessId', 
      key: 'ogpSubProcessId_rej', 
      render: (text) => `INV/${text}`,
      searchable: true 
    },
    { title: 'GI ID', dataIndex: 'giId', key: 'giId_rej', searchable: true },
    { title: 'OGP Type', dataIndex: 'ogpType', key: 'ogpType_rej' },
    { title: 'Status', dataIndex: 'status', key: 'status_rej' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_rej', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_rej' },
    { title: 'Sender Name', dataIndex: 'senderName', key: 'senderName_rej' },
    { title: 'Receiver Name', dataIndex: 'receiverName', key: 'receiverName_rej' },
    { title: 'Receiver Location', dataIndex: 'receiverLocation', key: 'receiverLocation_rej' },
    { title: 'OGP Date', dataIndex: 'ogpDate', key: 'ogpDate_rej' },
    { title: 'Return Date', dataIndex: 'returnDate', key: 'returnDate_rej' },

    {
      title: 'Rejected GI Details',
      dataIndex: 'rejectedDetails',
      key: 'rejectedDetails_rej',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Rejection Type', dataIndex: 'rejectionType', key: 'rejectionType' },
            { title: 'Rejected Quantity', dataIndex: 'rejectedQuantity', key: 'rejectedQuantity' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/rejected-gi"; 
   const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + 1;
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
        title="Rejected GI Report" 
        filterType="date" 
        storageKey="REJECTED_GI_REPORT_COLUMNS"
        onFetch={handleFetch}
      />
    </div>
  );
};

export default RejectedGiReport;
