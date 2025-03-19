import { Card, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { grvFields } from "./InputFields";

const Grv = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    giNo: "",
    materialDtlList: []
  });

  const handleChange = (fieldName, value) => {
    console.log("Handlechangecalled", fieldName, value)

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

  const handleSearch = async () => {
    try {
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processNo=${formData.giNo}&processStage=GI`);
      setFormData(prev => ({
        ...data?.responseData.giDtls,
        giNo: data.responseData?.giDtls?.inspectionNo,
        // grvNo: prev.grvNo,
        // date: prev.date
      }));
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching GI data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveGrv", payload);

      setFormData(prev => ({
        ...prev,
        grvNo: data?.responseData?.processNo
      }));

      localStorage.removeItem("grvDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save GRV.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("grvDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Goods Return Voucher" />
      <CustomForm formData={formData}>
        {renderFormFields(grvFields, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="grvDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Goods Return Voucher" processNo={formData?.grvNo} />
    </Card>
  );
};

export default Grv;