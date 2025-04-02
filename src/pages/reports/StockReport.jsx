import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const StockReport = () => {
  const columns = [
    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId', searchable: true },
    { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc', searchable: true },
    { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc', searchable: true },
    { title: 'UOM', dataIndex: 'uomId', key: 'uomId', filterable: true },
    { title: 'Total Quantity', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue' },
    { title: 'Depreciation Rate', dataIndex: 'depriciationRate', key: 'depriciationRate' },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
    {
      title: 'Locator Details',
      dataIndex: 'locatorDetails',
      key: 'locatorDetails',
      render: (locatorDetails) => (
        <Table
          dataSource={locatorDetails}
          pagination={false}
          columns={[
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Locator Description', dataIndex: 'locatorDesc', key: 'locatorDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/stock";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Stock Report" />
    </div>
  );
};

export default StockReport;
