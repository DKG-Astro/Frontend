import { Card, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { assetFields } from "./InputFields";
import { renderFormFields } from "../../../utils/CommonFunctions";

const Asset = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    assetId: null,
    materialCode: "",
    materialDesc: "",
    assetDesc: "",
    makeNo: "",
    serialNo: "",
    modelNo: "",
    uomId: "",
    componentName: "",
    componentId: null,
    initQuantity: null,
    unitPrice: null,
    depriciationRate: null,
    endOfLife: null,
    stockLevels: null,
    conditionOfGoods: "",
    shelfLife: "",
    locatorId: null
  });
  const handleSearch = async (value) => {
   console.log("handleSearch received value:", value);
   try {
    const { data } = await axios.get(`http://localhost:8081/astro-service/api/asset/getAssetDtl`, {
      params: { assetId: value }
    });
    setFormData(data.responseData || {});
    } catch (error) {
    message.error("Error while fetching Asset data.");
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({...prev, [fieldName]: value}));
  }

  const {userId, locationId} = useSelector(state => state.auth);
 


  const onFinish = async () => {
    const payload = {
      ...formData,
      locationId,
      createdBy: userId
    };

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post('/api/asset/save', payload);

      setFormData(prev => ({
        ...prev,
        assetId: data?.responseData?.processNo
      }));

      localStorage.removeItem("assetDraft");
      setModalOpen(true);
      message.success('Asset created successfully');
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to create asset.');
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("assetDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Asset Master" />
      
      <CustomForm formData={formData} onFinish={onFinish}>
        {/*renderFormFields(assetFields, handleChange, handleSearch, formData)*/}
        {renderFormFields(assetFields, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="assetDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Asset Master" processNo={formData?.assetId} />
    </Card>
  );
};

export default Asset;
