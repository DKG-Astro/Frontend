import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';


const PoList = ({ onChartData, selectedBarKey, selectedPieKey}) => {
    const auth = useSelector((state) => state.auth);
    const userId = auth.userId;
     const roleName = auth.role; 
const [reportData, setReportData] = useState([]);
  const columns = [
    {
    title: 'Approved Date',
    dataIndex: 'approvedDate',
    key: 'approvedDate_po',
    filterable: true,
  },
  {
    title: 'PO ID',
    dataIndex: 'poId',
    key: 'poId_po',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_po',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_po',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId_po',
    filterable: true,
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project_po',
    filterable: true,
  },
  {
    title: 'Vendor ID',
    dataIndex: 'vendorId',
    key: 'vendorId_po',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_po',
    filterable: true,
  },
  {
    title: 'Mode of Procurement',
    dataIndex: 'modeOfProcurement',
    key: 'modeOfProcurement_po',
    filterable: true,
  },
    {
      title: 'purchase Order Materials',
      dataIndex: 'purchaseOrderAttributes',
      key: 'purchaseOrderAttributes_po',
      render: (purchaseOrderAttributes) => (
        <Table
          dataSource={purchaseOrderAttributes}
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
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Exchange Rate',
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
  },
  {
    title: 'GST',
    dataIndex: 'gst',
    key: 'gst',
  },
  {
    title: 'Duties',
    dataIndex: 'duties',
    key: 'duties',
  },
  {
    title: 'Freight Charge',
    dataIndex: 'freightCharge',
    key: 'freightCharge',
  },
  {
    title: 'Received Quantity',
    dataIndex: 'receivedQuantity',
    key: 'receivedQuantity',
  },
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/poList-report";
 const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData); // store for later
    generateChart(finalData);
  };

  // 2️⃣ chart generator
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

  // 3️⃣ useEffect: regenerate chart when selected keys change
  useEffect(() => {
    if (reportData.length > 0) {
      generateChart(reportData);
    }
  }, [selectedBarKey, selectedPieKey]);


  return (
    <div>
      <CustomReport columns={columns} api={api} title="Po List" filterType="date" storageKey="POLIST_REPORT_COLUMNS"  onFetch={handleFetch} userId={userId} roleName={roleName}/>
    </div>
  );
};

export default PoList;
