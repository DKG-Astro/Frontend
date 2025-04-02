import React, { useState } from 'react'
import { DatabaseOutlined, BoxPlotOutlined, ImportOutlined, ExportOutlined, InboxOutlined } from '@ant-design/icons';
import AssetReport from './AssetReport';
import StockReport from './StockReport';
import GoodsIssueReport from './GoodsIssueReport';
import IgpReport from './IgpReport';
import OgpReport from './OgpReport';

const InvReportsMain = () => {
    const tiles = [
        {
            id: 1,
            title: "Asset Report",
            icon: <DatabaseOutlined />,
            path:"/reports/asset"
        },
        {
            id: 2,
            title: "Stock Report",
            icon: <BoxPlotOutlined />,
            path:"/reports/stock"
        },
        {
            id: 3,
            title: "Goods Issue Report",
            icon: <ExportOutlined />,
            path:"/reports/goodsIssue"
        },
        {
            id: 4,
            title: "IGP Report",
            icon: <ImportOutlined />,
            path: "/reports/igp"
        },
        {
            id: 5,
            title: "OGP Report",
            icon: <InboxOutlined />,
            path: "/reports/ogp"
        },
    ]
    const [activeTab, setActiveTab] = useState(1)

    const renderReports = () => {
        switch(activeTab) {
            case 1:
                return <AssetReport />
            case 2:
                return <StockReport />
            case 3:
                return <GoodsIssueReport />
            case 4:
                return <IgpReport />
            case 5:
                return <OgpReport />
            default:
                return <h1>Asset Report</h1>
        }
    }

    return (
        <div className='large-container'>
            <h1 className='!text-xl md:!text-xl font-semibold text-center'>Inventory Reports</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {
                    tiles.map(tile => (
                        <div key={tile.id} className={`flex gap-2 bg-gray-200 border-darkBlue rounded-md h-24 items-center p-4 cursor-pointer ${activeTab === tile.id ? "border-b-2 border-pink scale-105" : ""}`} onClick={() => setActiveTab(tile.id)}>
                            <div className="dashboard-tab-icon">
                                {tile.icon}
                            </div>
                            <div className="flex-1 text-right !text-md font-semibold">
                                {tile.title}
                            </div>
                        </div>
                    ))
                }
            </div>

            {renderReports()}
        </div>
    )
}

export default InvReportsMain