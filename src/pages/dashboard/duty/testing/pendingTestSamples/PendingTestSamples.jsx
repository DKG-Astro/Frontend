import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer'
import SubHeader from '../../../../../components/DKG_SubHeader'
import GeneralInfo from '../../../../../components/DKG_GeneralInfo'
import data from '../../../../../utils/frontSharedData/Testing/Testing.json'
import FormBody from '../../../../../components/DKG_FormBody'
import { FilterFilled } from '@ant-design/icons';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem'
import { Checkbox, Divider, Table } from 'antd'
import Search from "../../../../../components/DKG_Search"
import Btn from '../../../../../components/DKG_Btn';
import { useNavigate } from "react-router-dom";

const { pendingTestSamplesData: sampleData, pendingTestSamplesColumns, testingGeneralInfo, railGradeList, testCategoryList, millList } = data;

const checkBoxItems = [
    { "key": 1, "value": "Regular" },
    { "key": 2, "value": "USB" },
    { "key": 3, "value": "LOB" }
]

const checkBoxItemsSec = [
    { "key": 1, "value": "Accepting Test" },
    { "key": 2, "value": "Retest" }
]

const PendingTestSamples = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        mill: '', railGrade: '', testCategory: ''
    })
    const [checkedValues, setCheckedValues] = useState([])
    const [checkedValuesSec, setCheckedValuesSec] = useState([])

    const handleChange = (fieldName, value) => {
        setFormData(prev => {
          return {
            ...prev,
            [fieldName]: value
          }
        })
    }

    const handleClick = () => {
        navigate('/testing/home')
    };

  return (
    <FormContainer>
        <SubHeader title="Pending Test Samples" link="/testing/home" />
        <GeneralInfo data={testingGeneralInfo} />

        {/* <FormBody initialValues={formData}>
            <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 gap-x-4'>
                <div className='flex items-center gap-x-2'>
                    <FilterFilled />
                    <FormDropdownItem label='Rail Grade' name='railGrade' dropdownArray={railGradeList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
                </div>

                <div className='flex items-center gap-x-2'>
                    <FilterFilled />         
                    <FormDropdownItem label ='Test Category' name='testCategory' dropdownArray={testCategoryList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
                </div>

                <div className='flex items-center gap-x-2'>
                    <Checkbox.Group
                        options={checkBoxItems.map(item => ({key: item.key, label: item.value, value: item.key }))}
                        value={checkedValues}
                        onChange={(checkedValues) => setCheckedValues(checkedValues)}
                        className='mb-6 sm:mb-0'
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 gap-x-4'>
                <div className='flex items-center gap-x-2'>
                    <FilterFilled />
                    <FormDropdownItem label='Mill' name='mill' dropdownArray={millList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
                </div>

                <div className='flex justify-center items-center mb-6 sm:mb-0'>
                    <Search placeholder='Search by S. No.' />
                </div>

                <div className='flex items-center gap-x-2'>
                    <Checkbox.Group
                        options={checkBoxItemsSec.map(item => ({key: item.key, label: item.value, value: item.key }))}
                        value={checkedValuesSec}
                        onChange={(checkedValuesSec) => setCheckedValuesSec(checkedValuesSec)}
                        className='mb-6 sm:mb-0'
                    />
                </div>
            </div>

            <Divider className='mt-0 mb-6' /> */}

            <Table
                dataSource={sampleData}
                columns={pendingTestSamplesColumns}
                scroll={{ x: true }}
                bordered
                pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
                }}
            />

            <div className='flex justify-center'>
                <Btn onClick={handleClick}>OK</Btn>
            </div>
        {/* </FormBody> */}
    </FormContainer>
  )
}

export default PendingTestSamples