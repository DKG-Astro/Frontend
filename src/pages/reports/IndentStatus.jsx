import React from 'react';
import CustomReport from '../../components/DKG_Report';
import { Table } from 'antd';

const IndentList = () => {
const columns = [
  {
    title: 'Indent ID',
    dataIndex: 'requestId',
    key: 'requestId',
    filterable: true,
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy',
    key: 'createdBy',
    filterable: true,
  },
  {
    title: 'Modified By',
    dataIndex: 'modifiedBy',
    key: 'modifiedBy',
    filterable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filterable: true,
  },
  {
    title: 'Next Action',
    dataIndex: 'nextAction',
    key: 'nextAction',
    filterable: true,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    filterable: true,
  },
  {
    title: 'Current Role',
    dataIndex: 'currentRole',
    key: 'currentRole',
    filterable: true,
  },
  {
    title: 'Next Role',
    dataIndex: 'nextRole',
    key: 'nextRole',
    filterable: true,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
    filterable: true,
  },
  {
    title: 'Modification Date',
    dataIndex: 'modificationDate',
    key: 'modificationDate',
    filterable: true,
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate',
    filterable: true,
  },
];



  const api = "/api/indents/indentStatus/{indentId}";

  return (
    <div>
      <CustomReport columns={columns} api={api} title="Indent Status" filterType="text" storageKey="INDENTSTATUS_REPORT_COLUMNS"/>
    </div>
  );
};

export default IndentList;
