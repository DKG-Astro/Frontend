import {React, useEffect, useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useSelector } from 'react-redux';

const OgpReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;

  const [reportData, setReportData] = useState([]);
  const columns = [
    { title: 'OGP Process No', dataIndex: 'ogpProcessId', key: 'ogpProcessId_ogp', render: (_, record) => record.ogpProcessId + "/" + record.ogpSubProcessId , searchable: true },
    // { title: 'OGP Sub Process ID', dataIndex: 'ogpSubProcessId', key: 'ogpSubProcessId', searchable: true },
    { title: 'Issue Note ID', dataIndex: 'issueNoteId', key: 'issueNoteId_ogp', searchable: true },
    { title: 'OGP Date', dataIndex: 'ogpDate', key: 'ogpDate_ogp' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_ogp', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_ogp' },
    {
      title: 'OGP Details',
      dataIndex: 'ogpDetails',
      key: 'ogpDetails_ogp',
      render: (ogpDetails) => (
        <Table
          dataSource={ogpDetails}
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

  const api = "/api/reports/ogp";

  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + 1; // Using count instead of value
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + 1; // Using count instead of value
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
      <CustomReport columns={columns} api={api} title="OGP Report" filterType="date" storageKey="OGP_REPORT_COLUMNS"  onFetch={handleFetch}
        userId={userId}
        roleName={roleName}/>
    </div>
  );
};

export default OgpReport;
