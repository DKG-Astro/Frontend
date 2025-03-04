import React, { useState } from 'react'
import { FileTextOutlined, BarChartOutlined, PieChartOutlined, SolutionOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CpReport from './CpReport';
import IndentReport from './IndentReport';
import TechnoMom from './TechnoMom';
import VendorContract from './VendorContractReport';
import ProcurementActivityReport from './ProcurementActivityReport';

const ReportsMain = () => {
    const tiles = [
        {
            id: 1,
            title: "Contingency Purchase Report",
            icon: <FileTextOutlined />,
            path:"/reports/contingencyPurchase"
        },
        {
            id: 2,
            title: "Indent Report",
            icon: <BarChartOutlined />,
            path:"/reports/indent"
        },
        {
            id: 3,
            title: "Techno MOM Report",
            icon: <PieChartOutlined />,
            path:"/reports/technoMom"
        },
        {
            id: 4,
            title: "Vendor Contract Report",
            icon: <FileTextOutlined />,
            path: "/reports/vendorContract"
        },
        {
            id: 5,
            title: "Procurement Activity Report",
            icon: <SolutionOutlined />,
            path: "/reports/procurementActivity"
        },
    ]
    const [activeTab, setActiveTab] = useState(1)
    const renderReports = () => {
        switch(activeTab) {
            case 1:
                return <CpReport />
            case 2:
                return <IndentReport />
            case 3:
                return <TechnoMom />
            case 4:
                return <VendorContract/>
            case 5:
                return <ProcurementActivityReport />
            default:
                return <h1>Contingency Purchase Report</h1>
        }
    }
  return (
    <div className='large-container'>
        <h1 className='!text-xl md:!text-xl font-semibold text-center'>Reports</h1>

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

export default ReportsMain
