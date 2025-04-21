import React, { useRef, useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, DatePicker, message } from 'antd';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Heading from '../../../components/DKG_Heading';
import CustomForm from '../../../components/DKG_CustomForm';
import { renderFormFields } from '../../../utils/CommonFunctions';
import ButtonContainer from '../../../components/ButtonContainer';
import CustomModal from '../../../components/CustomModal';
import { CpDetails } from './InputFields';

const { Option } = Select;

const ContingencyPurchase = () => {
  const printRef = useRef();
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [generatedCpId, setGeneratedCpId] = useState('');
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);

  // Redux selectors
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  // Data states
  const [projects, setProjects] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});
  const [materialOptions, setMaterialOptions] = useState([]);
  const [materialDescOptions, setMaterialDescOptions] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({ materialDetails: [{}] });

  // --- Dynamic Field Population ---
  const populateDropdowns = async () => {
    try {
      const [projectResponse, materialResponse] = await Promise.all([
        axios.get('/api/project-master'),
        axios.get('/api/material-master'),
      ]);
      const vendorResponse = await axios.get('/api/vendor-master');

      // Format projects
      const formattedProjects = (projectResponse.data?.responseData || []).map(project => ({
        label: project.projectNameDescription,
        value: project.projectCode,
      }));
      setProjects(formattedProjects);

      // Format vendors
      const formattedVendors = (vendorResponse.data?.responseData || []).map(vendor => ({
        label: vendor.vendorName,
        value: vendor.vendorName,
      }));
      setVendors(formattedVendors);

      // Format materials
      const materials = materialResponse.data?.responseData || [];
      const materialMap = {};
      const descMap = {};

      materials.forEach(material => {
        materialMap[material.materialCode] = {
          materialDescription: material.description,
          uom: material.uom,
          unitPrice: material.unitPrice,
          currency: material.currency,
          materialCategory: material.category,
          materialSubCategory: material.subCategory
        };

        descMap[material.description] = {
          materialCode: material.materialCode,
          uom: material.uom,
          unitPrice: material.unitPrice,
          currency: material.currency,
          materialCategory: material.category,
          materialSubCategory: material.subCategory
        };
      });

      setMaterialOptions(materials.map(m => ({ label: m.materialCode, value: m.materialCode })));
      setMaterialDescOptions(materials.map(m => ({ label: m.description, value: m.description })));
      setMaterialDetailsMap({ ...materialMap, ...descMap });
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load dropdown data');
    }
  };

  // --- handleChange Function ---
  const handleChange = (name, value) => {
    if (Array.isArray(name)) {
      const [section, index, field] = name;
      
      if (section === 'materialDetails') {
        setFormData(prev => {
          const updatedMaterials = [...prev.materialDetails];
          const materialData = materialDetailsMap[value] || {};

          if (field === 'materialCode' || field === 'materialDescription') {
            updatedMaterials[index] = {
              ...updatedMaterials[index],
              [field]: value,
              ...materialData,
              totalPrice: (materialData.unitPrice || 0) * (updatedMaterials[index]?.quantity || 0)
            };
          } else if (field === 'quantity' || field === 'unitPrice') {
            const quantity = field === 'quantity' ? value : updatedMaterials[index]?.quantity || 0;
            const unitPrice = field === 'unitPrice' ? value : updatedMaterials[index]?.unitPrice || 0;
            
            updatedMaterials[index] = {
              ...updatedMaterials[index],
              [field]: value,
              totalPrice: quantity * unitPrice
            };
          } else {
            updatedMaterials[index] = {
              ...updatedMaterials[index],
              [field]: value
            };
          }

          return { ...prev, materialDetails: updatedMaterials };
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- Form Submission ---

  const onFinish = async () => {
    // Get first material detail item or empty object
    const material = formData.materialDetails[0] || {};
    
    const payload = {
      vendorsName: formData.vendorName,
      vendorsInvoiceNo: formData.vendorInvoiceNo,
      remarksForPurchase: formData.remarks,
      projectName: formData.projectName,
      date: formData.date,
      createdBy: actionPerformer,
      amountToBePaid: formData.amountToBePaid,
      predifinedPurchaseStatement: formData.predefinedPurchaseStatement,
      uploadCopyOfInvoice: formData.uploadCopyOfInvoice,
      // Material fields from first array item
      materialCode: material.materialCode,
      materialDescription: material.materialDescription,
      quantity: material.quantity,
      unitPrice: material.unitPrice,
      // Additional fields from material details
      currency: material.currency,
      materialCategory: material.materialCategory,
      materialSubCategory: material.materialSubCategory
    };
  
    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post('/api/contigency-purchase', payload);
      
      setFormData(prev => ({
        ...prev,
        cpId: data?.responseData?.contigencyId
      }));
      setModalOpen(true);
      localStorage.removeItem('cpDraft');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to submit purchase');
    } finally {
      setSubmitBtnLoading(false);
    }
  };
  
  const handleSearch = async (value) => {
    try {
      const { data } = await axios.get(
        `/api/contigency-purchase/${value || formData.cpId}`
      );
  
      const cpData = data.responseData;
      setFormData({
        ...cpData,
        materialDetails: [{
          materialCode: cpData.materialCode,
          materialDescription: cpData.materialDescription,
          quantity: cpData.quantity,
          unitPrice: cpData.unitPrice,
          uom: cpData.uom,
          currency: cpData.currency,
          materialCategory: cpData.materialCategory,
          materialSubCategory: cpData.materialSubCategory,
          totalPrice: cpData.quantity * cpData.unitPrice
        }],
        predefinedPurchaseStatement: cpData.predifinedPurchaseStatement,
        uploadCopyOfInvoice: cpData.uploadCopyOfInvoice,
        amountToBePaid: cpData.amountToBePaid,
        remarks: cpData.remarksForPurchase,
        // date: dayjs(cpData.date, 'DD/MM/YYYY'),
        vendorName: cpData.vendorsName,
        vendorInvoiceNo: cpData.vendorsInvoiceNo,
        projectName: cpData.projectName
      });
    } catch (error) {
      console.error("Search Error:", error);
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching CP details");
    }
  };

  // --- Draft Handling ---
  useEffect(() => {
    const draft = localStorage.getItem('cpDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
      message.success('Loaded draft data');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cpDraft', JSON.stringify(formData));
  }, [formData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(()=>{
    populateDropdowns();
  },[]);

  // --- Prepare Hydrated Fields ---
  const hydratedCpDetails = CpDetails.map(section => {
    if (section.fieldList) {
      return {
        ...section,
        fieldList: section.fieldList.map(field => {
          if (field.name === 'projectName') return { ...field, options: projects };
          if (field.name === 'vendorName') return { ...field, options: vendors }; // Add this line
          return field;
        })
      };
    }
    if (section.children) {
      return {
        ...section,
        children: section.children.map(child => {
          if (child.name === 'materialCode') return { ...child, options: materialOptions };
          if (child.name === 'materialDescription') return { ...child, options: materialDescOptions };
          return child;
        })
      };
    }
    return section;
  });

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Contingency Purchase Form" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(
          hydratedCpDetails,
          handleChange,
          formData,
          "",
          null,
          setFormData,
          handleSearch
        )}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="cpDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Contingency Purchase"
        processNo={formData?.cpId}
      />
    </Card>
  );
};

export default ContingencyPurchase;