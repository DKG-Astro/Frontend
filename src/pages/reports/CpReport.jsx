import React from 'react'
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const CpReport = () => {
  const api = "/api/reports/cp/report"
    const columns = [
    {
      title: 'Contingency ID',
      dataIndex: 'contigencyId',
      key: 'contigencyId',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filterable: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filterable: true,
    },
    {
      title: 'Payment to Vendor',
      dataIndex: 'paymentToVendor',
      key: 'paymentToVendor',
      filterable: true,
    },
    {
      title: 'Payment to Employee',
      dataIndex: 'paymentToEmployee',
      key: 'paymentToEmployee',
      filterable: true,
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      filterable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      filterable: true,
    },
    {
      title: 'Pending With',
      dataIndex: 'pendingWith',
      key: 'pendingWith',
      filterable: true,
    },
    {
      title: 'Pending From',
      dataIndex: 'pendingFrom',
      key: 'pendingFrom',
      filterable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filterable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      filterable: true,
    },
    {
      title: 'Materials',
      dataIndex: 'cpMaterials',
      key: 'cpMaterials',
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
  
  return <CustomReport showFilter api={api} columns={columns} title="Contingency Purchase Report" filterType="date"/>
}

export default CpReport
