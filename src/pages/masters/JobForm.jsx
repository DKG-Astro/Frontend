import React, { useEffect, useState } from 'react'
import FormContainer from '../../components/DKG_FormContainer'
import { Form, message } from 'antd'
import FormInputItem from '../../components/DKG_FormInputItem'
import CustomSelect from '../../components/CustomSelect'
import Heading from "../../components/DKG_Heading";
import { useSelector } from 'react-redux'
import { modeOfProcurementList } from '../../utils/Constants'
import axios from 'axios'
import Btn from '../../components/DKG_Btn'
import { Option } from "antd/es/mentions";
import TextAreaComponent from "../../components/DKG_TextAreaComponent";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import {
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";



const JobForm = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState([])
  const [procurementMode, setProcurementMode] = useState('')
  const {categoryMaster, uomMaster, vendorMaster} = useSelector(state => state.masters)
  const {userId} = useSelector(state => state.auth)
  const [jobList, setJobList] = useState([]);
  const [jobDetailsMap, setJobDetailsMap] = useState({});
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSubcategories, setJobSubcategories] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  const [showJobCodePopup, setShowJobCodePopup] = useState(false);
  const [generatedJobCode, setGeneratedJobCode] = useState("");
  

  const uomMasterMod = uomMaster?.map(uom => ({label: uom.uomName, value: uom.uomName}))
  const vendorMasterMod = vendorMaster?.map(vendor => ({label: vendor.vendorName, value: vendor.vendorName}))
  
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          "/api/job-master"
        );
        const data = await response.json();
  
        if (!data.responseData) throw new Error("Invalid job data");
  
        // Extract unique categories and subcategories
        const categories = [
          ...new Set(data.responseData.map((item) => item.category)),
        ];
        const subCategories = [
          ...new Set(data.responseData.map((item) => item.subCategory)),
        ];
  
        setJobCategories(categories);
        setJobSubcategories(subCategories);
  
        // Create material map for other fields
        const jobMap = data.responseData.reduce(
          (acc, job) => ({
            ...acc,
            [job.jobCode]: {
              ...job,
              jobDescription: job.description,
              jobCategory: job.category,
              jobSubCategory: job.subCategory,
            },
          }),
          {}
        );
  
        setJobDetailsMap(jobMap);
        setJobList(Object.keys(jobMap));
        const uomResponse = await fetch(
          "/api/uom-master"
        );
        const uomData = await uomResponse.json();
  
        if (!uomData.responseData) throw new Error("Invalid UOM data");
  
        // Process UOM data
        const processedUom = uomData.responseData.map((uom) => ({
          value: uom.uomCode,
          label: uom.uomName,
        }));
        setUomOptions(processedUom);
      } catch (error) {
        message.error("Failed to load materials");
        console.error("Material fetch error:", error);
      }
    };
  
    useEffect(() => {
      fetchInitialData();
    }, []);
/*
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
      setGeneratedJobCode(data.responseData?.jobCode);
      setShowJobCodePopup(true);

    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error creating job")
    }
    finally{
      setLoading(false)
    }
    form.resetFields();
  }*/
    const handleSubmit = async (values) => {
      setLoading(true);
     try {
      /*  const existingFiles = fileList
          .filter(file => !file.originFileObj)
          .map(file => file.name);
    
        let uploadedFileNames = [];
    
        for (const file of fileList) {
          if (file.originFileObj) {
            const formData = new FormData();
            formData.append("file", file.originFileObj);
    
            const uploadResponse = await fetch(
              "http://103.181.158.220:8081/astro-service/file/upload?fileType=Material",
              { method: "POST", body: formData }
            );
    
            const uploadResult = await uploadResponse.json();
            if (uploadResult?.responseData?.fileName) {
              uploadedFileNames.push(uploadResult.responseData.fileName);
            }
          }
        }
    
        const finalFileNames = [...existingFiles, ...uploadedFileNames];
        const uploadedFileNameString = finalFileNames.join(",");*/
    
        const payload = {
          category: values.category,
          createdBy: actionPerformer,
          currency: values.currency,
          jobDescription: values.description,
          indigenousOrImported: values.indigenousOrImported,
          subCategory: values.subCategory,
         // unitPrice: values.unitPrice,
          uom: values.uom,
          assetId:values.assetId,
          value:values.value,
          estimatedPriceWithCcy:values.estimatedPrice,
          briefDescription:values.briefDescription,
          updatedBy: String(actionPerformer),
        //  uploadImageFileName: uploadedFileNameString,
        //  briefDescription: values.briefDescription
        };
    
        const response = await fetch(
         // "/api/job-master",
         "/api/job-master",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
    
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.responseStatus?.message || "Operation failed");
        }
    
        setGeneratedJobCode(result.responseData?.jobCode);
        setShowJobCodePopup(true);
        message.success("Job created successfully!");
      } catch (error) {
        message.error(`Submission failed: ${error.message}`);
        console.error("Submission error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    
  
  const JobCodePopup = () => (
    <Modal
      title={"Job Created Successfully"}
      visible={showJobCodePopup}
      onOk={() => setShowJobCodePopup(false)}
      onCancel={() => setShowJobCodePopup(false)}
      okText="OK"
    >
        <p>
          Generated Job Code: <strong>{generatedJobCode}</strong>
        </p>
        <p>
            Job created successfully! JOb Code will be assigned after approval.
        </p>
    
    </Modal>
  );

  return (
    <FormContainer>
       <JobCodePopup />
      <Form 
        onFinish={handleSubmit}
        form={form} 
        layout='vertical'
        onValuesChange={(changedValues) => {
          if (changedValues.modeOfProcurement) {
            setProcurementMode(changedValues.modeOfProcurement)
          }
        }}
      >
    
       <Heading title={"Job Details"} />
               <div className="form-section">
                 <FormInputItem
                   label="Job Code"
                   name="jobCode"
                   disabled
                 />
                 <Form.Item
                   name="category"
                   label="Job Category"
                   rules={[
                     { required: true, message: "Please select material category!" },
                   ]}
                 >
                   <Select placeholder="Select Job Category">
                     {/*materialCategories.map((category) => (
                       <Option key={category} value={category}>
                         {category}
                       </Option>
                     ))*/}
                     <Option value="AMC">AMC (Annual Maintenance Contract)</Option>
                     <Option value="Rate Contract">Rate Contract</Option>
                     <Option value="Repair And Service">Repair & Service</Option>
                     <Option value="Internet Service">Internet Service</Option>
                     <Option value="Other Service">Other Service</Option>
                   </Select>
                 </Form.Item>
       
                 <Form.Item
                   name="subCategory"
                   label="Job Subcategory"
                   rules={[
                     {
                       required: true,
                       message: "Please select Job subcategory!",
                     },
                   ]}
                 >
                   <Select placeholder="Select Job Subcategory">
                     {/*materialSubcategories.map((subCat) => (
                       <Option key={subCat} value={subCat}>
                         {subCat}
                       </Option>
                     ))*/}
                     <Option value="Chemicals">Chemicals</Option>
                     <Option value="Computer & Peripherals">Computer & Peripherals</Option>
                     <Option value="Electrical">Electrical</Option>
                     <Option value="Electronic Items">Electronic Items</Option>
                     <Option value="Equipment">Equipment</Option>
                     <Option value="Furniture">Furniture</Option>
                     <Option value="HARDWARE">HARDWARE</Option>
                     <Option value="Miscellaneous">Miscellaneous</Option>
                     <Option value="Software">Software</Option>
                     <Option value="Stationary">Stationary</Option>
                     <Option value="Vehicles">Vehicles</Option>
                   </Select>
                 </Form.Item>
               </div>
       
               <div className="form-section">
                 <Form.Item label="Job Description" name="description" required>
                   <Input />
                 </Form.Item>
                 <Form.Item
                   name="uom"
                   label="UOM"
                   rules={[{ required: true, message: "Please select a UOM!" }]}
                 >
                   <Select
                     placeholder="Select Unit of Measure"
                     showSearch
                     optionFilterProp="children"
                     filterOption={(input, option) =>
                       option.children.toLowerCase().includes(input.toLowerCase())
                     }
                   >
                     {uomOptions.map((uom) => (
                       <Option key={uom.value} value={uom.value}>
                         {uom.label}
                       </Option>
                     ))}
                   </Select>
                 </Form.Item>
                 {/* <CustomSelect 
                   name="modeOfProcurement" 
                   label="Mode Of Procurement" 
                   options={modeOfProcurementList} 
                   required 
                 /> */}
                 {/* <FormInputItem
                   type="number"
                   name="unitPrice"
                   label="Unit Price"
                   required
                 /> */}
                 <TextAreaComponent
                   label="Brief Description of Job"
                   name="briefDescription"
                   required
                 />
               </div>
               <div className="form-section">
                 {/* <Form.Item label="End of Life" name="endOfLife">
                   <DatePicker format="YYYY-MM-DD" />
                 </Form.Item> */}
                 {/* <FormInputItem
                   type="number"
                   label="Depreciation Rate"
                   name="depreciationRate"
                 />
                 <FormInputItem
                   type="number"
                   label="Stock Levels"
                   name="stockLevels"
                 /> */}
               </div>
       
               <div className="form-section">
                 {/* <FormInputItem label="Condition of Goods" name="conditionOfGoods" />
                 <FormInputItem label="Shelf Life" name="shelfLife" /> */}
                 <FormInputItem
                   type="number"
                   name="estimatedPrice"
                   label="Estimated Price"
                   required
                 />
                 <Form.Item
                   name="currency"
                   label="Currency"
                   rules={[{ required: true }]}
                 >
                   <Select placeholder="Select Currency">
                     <Option value="USD">USD</Option>
                     <Option value="INR">INR</Option>
                     <Option value="EUR">EUR</Option>
                     <Option value="GBP">GBP</Option>
                   </Select>
                 </Form.Item>
       
                 <Form.Item
                   name="indigenousOrImported"
                   label="Origin"
                   rules={[{ required: true }]}
                   valuePropName="checked"
                 >
                   <Radio.Group>
                     <Radio value="indigenous">Indigenous</Radio>
                     <Radio value="imported">Imported</Radio>
                   </Radio.Group>
                 </Form.Item>
               </div>
               {/* 
               <div className="form-section">
                 <Form.Item label="Upload Document">
                   <Upload
                     beforeUpload={() => false}
                     multiple={true}
                     //   accept="image/*"
                     fileList={fileList}
                     onPreview={(file) => window.open(file.url, "_blank")}
                     onChange={({ fileList }) => setFileList(fileList)}
                   >
                     <Button icon={<UploadOutlined />}>Select File</Button>
                   </Upload>
                 </Form.Item>
               </div>*/}
       
               <div
                 style={{
                   display: "flex",
                   justifyContent: "space-between",
                   margin: "20px",
                 }}
               >
                 <Button type="default" htmlType="reset">
                   <ReloadOutlined />
                   Reset
                 </Button>
                 <Button type="primary" htmlType="submit" loading={loading}>
                   <SendOutlined />
                   Create
                 </Button>
                 <Button type="dashed" htmlType="button">
                   <SaveOutlined />
                   Save Draft
                 </Button>
               </div>
             </Form>
    </FormContainer>
  )
}


/*import React, { useEffect, useState } from 'react'
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
        {/* <CustomSelect name="modeOfProcurement" label="Mode Of Procurement" options={modeOfProcurementList} /> }
        <CustomSelect name="uom" label="UOM" options={uomMasterMod} />
        <FormInputItem name="value" label="Value" />

        { {procurementMode === "Proprietary/Single Tender" && (
          <CustomSelect name="vendorNames" label="Vendor Name" options={vendorMasterMod} />
        )}
        {procurementMode === "Limited Pre Approved Vendor Tender" && (
          <CustomSelect name="vendorNames" label="Vendor Names" options={vendorMasterMod} multiselect className="col-span-2" />
        )} }

        <div className="flex justify-center col-span-2">
          <Btn htmlType='submit' text='Save' loading={loading}/>
        </div>

      </Form>
    </FormContainer>
  )
}
*/
export default JobForm
