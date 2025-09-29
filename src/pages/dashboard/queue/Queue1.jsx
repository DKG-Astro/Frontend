import { Tabs } from 'antd'
import React from 'react'
import QueueRequest from './QueueRequest'

const Queue1 = () => {
  return (
    <Tabs>
     <Tabs.TabPane tab="Indent" key="IND">
            <QueueRequest workflowId={1}/>
    </Tabs.TabPane> 
     <Tabs.TabPane tab="Tender" key="T">
            <QueueRequest requestType="Tender" />
    </Tabs.TabPane> 
    <Tabs.TabPane tab="Contingency Purchase" key="CP">
            <QueueRequest workflowId={2}/>
    </Tabs.TabPane> 
    <Tabs.TabPane tab="Purchase Order" key="PO">
            <QueueRequest workflowId={3}/>
    </Tabs.TabPane> 
    <Tabs.TabPane tab="Service Order" key="SO">
            <QueueRequest workflowId={5} />
    </Tabs.TabPane> 
    <Tabs.TabPane tab="Material" key="M">
            <QueueRequest requestType="M" />
    </Tabs.TabPane>
    <Tabs.TabPane tab="Vendor" key="V">
            <QueueRequest requestType="V" />
    </Tabs.TabPane>
      <Tabs.TabPane tab="Cancelled Indents" key="C">
            <QueueRequest requestType="C" />
    </Tabs.TabPane>
     <Tabs.TabPane tab="Payment Voucher" key="PV">
            <QueueRequest requestType="PV" />
    </Tabs.TabPane>
    </Tabs>
  )
}

export default Queue1