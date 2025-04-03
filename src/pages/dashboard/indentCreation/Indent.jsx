import { Card } from 'antd';
import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import Heading from '../../../components/DKG_Heading';
import CustomForm from '../../../components/DKG_CustomForm';
import { renderFormFields } from '../../../utils/CommonFunctions';
import { IndentDetails } from './InputFields';
import ButtonContainer from '../../../components/ButtonContainer';

const Indent = () => {
    const printRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    const [formData, setFormData] = useState({});
    const handleSearch = (fieldName, value) => {
        console.log(fieldName, value);
        setFormData({...formData, [fieldName]: value});
    }
    const handleChange = (fieldName, value) => {
        console.log(fieldName, value);
        setFormData({...formData, [fieldName]: value}); 
    }
    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
    const onFinish = (values) => {
        console.log(values);
    }
  return (
    <Card className='a4-container' ref={printRef}>
        <Heading title="Indent Creation"/>
        <CustomForm formData={formData}>
            {renderFormFields(IndentDetails, handleChange, formData, "", null, setFormData, handleSearch)}
            <ButtonContainer
         onFinish={onFinish} 
         formData={formData} 
         draftDataName="indentDraft" 
         submitBtnLoading={submitBtnLoading}
         submitBtnEnabled
         printBtnEnabled
         draftBtnEnabled
         handlePrint={handlePrint}
         />
        </CustomForm>
    </Card>
  )
}

export default Indent