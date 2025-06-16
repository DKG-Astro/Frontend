import React from 'react'
import CustomReport from '../../components/DKG_Report';

const AssetReport = () => {

    const columns = [
        { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId', searchable: true },
        { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode', searchable: true },
        { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc', searchable: true },
        { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc', searchable: true },
        { title: 'Make No', dataIndex: 'makeNo', key: 'makeNo', searchable: true },
        { title: 'Serial No', dataIndex: 'serialNo', key: 'serialNo', searchable: true },
        { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo', searchable: true },
        { title: 'UOM', dataIndex: 'uomId', key: 'uomId', filterable: true }
    ];
    
       const api = "/api/reports/asset"
  return (
    <div>
      <CustomReport columns={columns} api={api} title="Asset Report"  filterType="none"/>
    </div>
  )
}

export default AssetReport
