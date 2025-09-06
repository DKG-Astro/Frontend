import React , {useState,useEffect} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const ShortClosedCancelledOrderReport =  ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const [reportData, setReportData] = useState([]);
 const columns = [
    {
      title: 'PO ID',
      dataIndex: 'poId',
      key: 'poId_S',
      filterable: true,
    },
    {
      title: 'Tender ID',
      dataIndex: 'tenderId',
      key: 'tenderId_S',
      filterable: true,
    },
    {
      title: 'Indent IDs',
      dataIndex: 'indentIds',
      key: 'indentIds_S',
      filterable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value_S',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName_S',
      filterable: true,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate_S',
      filterable: true,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason_S',
      filterable: true,
    },
    {
      title: 'Materials',
      dataIndex: 'materials',
      key: 'materials_S',
      render: (materials) => (
        <Table
          dataSource={materials}
          pagination={false}
          rowKey={(record, index) => index}
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
          ]}
        />
      ),
    },
  ];

  const api = "/api/reports/ShortClosedCancelledOrderReport";
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
      <CustomReport columns={columns} api={api} title="Short Closed Cancelled Order Report" filterType="date" storageKey="SHORTCLOSED_REPORT_COLUMNS"  onFetch={handleFetch}/>
    </div>
  );
};

export default ShortClosedCancelledOrderReport;
