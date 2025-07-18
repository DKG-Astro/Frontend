import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const StockReport = () => {
  const columns = [
    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId_S', searchable: true },
    { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc_SR', searchable: true },
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
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' }
          ]}
        />
      )
    }
  ];
  localStorage.getItem('STOCK_COLUMNS')

  const api = "/api/reports/stock";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Stock Report" filterType="none" storageKey="STOCK_COLUMNS"/>
    </div>
  );
};

export default StockReport;
