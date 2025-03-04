import React, { useState } from "react";
import { Tabs, Typography, Row, Col } from "antd";
import { useSelector } from "react-redux";
import QueueRequest from "./QueueRequest";
import QueueAction from "./QueueAction";

const { Text } = Typography;

const QueueTable = () => {
  const auth = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("request");

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Role ID:</Text> {auth.roleId || "N/A"}
        </Col>
        <Col>
          <Text strong>Role Name:</Text> {auth.role || "N/A"}
        </Col>
        <Col>
          <Text strong>User ID:</Text> {auth.userId}
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Queue1" key="request">
          <QueueRequest />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Queue2" key="action">
          <QueueAction />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default QueueTable;