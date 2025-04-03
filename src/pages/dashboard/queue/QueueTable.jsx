import React, { useEffect, useState } from "react";
import { Tabs, Typography, Row, Col } from "antd";
import { useSelector } from "react-redux";
import QueueRequest from "./QueueRequest";
import QueueAction from "./QueueAction";
import PendingGi from "./PendingGi";

const { Text } = Typography;
const RESTRICTED_USER_IDS = new Set([25, 31, 34, 36]);

const QueueTable = () => {
  const auth = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("request");
  const userId = auth.userId

  // Check if user is restricted
  const isRestricted = RESTRICTED_USER_IDS.has(userId);

  const {role} = useSelector(state => state?.auth);
  console.log("ROLE: ", role)

  // Handle tab switching for restricted users
  useEffect(() => {
    if (isRestricted && activeTab === "request") {
      setActiveTab("action");
    }
  }, [isRestricted, activeTab]);

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
      {!isRestricted && (
          <Tabs.TabPane tab="Queue1" key="request">
            <QueueRequest />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="Queue2" key="action">
          <QueueAction />
        </Tabs.TabPane>

        {
          (role === "Indent Creator" || role === "Store Purchase Officer") &&
          <Tabs.TabPane tab="Queue3" key="inventory">
          <PendingGi />
          </Tabs.TabPane>
        }
        
      </Tabs>
    </div>
  );
};

export default QueueTable;