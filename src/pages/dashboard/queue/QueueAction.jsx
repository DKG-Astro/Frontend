import { Table } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import React from "react";

const QueueAction = () => {
  const columns = [
    {
      title: "Tender ID",
      dataIndex: "tenderId",
      key: "tenderId",
    },
    {
      title: "Bid Type",
      dataIndex: "bidType",
      key: "bidType",
    },
    {
      title: "Last Date",
      dataIndex: "lastDate",
      key: "lastDate",
    },
    {
      title: "Bid Opening Date",
      dataIndex: "bidOpeningDate",
      key: "bidOpeningDate",
    },
    {
      title: "Bid Closing Date",
      dataIndex: "bidClosingDate",
      key: "bidClosingDate",
    },
    {
      title: "Consigne Location",
      dataIndex: "consignesLocation",
      key: "consignesLocation",
    },
  ];
  return (
    <div>
      <Table columns={columns} rowKey="key" />
    </div>
  );
};

export default QueueAction;
