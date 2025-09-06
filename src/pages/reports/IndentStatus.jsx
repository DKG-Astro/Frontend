import React , {useEffect,useState}from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IndentList = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
const columns = [
  {
    title: 'Indent ID',
    dataIndex: 'requestId',
    key: 'requestId',
    filterable: true,
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy',
    key: 'createdBy',
    filterable: true,
  },
  {
    title: 'Modified By',
    dataIndex: 'modifiedBy',
    key: 'modifiedBy',
    filterable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filterable: true,
  },
  {
    title: 'Next Action',
    dataIndex: 'nextAction',
    key: 'nextAction',
    filterable: true,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    filterable: true,
  },
  {
    title: 'Current Role',
    dataIndex: 'currentRole',
    key: 'currentRole',
    filterable: true,
  },
  {
    title: 'Next Role',
    dataIndex: 'nextRole',
    key: 'nextRole',
    filterable: true,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
    filterable: true,
  },
  {
    title: 'Modification Date',
    dataIndex: 'modificationDate',
    key: 'modificationDate',
    filterable: true,
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate',
    filterable: true,
  },
];



  const api = "/api/indents/indentStatus/{indentId}";
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
    if (reportData.length > 0) generateChart(reportData);
  }, [selectedBarKey, selectedPieKey]);

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Indent Status" filterType="text" storageKey="INDENTSTATUS_REPORT_COLUMNS" onFetch={handleFetch}/>
    </div>
  );
};

export default IndentList;
