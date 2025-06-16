import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IndentList = () => {
  const columns = [
    {
      title: 'Indent ID',
      dataIndex: 'indentId',
      key: 'indentId',
      filterable: true,
    },
    {
      title: 'Indentor Name',
      dataIndex: 'indentorName',
      key: 'indentorName',
      filterable: true,
    },
    {
      title: 'Indentor Mobile No',
      dataIndex: 'indentorMobileNo',
      key: 'indentorMobileNo',
      filterable: true,
    },
    {
      title: 'Indentor Email',
      dataIndex: 'indentorEmailAddress',
      key: 'indentorEmailAddress',
      filterable: true,
    },
    {
      title: 'Consignes Location',
      dataIndex: 'consignesLocation',
      key: 'consignesLocation',
      filterable: true,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filterable: true,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
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
      title: 'As On Date',
      dataIndex: 'asOnDate',
      key: 'asOnDate',
      filterable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      filterable: true,
    },
    {
      title: 'Material Details',
      dataIndex: 'materialDetails',
      key: 'materialDetails',
      render: (materialDetails) => (
        <Table
          dataSource={materialDetails}
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
              title: 'Total Price',
              dataIndex: 'totalPrice',
              key: 'totalPrice',
            },
            {
              title: 'Budget Code',
              dataIndex: 'budgetCode',
              key: 'budgetCode',
            },
            {
              title: 'Material Category',
              dataIndex: 'materialCategory',
              key: 'materialCategory',
            },
            {
              title: 'Material Sub Category',
              dataIndex: 'materialSubCategory',
              key: 'materialSubCategory',
            },
            {
              title: 'Mode of Procurement',
              dataIndex: 'modeOfProcurement',
              key: 'modeOfProcurement',
            },
            {
              title: 'Currency',
              dataIndex: 'currency',
              key: 'currency',
            },
            {
              title: 'Vendor Names',
              dataIndex: 'vendorNames',
              key: 'vendorNames',
            },
          ]}
        />
      ),
    },
  ];


  const api = "/api/reports/indentList-report";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Indent List" filterType="date" />
    </div>
  );
};

export default IndentList;
