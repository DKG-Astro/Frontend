import React, { useState } from 'react'
import FormContainer from '../../components/DKG_FormContainer'
import { Form, message } from 'antd'
import FormInputItem from '../../components/DKG_FormInputItem'
import CustomSelect from '../../components/CustomSelect'
import { useSelector } from 'react-redux'
import { modeOfProcurementList } from '../../utils/Constants'
import axios from 'axios'
import Btn from '../../components/DKG_Btn'

const WorkForm = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [procurementMode, setProcurementMode] = useState('')
  const { subCategoryMaster, vendorMaster } = useSelector(state => state.masters)
  const { userId } = useSelector(state => state.auth)

  const vendorMasterMod = vendorMaster?.map(vendor => ({label: vendor.vendorName, value: vendor.vendorName}))

  const onFinish = async (values) => {
    setLoading(true)
    if(values.modeOfProcurement === "Proprietary/Single Tender"){
      if(!values?.vendorNames){
        message.error("Please select vendor name")
        return
      }
    }
    else if(values.modeOfProcurement === "Limited Pre Approved Vendor Tender"){
      if(values?.vendorNames?.length !== 4){
        message.error("Please select 4 vendor names")
        return;
      }
    }
    
    let vendorNames = null;
    if (values.modeOfProcurement === "Proprietary/Single Tender") {
      vendorNames = [values.vendorNames];
    } else if (values.modeOfProcurement === "Limited Pre Approved Vendor Tender") {
      vendorNames = values.vendorNames;
    }
    
    const payload = {
      ...values,
      vendorNames,
      createdBy: userId,
    }

    try {
      const {data} = await axios.post("/api/work-master", payload)
      message.success("Work created successfully")
      form.setFieldValue('workCode', data.responseData.workCode)
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error creating work")
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <Form 
        onFinish={onFinish}
        form={form} 
        layout='vertical'
        onValuesChange={(changedValues) => {
          if (changedValues.modeOfProcurement) {
            setProcurementMode(changedValues.modeOfProcurement)
          }
        }}
        className='grid md:grid-cols-2 gap-x-4'
      >
        <FormInputItem name="workCode" label="Work Code" disabled />
        <CustomSelect name="workSubCategory" label="Work Sub Category" options={subCategoryMaster} />
        <FormInputItem name="workDescription" label="Work Description" />
        {/* <CustomSelect name="modeOfProcurement" label="Mode Of Procurement" options={modeOfProcurementList} /> */}

        {/* {procurementMode === "Proprietary/Single Tender" && (
          <CustomSelect name="vendorNames" label="Vendor Name" options={vendorMasterMod} />
        )}
        {procurementMode === "Limited Pre Approved Vendor Tender" && (
          <CustomSelect name="vendorNames" label="Vendor Names" options={vendorMasterMod} multiselect className="col-span-2" />
        )} */}

        <div className="flex justify-center col-span-2">
          <Btn htmlType='submit' text='Save' loading={loading}/>
        </div>
      </Form>
    </FormContainer>
  )
}

export default WorkForm
