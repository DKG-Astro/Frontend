import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const GoodsIssueReport = () => {
  const columns = [
    { title: 'Issue Note No', dataIndex: 'issueNoteId', key: 'issueNoteId_GI', render: (_, record) => "INV" + "/" + record.issueNoteId, searchable: true },
    { title: 'Issue Note Type', dataIndex: 'issueNoteType', key: 'issueNoteType_GI', filterable: true },
    { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate_GI' },
    { title: 'Consignee Detail', dataIndex: 'consigneeDetail', key: 'consigneeDetail_GI', searchable: true },
    { title: 'Indentor Name', dataIndex: 'indentorName', key: 'indentorName_GI', searchable: true },
    { title: 'Field Station', dataIndex: 'fieldStation', key: 'fieldStation_GI', filterable: true },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_GI', filterable: true },
    {
      title: 'Issue Details',
      dataIndex: 'details',
      key: 'details_GI',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/isn";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Goods Issue Report" filterType="date" storageKey="GI_REPORT_COLUMNS"/>
    </div>
  );
};

export default GoodsIssueReport;
