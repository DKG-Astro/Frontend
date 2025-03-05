import { Card } from 'antd'
import React, { useRef, useState } from 'react'
import Heading from '../../../components/DKG_Heading'
import CustomForm from '../../../components/DKG_CustomForm';
import { renderFormFields } from '../../../utils/CommonFunctions';
import { generalDtls } from './InputFields';

const Temp = () => {
    const printRef = useRef();
    const [formData, setFormData] = useState({

    })

    const handleChange = (fieldName, value) => {
      setFormData(prev => ({...prev, [fieldName]: value}))
    }

    console.log("Formdata: ", formData)
  return (
    <Card className='a4-container' ref={printRef}>
      <Heading title="Goods Provisional Receipt Note"/>
      <CustomForm formData={formData}>
        {renderFormFields(generalDtls, handleChange)}
      </CustomForm>
      
    </Card>
  )
}

export default Temp
