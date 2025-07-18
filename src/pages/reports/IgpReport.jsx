import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IgpReport = () => {
  const columns = [
    { title: 'IGP Process No', dataIndex: 'igpProcessId', key: 'igpProcessId_IGP', render: (_, record) => record.igpProcessId + "/" + record.igpSubProcessId, searchable: true },
    { title: 'OGP Sub Process ID', dataIndex: 'ogpSubProcessId', key: 'ogpSubProcessId_IGP', searchable: true },
    { title: 'IGP Date', dataIndex: 'igpDate', key: 'igpDate_IGP' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_IGP', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_IGP' },
    {
      title: 'IGP Details',
      dataIndex: 'igpDetails',
      key: 'igpDetails_IGP',
      render: (igpDetails) => (
        <Table
          dataSource={igpDetails}
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

  const api = "/api/reports/igp";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="IGP Report" filterType="date" storageKey="IGP_REPORT_COLUMNS"/>
    </div>
  );
};

export default IgpReport;
