import React from 'react'
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';
import { useState,useEffect } from 'react';
//const CpReport = () => {
const CpReport = ({ onChartData }) => {
     const [data, setData] = useState([]);
     const api = "/api/reports/cp/report"
const handleFetch = (startDate, endDate, reportData) => {
  const finalData = reportData || [];
  setData(finalData);

  // Bar chart: Vendor vs Total Price
  const barData = finalData.map(cp => ({
    name: cp.vendorName || "Unknown",
    value: cp.cpMaterials.reduce((sum, m) => sum + (m.totalPrice || 0), 0)
  }));

  // Pie chart: Project vs Total Price
  const pieData = finalData.reduce((acc, cp) => {
    const project = cp.projectName || "Without Project";
    const total = cp.cpMaterials.reduce((sum, m) => sum + (m.totalPrice || 0), 0);
    acc[project] = (acc[project] || 0) + total;
    return acc;
  }, {});

  const pieDataArr = Object.keys(pieData).map(project => ({
    name: project,
    value: pieData[project]
  }));

  // Send both chart data sets to dashboard
  if (onChartData) onChartData(barData, pieDataArr);
};

  
    const columns = [
    {
      title: 'Contingency ID',
      dataIndex: 'contigencyId',
      key: 'contigencyId_cp',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName_cp',
      filterable: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName_cp',
      filterable: true,
    },
    {
      title: 'Payment to Vendor',
      dataIndex: 'paymentToVendor',
      key: 'paymentToVendor_cp',
      filterable: true,
    },
    {
      title: 'Payment to Employee',
      dataIndex: 'paymentToEmployee',
      key: 'paymentToEmployee_cp',
      filterable: true,
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose_cp',
      filterable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy_cp',
      filterable: true,
    },
    {
      title: 'Pending With',
      dataIndex: 'pendingWith',
      key: 'pendingWith_cp',
      filterable: true,
    },
    {
      title: 'Pending From',
      dataIndex: 'pendingFrom',
      key: 'pendingFrom_cp',
      filterable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status_cp',
      filterable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action_cp',
      filterable: true,
    },
    {
      title: 'Materials',
      dataIndex: 'cpMaterials',
      key: 'cpMaterials_cp',
      render: (materials) => (
        <Table
          dataSource={materials}
          rowKey="materialCode"
          pagination={false}
          size="small"
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
              title: 'Unit Price',
              dataIndex: 'unitPrice',
              key: 'unitPrice',
            },
            {
              title: 'UOM',
              dataIndex: 'uom',
              key: 'uom',
            },
            {
              title: 'Budget Code',
              dataIndex: 'budgetCode',
              key: 'budgetCode',
            },
            {
              title: 'GST',
              dataIndex: 'gst',
              key: 'gst',
            },
            {
              title: 'Material Category',
              dataIndex: 'materialCategory',
              key: 'materialCategory',
            },
            {
              title: 'Material Sub-Category',
              dataIndex: 'materialSubCategory',
              key: 'materialSubCategory',
            },
            {
              title: 'Currency',
              dataIndex: 'currency',
              key: 'currency',
            },
            {
              title: 'Country of Origin',
              dataIndex: 'countryOfOrigin',
              key: 'countryOfOrigin',
            },
            {
              title: 'Total Price',
              dataIndex: 'totalPrice',
              key: 'totalPrice',
            }
          ]}
        />
      )
    }
  ];
  
  return <CustomReport showFilter api={api} columns={columns} title="Contingency Purchase Report" filterType="date" storageKey="CP_REPORT_COLUMNS" onFetch={handleFetch}/>
}

export default CpReport
