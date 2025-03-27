import { Card, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/DKG_Heading'
import CustomForm from '../../../components/DKG_CustomForm';
import { renderFormFields } from '../../../utils/CommonFunctions';
import { generalDtls } from './InputFields';
import ButtonContainer from '../../../components/ButtonContainer';
import { useReactToPrint } from 'react-to-print';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomModal from '../../../components/CustomModal';

const GPRN = () => {
    const printRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
    const [formData, setFormData] = useState({
      // // gprnNo: "GPRN-2025001",
      // poId: "PO123456",
      // date: "13/12/2001",
      // challanNo: "DCN-78901",
      // deliveryDate: "13/12/2001",
      // vendorId: "VEND-001",
      // vendorName: "Astro Supplies Ltd.",
      // vendorEmail: "vendor@example.com",
      // vendorContactNo: 9876543210,
      // fieldStation: "Station A",
      // indentorName: "John Doe",
      // supplyExpectedDate: "13/12/2001",
      // consigneeDetail: "XYZ Warehouse, New York",
      // warrantyYears: 2,
      // project: "Space Exploration Project",
      // // receivedQty: "100",
      // // pendingQty: "20",
      // // acceptedQty: "80",
      // // provisionalReceiptCertificate: null,
      // receivedBy: "Jane Doe",
      // createdBy: "Admin",
      // updatedBy: "Editor",
      // materialDtlList: [
      //   {
      //     materialCode: "MAT-001",
      //     materialDesc: "Aluminum Sheet",
      //     uomId: "KG",
      //     orderedQuantity: 200,
      //     quantityDelivered: 180,
      //     receivedQuantity: 170,
      //     unitPrice: 25.5,
      //     makeNo: "Make-123",
      //     modelNo: "Model-XYZ",
      //     serialNo: "SN-001A",
      //     warranty: "2 Years",
      //     note: "Handle with care",
      //   },
      //   {
      //     materialCode: "MAT-002",
      //     materialDesc: "Copper Sheet",
      //     uomId: "KG",
      //     orderedQuantity: 200,
      //     quantityDelivered: 180,
      //     receivedQuantity: 170,
      //     unitPrice: 25.5,
      //     makeNo: "Make-1234",
      //     modelNo: "Model-XYZA",
      //     serialNo: "SN-001AB",
      //     warranty: "21 Years",
      //     note: "Dont handle with care",
      //   },
      // ],
    });

    console.log("Formdata: ", formData)

    const handleChange = (fieldName, value) => {
      if(typeof fieldName === 'string')
        setFormData(prev => ({...prev, [fieldName]: value}))
      else{
        setFormData(prev => {
          const prevMaterialDtlList = prev.materialDtlList
          prevMaterialDtlList[fieldName[1]][fieldName[2]] = value
          return {...prev, materialDtlList: prevMaterialDtlList}  
        })
      }
    }

    const {userId, locationId} = useSelector(state => state.auth)

    const onFinish = async () => {
      const payload = {...formData, locationId, createdBy: userId }

      try{
        setSubmitBtnLoading(true)
        const {data} = await axios.post("/api/process-controller/saveGprn", payload)

        setFormData({
          ...formData,
          gprnNo: data?.responseData?.processNo
        })

        localStorage.removeItem("gprnDraft")
        setModalOpen(true)

      }
      catch(error){
        message.error(error?.response?.data?.responseStatus?.message || "Failed to save GPRN.");
        console.log("Error: ", error?.response?.data?.responseStatus?.message);
      }
      finally{
        setSubmitBtnLoading(false)
      }
    }

    const handleSearch = async () => {
        try{
          const {data} = await axios.get(`api/purchase-orders/${formData.poId}`)

          const {data: vendorData} = await axios.get(`/api/vendor-master/${data?.responseData?.vendorId}`)
          const {data: indentData}  = await axios.get(`/api/indents/${data?.responseData?.indentIds[0]}`)

          setFormData({
            poId: data?.responseData?.poId,
            vendorId: data?.responseData?.vendorId,
            vendorName: vendorData?.responseData?.vendorName,
            vendorEmail: vendorData?.responseData?.emailAddress,
            vendorContactNo: vendorData?.responseData?.contactNo,
            project: data?.responseData?.projectName || "N/A",
            indentorName: indentData?.responseData?.indentorName,
            consigneeDetail: data?.responseData?.consignesAddress,
            materialDtlList: data?.responseData?.purchaseOrderAttributes?.map((mat, idx) => ({...mat, materialDesc: mat.materialDescription, uomId: mat.uom, orderedQuantity: mat.quantity}))
          })
        }
        catch(error){
          console.log("ERROR: ", error)
          message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
        }
    }

    useEffect(() => {
      const gprnDraft = localStorage.getItem("gprnDraft");
      if(gprnDraft){
        setFormData(JSON.parse(gprnDraft))
        message.success("Form loaded from draft.")
      }
    }, [])
    
  return (
    <Card className='a4-container' ref={printRef}>
      <Heading title="Goods Provisional Receipt Note"/>
      <CustomForm formData={formData} onFinish={onFinish}>
        {/* {renderFormFields(generalDtls, handleChange, formData)} */}
        {renderFormFields(generalDtls, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
         onFinish={onFinish} 
         formData={formData} 
         draftDataName="gprnDraft" 
         submitBtnLoading={submitBtnLoading}
         submitBtnEnabled
         printBtnEnabled
         draftBtnEnabled
         handlePrint={handlePrint}
         />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="GPRN" processNo={formData?.gprnNo} />
    </Card>
  )
}

export default GPRN
