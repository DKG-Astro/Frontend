import {React, useEffect, useState} from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useSelector } from 'react-redux';




const StockReport = ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;

  const [reportData, setReportData] = useState([]);
  const userMaster = useSelector((state) => state.masters.userMaster);
  const umObj = userMaster?.reduce((obj, item) => {
    obj[item.userId] = item.userName;
    return obj;
  }, {});

  const columns = [
    { title: 'Custodian Name', dataIndex: 'custodianId', key: 'custodianId_S',
      render: (custodianId) => {
    if (typeof custodianId === "string" && /^\d+$/.test(custodianId.trim())) {
        const id = parseInt(custodianId, 10);
        return umObj[id] ?? '';
    }
    return '';
}


    },
    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId_S', searchable: true },
     { title: 'Asset Code', dataIndex: 'assetCode', key: 'assetCode_S', searchable: true },
    { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc_SR', searchable: true },
    { title: 'Material Code', dataIndex: 'materialCode', key: 'materialDesc_SR', searchable: true },
    { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc_SR', searchable: true },
    { title: 'UOM', dataIndex: 'uomId', key: 'uomId_SR', filterable: true },
    { title: 'Total Quantity', dataIndex: 'totalQuantity', key: 'totalQuantity_SR' },
    { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue_SR' },
    { title: 'Depreciation Rate', dataIndex: 'depriciationRate', key: 'depriciationRate_SR' },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice_SR' },
    {
      title: 'Locator Details',
      dataIndex: 'locatorDetails',
      key: 'locatorDetails_SR',
      render: (locatorDetails) => (
        <Table
          dataSource={locatorDetails}
          pagination={false}
          columns={[
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Locator Description', dataIndex: 'locatorDesc', key: 'locatorDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
              {
          title: 'Serial Numbers',
          dataIndex: 'serialNos',
          key: 'serialNos',
          render: (serialNos) =>
            serialNos && serialNos.length > 0 ? (
              <ul style={{ paddingLeft: 15, margin: 0 }}>
                {serialNos.map((sn, idx) => (
                  <li key={idx}>{sn}</li>
                ))}
              </ul>
            ) : (
              <span>-</span>
            ),
        },
          ]}
        />
      )
    }
  ];
  localStorage.getItem('STOCK_COLUMNS')

  const api = "/api/reports/stock";

    const handleFetch = (data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.totalQuantity || 0); 
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.totalQuantity || 0);
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
      <CustomReport columns={columns} api={api} title="Stock Report" filterType="none" storageKey="STOCK_COLUMNS" onFetch={handleFetch}
        userId={userId}
        roleName={roleName}/>
    </div>
  );
};

export default StockReport;
