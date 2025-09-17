import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const DisposalReport = () => {
  const columns = [
    { title: 'Auction ID', dataIndex: 'auctionId', key: 'auctionId', render: (text) => `INV/${text}`, searchable: true  },
    { title: 'Auction Code', dataIndex: 'auctionCode', key: 'auctionCode' },
    { title: 'Auction Date', dataIndex: 'auctionDate', key: 'auctionDate', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
    { title: 'Reserve Price', dataIndex: 'reservePrice', key: 'reservePrice' },
    { title: 'Auction Price', dataIndex: 'auctionPrice', key: 'auctionPrice' },
    { title: 'Vendor Name', dataIndex: 'vendorName', key: 'vendorName' },

    {
      title: 'Disposals',
      dataIndex: 'disposals',
      key: 'disposals',
      render: (disposals) => disposals?.length ? (
        <Table
          dataSource={disposals}
          pagination={false}
          rowKey="disposalId"
          columns={[
            { title: 'Disposal ID', dataIndex: 'disposalId', key: 'disposalId' },
            { title: 'Disposal Date', dataIndex: 'disposalDate', key: 'disposalDate', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
            { title: 'Location', dataIndex: 'locationId', key: 'locationId' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            { title: 'Custodian ID', dataIndex: 'custodianId', key: 'custodianId' },
            {
              title: 'Assets',
              dataIndex: 'assets',
              key: 'assets',
              render: (assets) => assets?.length ? (
                <Table
                  dataSource={assets}
                  pagination={false}
                  rowKey="disposalDetailId"
                  columns={[
                    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
                    { title: 'Asset Desc', dataIndex: 'assetDesc', key: 'assetDesc' },
                    { title: 'Quantity', dataIndex: 'disposalQuantity', key: 'disposalQuantity' },
                    { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
                    { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue' },
                    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
                    { title: 'PO Value', dataIndex: 'poValue', key: 'poValue' },
                    { title: 'Reason', dataIndex: 'reasonForDisposal', key: 'reasonForDisposal' },
                  ]}
                />
              ) : null
            }
          ]}
        />
      ) : null
    }
  ];

  const api = "/api/reports/DisposalReport";

  return (
    <div>
      <CustomReport
        columns={columns}
        api={api}
        title="Asset Disposal Report"
        filterType="date"
        storageKey="ASSET_DISPOSAL_REPORT_COLUMNS"
      />
    </div>
  );
};

export default DisposalReport;
