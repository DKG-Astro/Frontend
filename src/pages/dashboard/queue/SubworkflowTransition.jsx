import React, { useCallback, useEffect, useState } from 'react'
import { apiCall } from '../../../utils/CommonFunctions'
import { useSelector } from 'react-redux'
import { Table } from 'antd'
import dayjs from 'dayjs'

const SubworkflowTransition = () => {
    const {userId} = useSelector(state => state.auth)
    const [queueData, setQueueData] = useState([])

    const columns = [
        {
            title: 'Indent ID',
            dataIndex: 'indentId',
            key: 'indentId',
        },
        {
            title: 'Request ID',
            dataIndex: 'requestId',
            key: 'requestId',
        },
        {
            title: 'Indentor Name',
            dataIndex: 'indentorName',
            key: 'indentorName',
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Consignee',
            dataIndex: 'consignee',
            key: 'consignee',
        },
        {
            title: 'Workflow Name',
            dataIndex: 'workflowName',
            key: 'workflowName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-'
        },
        {
            title: 'Modified Date',
            dataIndex: 'modificationDate',
            key: 'modificationDate',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-'
        }
    ]

    const populateData = useCallback(async () => {
        try{
            const {data} = await apiCall("GET", `getSubWorkflowTransitionQueue?modifiedBy=${userId}`)
            setQueueData(data.responseData || [])
        }
        catch(error){
            console.error("Error fetching queue data:", error)
        }
    }, [userId])

    useEffect(() => {
        populateData()
    }, [populateData])

    return (
        <div className="p-4">
            <Table 
                columns={columns} 
                dataSource={queueData}
                rowKey="subWorkflowTransitionId"
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default SubworkflowTransition
