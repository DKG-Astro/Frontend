import React from 'react'
import CustomReport from '../../components/DKG_Report';

const AssetReport = () => {

    const columns = [
        { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId_AssetReport', searchable: true },
        { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode_AssetReport', searchable: true },
        { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc_AssetReport', searchable: true },
        { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc_AssetReport', searchable: true },
        { title: 'Make No', dataIndex: 'makeNo', key: 'makeNo_AssetReport', searchable: true },
        { title: 'Serial No', dataIndex: 'serialNo', key: 'serialNo_AssetReport', searchable: true },
        { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo_AssetReport', searchable: true },
        { title: 'UOM', dataIndex: 'uomId', key: 'uomId_AssetReport', filterable: true },
        { title: 'PO ID', dataIndex: 'poId', key: 'poId_AssetReport', searchable: true },
        { title: 'PO Value', dataIndex: 'poValue', key: 'poValue_AssetReport', searchable: true },
        { title: 'Vendor Id', dataIndex: 'vendorId', key: 'vendorId_AssetReport', searchable: true },
    ];
    localStorage.getItem('ASSET_REPORT_COLUMNS')
    
       const api = "/api/reports/asset"
  return (
    <div>
      <CustomReport columns={columns} api={api} title="Asset Report"  filterType="none" storageKey="ASSET_REPORT_COLUMNS" />
    </div>
  )
}

export default AssetReport
