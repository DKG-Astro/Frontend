import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const QuarterlyVigilanceSoReport = () => {
 const columns = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
      filterable: true,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      filterable: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      filterable: true,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filterable: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      filterable: true,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      filterable: true,
    },
    {
      title: 'Descriptions',
      dataIndex: 'descriptions',
      key: 'descriptions',
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

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Quarterly Vigilance Report"  />
    </div>
  );
};

export default QuarterlyVigilanceSoReport;
