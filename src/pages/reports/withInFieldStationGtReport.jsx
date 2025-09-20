import {React, useEffect, useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const WithInFieldStationGtReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
  const columns = [
    { 
      title: 'GT ID', 
      dataIndex: 'gtId', 
      key: 'gtId', 
      render: (text) => `INV/${text}`, 
      searchable: true 
    },
    { title: 'GT Type', dataIndex: 'type', key: 'type' , searchable: true },
    { title: 'Sender Location ID', dataIndex: 'senderLocationId', key: 'senderLocationId' , searchable: true },
    { title: 'Receiver Location ID', dataIndex: 'receiverLocationId', key: 'receiverLocationId' , searchable: true },
    { title: 'Sender Custodian ID', dataIndex: 'senderCustodianId', key: 'senderCustodianId', searchable: true  },
    { title: 'Receiver Custodian ID', dataIndex: 'receiverCustodianId', key: 'receiverCustodianId' , searchable: true },
    { title: 'Status', dataIndex: 'status', key: 'status', searchable: true  },
    { title: 'GT Date', dataIndex: 'gtDate', key: 'gtDate', searchable: true  },
    { title: 'Date', dataIndex: 'createDate', key: 'createDate',render: (text) => text ? text.split('T')[0] : '' },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' ,searchable: true  },

    {
      title: 'Material Details',
      dataIndex: 'materialDetails',
      key: 'materialDetails',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Desc', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Desc', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
            { title: 'Depreciation Rate', dataIndex: 'depriciationRate', key: 'depriciationRate' },
            { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue' },
            { title: 'Receiver Locator ID', dataIndex: 'receiverLocatorId', key: 'receiverLocatorId' },
            { title: 'Sender Locator ID', dataIndex: 'senderLocatorId', key: 'senderLocatorId' },
          ]}
        />
      )
    }
  ];

  // Backend API for GT Report with date filters
  const api = "/api/reports/withInField-gt-report";  

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
        title="GT Report" 
        filterType="date" 
        storageKey="GT_REPORT_COLUMNS"
        onFetch={handleFetch}
      />
    </div>
  );
};

export default WithInFieldStationGtReport;
