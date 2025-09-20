import {React, useState, useEffect} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useSelector } from 'react-redux';


const IgpMaterialInReport =({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;

  const [reportData, setReportData] = useState([]);
  const columns = [
    { 
      title: 'IGP ID', 
      dataIndex: 'id', 
      key: 'id_igp', 
      render: (text) => `INV/${text}`, 
      searchable: true 
    },
    /*{ title: 'Ogp ID', dataIndex: 'ogpId', key: 'ogpId_igp', searchable: true },*/
    { title: 'IGP Type', dataIndex: 'igpType', key: 'igpType_igp' },
    { title: 'Status', dataIndex: 'status', key: 'status_igp' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_igp', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_igp' },
    { title: 'Indentor ID', dataIndex: 'indentId', key: 'indentId_igp' },
    { title: 'IGP Date', dataIndex: 'igpDate', key: 'igpDate_igp' },
   /* { title: 'Create Date', dataIndex: 'createDate', key: 'createDate_igp' },*/

    {
      title: 'Material Details',
      dataIndex: 'igpDetails',
      key: 'igpDetails_igp',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'id', key: 'detailId' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Category', dataIndex: 'category', key: 'category' },
            { title: 'Sub Category', dataIndex: 'subCategory', key: 'subCategory' },
            { title: 'Material Description', dataIndex: 'description', key: 'description' },
            { title: 'UOM', dataIndex: 'uom', key: 'uom' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
           /* { title: 'Estimated Price', dataIndex: 'estimatedPriceWithCcy', key: 'estimatedPrice' },
            { title: 'Indigenous/Imported', dataIndex: 'indigenousOrImported', key: 'indigenousOrImported', render: (val) => val ? 'Yes' : 'No' }*/
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/igp-materail-in"; 
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  
  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.igpDetails?.length || 0); // Using count of items
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.igpDetails?.length || 0); 
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
        title="IGP Material In Report" 
        filterType="date" 
        storageKey="IGP_MATERIAL_IN_REPORT_COLUMNS"
        onFetch={handleFetch}
        userId={userId}
        roleName={roleName}
      />
    </div>
  );
};

export default IgpMaterialInReport;
