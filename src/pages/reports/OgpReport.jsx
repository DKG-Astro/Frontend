import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const OgpReport = () => {
  const columns = [
    { title: 'OGP Process No', dataIndex: 'ogpProcessId', key: 'ogpProcessId', render: (_, record) => record.ogpProcessId + "/" + record.ogpSubProcessId , searchable: true },
    // { title: 'OGP Sub Process ID', dataIndex: 'ogpSubProcessId', key: 'ogpSubProcessId', searchable: true },
    { title: 'Issue Note ID', dataIndex: 'issueNoteId', key: 'issueNoteId', searchable: true },
    { title: 'OGP Date', dataIndex: 'ogpDate', key: 'ogpDate' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    {
      title: 'OGP Details',
      dataIndex: 'ogpDetails',
      key: 'ogpDetails',
      render: (ogpDetails) => (
        <Table
          dataSource={ogpDetails}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
            { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
            { title: 'Locator Description', dataIndex: 'locatorDesc', key: 'locatorDesc' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' }
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/ogp";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="OGP Report" showFilter />
    </div>
  );
};

export default OgpReport;
