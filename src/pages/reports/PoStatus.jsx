import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


const PoStatus =({ onChartData, selectedBarKey, selectedPieKey }) =>{
  const auth = useSelector((state) => state.auth);
  const userId = auth.userId;
  const roleName = auth.role; 
  const [reportData, setReportData] = useState([]);
  const columns = [
  {
    title: 'PO ID',
    dataIndex: 'poId',
    key: 'poId_POS',
    filterable: true,
  },
  {
    title: 'Tender ID',
    dataIndex: 'tenderId',
    key: 'tenderId_POS',
    filterable: true,
  },
  {
    title: 'Indent IDs',
    dataIndex: 'indentIds',
    key: 'indentIds_POS',
    filterable: true,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendorName',
    key: 'vendorName_POS',
    filterable: true,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value_POS',
    filterable: true,
  },
  
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    key: 'submittedDate_POS',
    filterable: true,
  },
  {
    title: 'Pending With',
    dataIndex: 'pendingWith',
    key: 'pendingWith_POS',
    filterable: true,
  },
  
  {
    title: 'Pending From',
    dataIndex: 'pendingFrom',
    key: 'pendingFrom_POS',
    filterable: true,
  },
    {
    title: 'status',
    dataIndex: 'status',
    key: 'status_POS',
    filterable: true,
  },
  {
    title: 'On Date',
    dataIndex: 'asOnDate',
    key: 'asOnDate_POS',
    filterable: true,
  },
    {
      title: 'purchase Order Materials',
      dataIndex: 'purchaseOrderAttributes',
      key: 'purchaseOrderAttributes_POS',
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
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/pending-po-report";
  
  const handleFetch = (startDate, endDate, data) => {
    const finalData = data || [];
    setReportData(finalData); // store data for chart regeneration
    generateChart(finalData);
  };

  const getValueByKey = (item, key) => {
    if (key.startsWith("purchaseOrderAttributes.")) {
      const nestedKey = key.split(".")[1];
      return (item.purchaseOrderAttributes || []).reduce(
        (sum, mat) => sum + (mat[nestedKey] || 0),
        0
      );
    }
    return item[key] || "Unknown";
  };

  const generateChart = (finalData) => {
    const barDataMap = finalData.reduce((acc, item) => {
      const key = getValueByKey(item, selectedBarKey);
      acc[key] = (acc[key] || 0) + (item.value || 0);
      return acc;
    }, {});

    const pieDataMap = finalData.reduce((acc, item) => {
      const key = getValueByKey(item, selectedPieKey);
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
  }, [selectedBarKey, selectedPieKey]);

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Po Status" filterType="date" storageKey="POSTATUS_REPORT_COLUMNS"   onFetch={handleFetch} userId={userId} roleName={roleName}/>
    </div>
  );
};

export default PoStatus;
