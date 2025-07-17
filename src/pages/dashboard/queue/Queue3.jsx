import { Tabs } from 'antd'
import React from 'react'
import PendingGi from './PendingGi'
import GatePass from './GatePass'
import GiApprovalPage from './GiApprovalPage'
import GrnApproval from './GrnApproval'
import { useSelector } from "react-redux";

const Queue3 = () => {
const auth = useSelector((state) => state.auth);
const roleName=auth.role;
  return (
    <Tabs>
     <Tabs.TabPane tab="Pending GI And Change Request GPRN" key="gi">
            <PendingGi />
    </Tabs.TabPane> 
{(roleName === 'Store Purchase Officer' || roleName === 'Indent Creator') && (
    <Tabs.TabPane tab="Pending GI" key="g">
            <GiApprovalPage />
    </Tabs.TabPane> )}
{(roleName === 'Store Purchase Officer' || roleName === 'Store Person') && (
     <Tabs.TabPane tab="Pending GRN" key="grn">
            <GrnApproval />
    </Tabs.TabPane> )}
     <Tabs.TabPane tab="Gate Pass" key="gatepass">
            <GatePass />
    </Tabs.TabPane> 
    </Tabs>
  )
}

export default Queue3
