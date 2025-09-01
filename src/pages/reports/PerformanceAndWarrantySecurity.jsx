import React, { useEffect, useState } from 'react';
import CustomReport from '../../components/DKG_Report';
import dayjs from "dayjs";


const PerformanceAndWarrantySecurity = () => {

  
  const columns = [
    { title: 'PO Number', dataIndex: 'poId', key: 'poId_po', filterable: true },
    { title: 'PO Date', dataIndex: 'createdDate', key: 'createdDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Mode of Procurement', dataIndex: 'modeOfProcurement', key: 'modeOfProcurement_po', filterable: true },
    { title: 'Vendor Name', dataIndex: 'vendorName', key: 'vendorName_po', filterable: true },
    { title: 'Title of PO', dataIndex: 'titleOfTender', key: 'titleOfTender_po', filterable: true },
    { title: 'PO Value', dataIndex: 'totalValueOfPo', key: 'totalValueOfPo_po', filterable: true },
    { title: 'Type of Security', dataIndex: 'typeOfSecurity', key: 'typeOfSecurity_po', filterable: true },
    { title: 'Security Number', dataIndex: 'securityNumber', key: 'securityNumber_po', filterable: true },
    { title: 'Security Date', dataIndex: 'securityDate', key: 'securityDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate_po', filterable: true,render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "", },
    { title: 'Security Amount', dataIndex: 'securityAmount', key: 'securityAmount_po', filterable: true },
    
  ];


  return (
    <div>
      <CustomReport
        columns={columns}
        api="/api/reports/performanceSecurityReport"
        title="PerformanceAndWarrantySecurity"
        filterType="date"
        storageKey="PerformanceAndWarrantySecurity_REPORT_COLUMNS"
      />
    </div>
  );
};

export default PerformanceAndWarrantySecurity;
