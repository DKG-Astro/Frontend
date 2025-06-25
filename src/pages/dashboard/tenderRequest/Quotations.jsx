import React, { useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import FormContainer from '../../../components/DKG_FormContainer'
import FormBody from '../../../components/DKG_FormBody'
import Heading from '../../../components/DKG_Heading'
import { Table, Checkbox, message } from 'antd'
import axios from 'axios'
import Btn from '../../../components/DKG_Btn'
import { baseURL } from '../../../App';


const Quotations =  ()  => {
 

const location = useLocation();
const { tenderId, bidType } = location.state || {};

 const navigate = useNavigate();
 
  const [quotationData, setQuotationData] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [notSubmittedVendors, setNotSubmittedVendors] = useState([]);


  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`/api/vendor-quotation/${tenderId}`);
      const data = response.data?.responseData || [];
      setQuotationData(data);
    } catch (error) {
      message.error('Failed to fetch vendor quotations');
    }
  };

  const fetchNotSubmittedVendors = async () => {
    try {
    const res = await axios.get(`/api/vendor-quotation/NotSubmitVendors/${tenderId}`);
    setNotSubmittedVendors(res.data.responseData || []);
    } catch (error) {
    message.error("Failed to fetch vendors who didn't submit quotations");
    }
  };

 

  const handleCheckboxChange = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };
  //const [tenderData, setTenderData] = useState(null);
/*
const fetchTenderDetails = async () => {
  try {
    const res = await axios.get(`http://localhost:8081/astro-service/api/tender-requests/data/${tenderId}`);
    setTenderData(res.data.responseData);
  } catch (error) {
    message.error("Failed to fetch tender details");
  }
};*/
useEffect(() => {
  if (tenderId) {
    fetchQuotations();
    fetchNotSubmittedVendors();
  }
}, [tenderId]);
/*tenderUpdateDto , fetchTenderDetails();*/
const handleSubmit = async () => {
  if (!selectedVendor) {
    return message.warning("Please select exactly one vendor");
  }

  const selectedQuotation = quotationData.find(q => q.vendorId === selectedVendor);

  const updatedTender = {
    vendorId: selectedVendor,
    quotationFileName: selectedQuotation?.quotationFileName || '',
  };

  try {
    setIsSubmitting(true);
    await axios.put(`/api/tender-requests/update/${tenderId}`, updatedTender);
    message.success("Tender updated successfully");
    navigate("/queue");
  } catch (error) {
    message.error("Failed to update tender");
  } finally {
    setIsSubmitting(false);
  }
};

  const columns = [
   {
    title: 'Select',
    key: 'select',
    render: (_, record) => (
    <Checkbox
      checked={selectedVendor === record.vendorId}
      onChange={() => {
        if (selectedVendor === record.vendorId) {
          setSelectedVendor(null); // Toggle off
        } else {
          setSelectedVendor(record.vendorId); // Toggle on
        }
      }}
    />
    ),
  },{
      title: 'Vendor ID',
      dataIndex: 'vendorId',
      key: 'vendorId',
    },
    {
      title: 'Quotation File Name',
      dataIndex: 'quotationFileName',
      key: 'quotationFileName',
    },
     {
    title: 'View File',
    key: 'view',
    render: (_, record) => (
      record.quotationFileName ? (
        <a
          href={`${baseURL}/file/view/Tender/${record.quotationFileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      ) : (
        'No File'
      )
    ),
  },
  ];
 


  return (
    <FormContainer>
      <Btn onClick={() => navigate('/queue')} className="mb-4">
        Back
      </Btn>
     
      <Heading title={`Quotation Evaluation for Tender ID: ${tenderId} and BidType :${bidType}`} />

       <FormBody layout="vertical">
        {notSubmittedVendors.length > 0 && (
          <div style={{ marginBottom: '1rem', fontWeight: 'bold', }}>
            The following vendors have not submitted quotations: {notSubmittedVendors.join(', ')}
          </div>
        )}
        <Table
          dataSource={quotationData}
          columns={columns}
          rowKey="vendorId"
        />
        <div className="custom-btn" style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={handleSubmit}  loading={isSubmitting}>Submit Quotation</Btn>
      </div>
      </FormBody>
    </FormContainer>
  )
}

export default Quotations
