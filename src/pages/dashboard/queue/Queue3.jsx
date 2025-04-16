import { Tabs } from 'antd'
import React from 'react'
import PendingGi from './PendingGi'
import GatePass from './GatePass'

const Queue3 = () => {
  return (
    <Tabs>
     <Tabs.TabPane tab="Pending GI" key="gi">
            <PendingGi />
    </Tabs.TabPane> 
     <Tabs.TabPane tab="Gate Pass" key="gatepass">
            <GatePass />
    </Tabs.TabPane> 
    </Tabs>
  )
}

export default Queue3
