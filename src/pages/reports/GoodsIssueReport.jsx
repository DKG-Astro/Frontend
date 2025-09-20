import { React, useEffect, useState } from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useSelector } from 'react-redux';

const GoodsIssueReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;

  const [reportData, setReportData] = useState([]);

  const columns = [
    { title: 'Issue Note No', dataIndex: 'issueNoteId', key: 'issueNoteId_GI', render: (_, record) => "INV" + "/" + record.issueNoteId, searchable: true },
    { title: 'Issue Note Type', dataIndex: 'issueNoteType', key: 'issueNoteType_GI', filterable: true },
    { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate_GI' },
    { title: 'Consignee Detail', dataIndex: 'consigneeDetail', key: 'consigneeDetail_GI', searchable: true },
    { title: 'Indentor Name', dataIndex: 'indentorName', key: 'indentorName_GI', searchable: true },
    { title: 'Field Station', dataIndex: 'fieldStation', key: 'fieldStation_GI', filterable: true },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_GI', filterable: true },
    {
      title: 'Issue Details',
      dataIndex: 'details',
      key: 'details_GI',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/isn";

  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  // ✅ Use count instead of sum for charts
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
      <CustomReport
        columns={columns}
        api={api}
        title="Goods Issue Report"
        filterType="date"
        storageKey="GI_REPORT_COLUMNS"
        onFetch={handleFetch}
        userId={userId}
        roleName={roleName}
      />
    </div>
  );
};

export default GoodsIssueReport;
