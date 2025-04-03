import React, { useEffect, useState } from 'react';
import CustomReport from '../../../components/DKG_Report';
import { Button, Table } from 'antd';
import axios from 'axios';
import TableComponent from '../../../components/DKG_Table';
import { useNavigate } from 'react-router-dom';
import Btn from '../../../components/DKG_Btn';

const PendingGi = () => {
    const navigate = useNavigate();
  const columns = [
    { title: 'Process ID', dataIndex: 'processId', key: 'processId', searchable: true, render: (_, record) => "INV" + record.processId + "/" + record.subProcessId, fixed: 'left'   },
    // { title: 'Sub Process ID', dataIndex: 'subProcessId', key: 'subProcessId', searchable: true },
    { title: 'PO ID', dataIndex: 'poId', key: 'poId', searchable: true, fixed: 'left'  },
    { title: 'Location', dataIndex: 'locationId', key: 'locationId', filterable: true },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Challan No', dataIndex: 'challanNo', key: 'challanNo', searchable: true },
    { title: 'Delivery Date', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: 'Vendor ID', dataIndex: 'vendorId', key: 'vendorId', searchable: true },
    { title: 'Field Station', dataIndex: 'fieldStation', key: 'fieldStation', filterable: true },
    { title: 'Indentor Name', dataIndex: 'indentorName', key: 'indentorName', searchable: true },
    { title: 'Supply Expected Date', dataIndex: 'supplyExpectedDate', key: 'supplyExpectedDate' },
    { title: 'Consignee Detail', dataIndex: 'consigneeDetail', key: 'consigneeDetail', searchable: true },
    { title: 'Warranty Years', dataIndex: 'warrantyYears', key: 'warrantyYears' },
    { title: 'Project', dataIndex: 'project', key: 'project', filterable: true },
    { title: 'Received By', dataIndex: 'receivedBy', key: 'receivedBy', searchable: true },
    {
      title: 'Material Details',
      dataIndex: 'materialDetails',
      key: 'materialDetails',
      render: (materialDetails) => (
        <Table
          dataSource={materialDetails}
          pagination={false}
          columns={[
            { title: 'Detail ID', dataIndex: 'detailId', key: 'detailId' },
            { title: 'Material Code', dataIndex: 'materialCode', key: 'materialCode' },
            { title: 'Material Description', dataIndex: 'materialDesc', key: 'materialDesc' },
            { title: 'UOM', dataIndex: 'uomId', key: 'uomId' },
            { title: 'Received Quantity', dataIndex: 'receivedQuantity', key: 'receivedQuantity' },
            { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
            { title: 'Make No', dataIndex: 'makeNo', key: 'makeNo' },
            { title: 'Serial No', dataIndex: 'serialNo', key: 'serialNo' },
            { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo' },
            { title: 'Warranty Terms', dataIndex: 'warrantyTerms', key: 'warrantyTerms' },
            { title: 'Note', dataIndex: 'note', key: 'note' },
            { title: 'Photo Path', dataIndex: 'photoPath', key: 'photoPath' },
          ]}
        />
      )
    },
    {title: "Actions", dataIndex: "actions",
        render: (_, record) => {
            return (
                <Button className='hover:!border-darkBlueHover !border-darkBlue !text-darkBlue hover:!text-darkBlueHover' onClick={() => navigate("/inventory/goodsInspection", {state: {processNo: "INV" + record.processId + "/" + record.subProcessId}})}>Create GI</Button>
            )
        }
    }
  ];

  const api = "/api/process-controller/getPendingGi";

  const [ds, setDs] = useState([]);

  const populateData = async () => {
    const {data} = await axios.get(api);

    const responseData = data?.responseData || [];
    setDs(responseData);
  }
  useEffect(() => {
    populateData();
  }, [])

  return (
    <div>
      <TableComponent dataSource={ds} columns={columns} />
    </div>
  );
};

export default PendingGi;
