import { Tabs } from 'antd'
import React from 'react'
import PendingGi from './PendingGi'
import GatePass from './GatePass'
import GiApprovalPage from './GiApprovalPage'
import GrnApproval from './GrnApproval'
import { useSelector } from "react-redux";
import GoodsTransferQueue from './GoodsTransferQueue'
import DemandAndIssueQueue from './DemandAndIssueQueue'
import AssetDispoaslQueue from './AssetDisposalQueue'
import PendingIssueNote from './pendingIssueNote'

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
     <Tabs.TabPane tab="Goods Transfer" key="gt">
            <GoodsTransferQueue />
    </Tabs.TabPane> 
    {(roleName === 'Store Purchase Officer' ) && (
     <Tabs.TabPane tab="Pending Demand And issue" key="Di">
            <DemandAndIssueQueue />
    </Tabs.TabPane> )}
     {(roleName === 'Store Purchase Officer') && (
     <Tabs.TabPane tab="Asset Disposal" key="AD">
            <AssetDispoaslQueue />
    </Tabs.TabPane> )}
     {(roleName === 'Store Person') && (
     <Tabs.TabPane tab="Pending Issue Note" key="IN">
            <PendingIssueNote />
    </Tabs.TabPane> )}
    </Tabs>
  )
}

export default Queue3
