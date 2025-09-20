import {React, useEffect, useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useSelector } from 'react-redux';

const IgpReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;

  const [reportData, setReportData] = useState([]);
  const columns = [
    { title: 'IGP Process No', dataIndex: 'igpProcessId', key: 'igpProcessId_IGP', render: (_, record) => record.igpProcessId + "/" + record.igpSubProcessId, searchable: true },
    { title: 'OGP Sub Process ID', dataIndex: 'ogpSubProcessId', key: 'ogpSubProcessId_IGP', searchable: true },
    { title: 'IGP Date', dataIndex: 'igpDate', key: 'igpDate_IGP' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_IGP', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_IGP' },
    {
      title: 'IGP Details',
      dataIndex: 'igpDetails',
      key: 'igpDetails_IGP',
      render: (igpDetails) => (
        <Table
          dataSource={igpDetails}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Locator Description', dataIndex: 'locatorDesc', key: 'locatorDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/igp";
   const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

 
  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + 1; // count records
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + 1; // count records
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
      <CustomReport columns={columns} api={api} title="IGP Report" filterType="date" storageKey="IGP_REPORT_COLUMNS" onFetch={handleFetch}
        userId={userId}
        roleName={roleName}/>
    </div>
  );
};

export default IgpReport;
