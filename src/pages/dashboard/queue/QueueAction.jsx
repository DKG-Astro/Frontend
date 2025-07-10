import { Table } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import React from "react";
import { useSelector } from "react-redux";
import ApprovedTenders from "./ApprovedTenders";
import SubworkflowTransition from "./SubworkflowTransition";
import { Tabs } from "antd";

const QueueAction = () => {
  // const columns = [
  //   {
  //     title: "Tender ID",
  //     dataIndex: "tenderId",
  //     key: "tenderId",
  //   },
  //   {
  //     title: "Bid Type",
  //     dataIndex: "bidType",
  //     key: "bidType",
  //   },
  //   {
  //     title: "Last Date",
  //     dataIndex: "lastDate",
  //     key: "lastDate",
  //   },
  //   {
  //     title: "Bid Opening Date",
  //     dataIndex: "bidOpeningDate",
  //     key: "bidOpeningDate",
  //   },
  //   {
  //     title: "Bid Closing Date",
  //     dataIndex: "bidClosingDate",
  //     key: "bidClosingDate",
  //   },
  //   {
  //     title: "Consigne Location",
  //     dataIndex: "consignesLocation",
  //     key: "consignesLocation",
  //   },
  // ];
  // return (
  //   <div>
  //     <Table columns={columns} rowKey="key" />
  //   </div>
  // );

  const {roleId} = useSelector((state) => state.auth);
  const parsedRoleId = parseInt(roleId);

  if(parseInt(roleId) === 17){ // tender evaluator, show approved tender id
    return <ApprovedTenders />
  }

  if(parseInt(roleId) === 1){
    return <SubworkflowTransition />
  }
  /*
 if (parsedRoleId === 1 || parsedRoleId === 17) {
    return (
      <Tabs defaultActiveKey="tenders">
        <Tabs.TabPane tab="Tender IDs" key="tenders">
          <ApprovedTenders />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Subworkflow Tender IDs" key="subworkflow">
          <SubworkflowTransition />
        </Tabs.TabPane>
      </Tabs>
    );
  }

  return null;
};*/
}
export default QueueAction;
