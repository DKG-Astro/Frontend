import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IgpMaterialInReport = () => {
  const columns = [
    { 
      title: 'IGP ID', 
      dataIndex: 'id', 
      key: 'id_igp', 
      render: (text) => `INV/${text}`, 
      searchable: true 
    },
    /*{ title: 'Ogp ID', dataIndex: 'ogpId', key: 'ogpId_igp', searchable: true },*/
    { title: 'IGP Type', dataIndex: 'igpType', key: 'igpType_igp' },
    { title: 'Status', dataIndex: 'status', key: 'status_igp' },
    { title: 'Location ID', dataIndex: 'locationId', key: 'locationId_igp', filterable: true },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy_igp' },
    { title: 'Indentor ID', dataIndex: 'indentId', key: 'indentId_igp' },
    { title: 'IGP Date', dataIndex: 'igpDate', key: 'igpDate_igp' },
   /* { title: 'Create Date', dataIndex: 'createDate', key: 'createDate_igp' },*/

    {
      title: 'Material Details',
      dataIndex: 'igpDetails',
      key: 'igpDetails_igp',
      render: (details) => (
        <Table
          dataSource={details}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'id', key: 'detailId' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Category', dataIndex: 'category', key: 'category' },
            { title: 'Sub Category', dataIndex: 'subCategory', key: 'subCategory' },
            { title: 'Material Description', dataIndex: 'description', key: 'description' },
            { title: 'UOM', dataIndex: 'uom', key: 'uom' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
           /* { title: 'Estimated Price', dataIndex: 'estimatedPriceWithCcy', key: 'estimatedPrice' },
            { title: 'Indigenous/Imported', dataIndex: 'indigenousOrImported', key: 'indigenousOrImported', render: (val) => val ? 'Yes' : 'No' }*/
          ]}
        />
      )
    }
  ];

  const api = "/api/reports/igp-materail-in"; 

  return (
    <div>
      <CustomReport 
        columns={columns} 
        api={api} 
        title="IGP Material In Report" 
        filterType="date" 
        storageKey="IGP_MATERIAL_IN_REPORT_COLUMNS"
      />
    </div>
  );
};

export default IgpMaterialInReport;
