import React, { useCallback, useEffect, useState } from 'react'
import Btn from '../../../components/DKG_Btn'
import { Table } from 'antd'
import { apiCall } from '../../../utils/CommonFunctions'
import { set } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";

const ApprovedTenders = () => {
//  const { roleName } = useSelector((state) => state.auth);
    const auth = useSelector((state) => state.auth);
  //console.log("roleName:", roleName);

  const navigate = useNavigate();

  const handleRowClick = (tenderId, bidType) => {
    navigate("/procurement/tender/evaluation", { state: { tenderId, bidType } });
  }

   const handleQuotationsClick = (tenderId, bidType) => {
    navigate("/procurement/tender/Quotations", { state: { tenderId, bidType } });
  }
  const columns = [
    {
      title: "Tender ID",
      dataIndex: "tenderId",
      key: "tenderId",
    },
    {
      title: "Bid Type",
      dataIndex: "bidType",
      key: "bidType",
    },
    {
      title: "Amount",
      dataIndex: "totalValue",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Btn onClick={() => handleRowClick(record.tenderId, record.bidType)}>
            Upload Docs
            </Btn>
            <Btn onClick={() => handleQuotationsClick(record.tenderId, record.bidType)}>
            Quotations
            </Btn>
        </>
      ),
    },
  ]

  const [dataSource, setDataSource] = useState([])

  const populateData = useCallback(async () => {
    try{
      const {data} = await apiCall("GET", "/getApprovedTender")
      //const {data} = await apiCall("GET", `/getApprovedTender?roleName=${auth.role}`);
      const res = data?.responseData || [];

      let filteredData = res;
        if (auth.roleId === 1) {
            filteredData = res.filter(item => item.totalValue <= 1000000);
        } else if (auth.roleId === 17) {
            filteredData = res.filter(item => item.totalValue > 1000000);
        }

        setDataSource(filteredData);
     // setDataSource(res);
    }
    catch(error){}
  }, [])

  useEffect(() => {
    populateData()
  }, [populateData])
  return (
    <div>
      <h1 className='font-semibold text-center mb-4'>Approved Tender List</h1>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default ApprovedTenders
