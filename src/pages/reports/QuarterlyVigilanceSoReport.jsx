import React , {useEffect,useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const QuarterlyVigilanceSoReport = ({
  onChartData,
  selectedBarKey = 'vendorName',
  selectedPieKey = 'orderNo'
}) => {
  const [reportData, setReportData] = useState([]);
 const columns = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo_Q',
      filterable: true,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate_Q',
      filterable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value_Q',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName_Q',
      filterable: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location_Q',
      filterable: true,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate_Q',
      filterable: true,
    },
    {
      title: 'Descriptions',
      dataIndex: 'descriptions',
      key: 'descriptions_Q',
      render: (descriptions) => (
        <Table
          dataSource={descriptions}
          pagination={false}
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

  const api = "/api/reports/QuarterlyVigilanceReport";

  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
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
    if (reportData.length > 0) {
      generateChart(reportData);
    }
  }, [reportData, selectedBarKey, selectedPieKey]);


  return (
    <div>
      <CustomReport columns={columns} api={api} title="Quarterly Vigilance Report" filterType="none" storageKey="QUARTELY_REPORT_COLUMNS"  onFetch={handleFetch}/>
    </div>
  );
};

export default QuarterlyVigilanceSoReport;
