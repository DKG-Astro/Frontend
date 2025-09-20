import {React, useEffect, useState} from 'react'
import CustomReport from '../../components/DKG_Report';
import { useSelector } from 'react-redux';

const AssetReport =  ({ onChartData, selectedBarKey, selectedPieKey }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role;
  const [reportData, setReportData] = useState([]);
    const columns = [
        { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId_AssetReport', searchable: true },
        { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode_AssetReport', searchable: true },
        { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc_AssetReport', searchable: true },
        { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc_AssetReport', searchable: true },
        { title: 'Make No', dataIndex: 'makeNo', key: 'makeNo_AssetReport', searchable: true },
        { title: 'Serial No', dataIndex: 'serialNo', key: 'serialNo_AssetReport', searchable: true },
        { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo_AssetReport', searchable: true },
        { title: 'UOM', dataIndex: 'uomId', key: 'uomId_AssetReport', filterable: true },
        { title: 'PO ID', dataIndex: 'poId', key: 'poId_AssetReport', searchable: true },
        { title: 'PO Value', dataIndex: 'poValue', key: 'poValue_AssetReport', searchable: true },
        { title: 'Vendor Id', dataIndex: 'vendorId', key: 'vendorId_AssetReport', searchable: true },
    ];
    localStorage.getItem('ASSET_REPORT_COLUMNS')
    
       const api = "/api/reports/asset"
        const handleFetch = (data) => {
    const finalData = data || [];
    setReportData(finalData);
    generateChart(finalData);
  };

  // Chart generation for bar & pie
  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedBarKey] || "Unknown";
      acc[key] = (acc[key] || 0) + (item.poValue || 0); // use poValue for numeric chart values
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = item[selectedPieKey] || "No Data";
      acc[key] = (acc[key] || 0) + (item.poValue || 0);
      return acc;
    }, {});

    const barData = Object.keys(barDataMap).map(k => ({ name: k, value: barDataMap[k] }));
    const pieData = Object.keys(pieDataMap).map(k => ({ name: k, value: pieDataMap[k] }));

    if (onChartData) onChartData(barData, pieData);
  };

  // Regenerate charts when selected keys change
  useEffect(() => {
    if (reportData.length > 0) generateChart(reportData);
  }, [selectedBarKey, selectedPieKey]);
  return (
    <div>
      <CustomReport columns={columns} api={api} title="Asset Report"   filterType="none"  storageKey="ASSET_REPORT_COLUMNS" onFetch={handleFetch}
        userId={userId}
        roleName={roleName}/>
    </div>
  )
}

export default AssetReport
