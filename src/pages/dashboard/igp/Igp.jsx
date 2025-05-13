import { Card, Form, message, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { igpFields, igpPoFields } from "./InputFields";
import { useLocation } from "react-router-dom";

const Igp = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const location = useLocation();
  const state = location.state;
  ;

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    ogpId: "",
    igpDate: null,
    materialDtlList: []
  });

  const handleChange = (fieldName, value) => {
    if(typeof fieldName === 'string')
      setFormData(prev => ({...prev, [fieldName]: value}))
    else{
      setFormData(prev => {
        const prevMaterialDtlList = [...prev.materialDtlList];
        prevMaterialDtlList[fieldName[1]][fieldName[2]] = value;
        return {...prev, materialDtlList: prevMaterialDtlList}  
      })
    }
  }

  const {locatorMaster} = useSelector(state => state?.masters);

  const locatorMasterObj = locatorMaster?.reduce((acc, obj) => {
    const { value, label } = obj;
    acc[value] = label;
    return acc;
  }, {});

  const handleSearch = async () => {
    
    try {
      const endpoint = formData.igpType === "PO" 
        ? `/api/process-controller/getPoOgp?processNo=${formData.ogpId}`
        : `/api/process-controller/getSubProcessDtls?processNo=${formData.ogpId}&processStage=OGP`;

      const {data} = await axios.get(endpoint);
      setFormData(prev => ({
        ...data?.responseData,
        ogpId: data.responseData?.ogpId,
        igpDate: prev.igpDate,
        igpType: prev.igpType,
        materialDtlList: data?.responseData?.materialDtlList?.map(item => ({
          ...item,
          locatorDesc: locatorMasterObj[parseInt(item.locatorId)]
        }))
      }));
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching OGP data.");
    }
  }


  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveIgp", payload);

      setFormData(prev => ({
        ...prev,
        igpId: data?.responseData?.processNo
      }));

      localStorage.removeItem("igpDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save IGP.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("igpDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  // First useEffect to set initial data from state
  useEffect(() => {
    if(state?.processNo && state?.type) {
      setFormData(prev => ({
        ...prev,
        igpType: state.type,
        ogpId: state.processNo
      }));
    }
  }, [state]);

  // Second useEffect to handle search when formData changes
  useEffect(() => {
    if (formData.igpType && formData.ogpId) {
      handleSearch();
    }
  }, [formData.igpType, formData.ogpId]);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Inward Gate Pass" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {/* {renderFormFields(igpFields, handleChange, formData, "", null, setFormData, handleSearch)} */}
        <h1 className="font-semibold">Order Details</h1>
        <div className="grid md:gap-x-4 md:gap-y-2 md:grid-cols-3">
          <Form.Item name="igpType" label="Type">
            <Select options={[{label: "PO", value: "PO"}, {label: "Goods Issue", value: "Goods Issue"}]} onChange={(val) => handleChange("igpType", val)}/>
          </Form.Item>
        </div>

        {
          formData.igpType === "PO" && renderFormFields(igpPoFields, handleChange, formData, "", null, setFormData, handleSearch)
        }
        {
          formData.igpType === "Goods Issue" && renderFormFields(igpFields, handleChange, formData, "", null, setFormData, handleSearch)
        }
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="igpDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Inward Gate Pass" processNo={formData?.igpId} />
    </Card>
  );
};

export default Igp;
