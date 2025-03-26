import React, { useEffect, useState } from 'react'
import FormContainer from '../../components/DKG_FormContainer'
import { Form, message } from 'antd'
import FormInputItem from '../../components/DKG_FormInputItem'
import CustomSelect from '../../components/CustomSelect'
import { useSelector } from 'react-redux'
import { modeOfProcurementList } from '../../utils/Constants'
import axios from 'axios'
import Btn from '../../components/DKG_Btn'

const JobForm = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState([])
  const [procurementMode, setProcurementMode] = useState('')
  const {categoryMaster, uomMaster, vendorMaster} = useSelector(state => state.masters)
  const {userId} = useSelector(state => state.auth)

  const uomMasterMod = uomMaster?.map(uom => ({label: uom.uomName, value: uom.uomName}))
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
      createdBy: userId
    }

    try {
      const {data} = await axios.post("/api/job-master", payload)
      message.success("Job created successfully")
      form.setFieldValue('jobCode', data.responseData.jobCode)

    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error creating job")
    }
    finally{
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
        <FormInputItem name="jobCode" label="Job Code" disabled />
        <FormInputItem name="assetId" label="Asset Id" />
        <CustomSelect name="category" label="Category" options={categoryMaster} />
        <FormInputItem name="jobDescription" label="Job Description" />
        {/* <CustomSelect name="modeOfProcurement" label="Mode Of Procurement" options={modeOfProcurementList} /> */}
        <CustomSelect name="uom" label="UOM" options={uomMasterMod} />
        <FormInputItem name="value" label="Value" />

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

export default JobForm
