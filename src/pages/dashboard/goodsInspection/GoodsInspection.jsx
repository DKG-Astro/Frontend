import { Card, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { generalDtls } from "./InputFields";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";

const GoodsInspection = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    gprnNo: "",
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

  const handleSearch = async () => {
    try {
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processStage=GPRN&processNo=${formData.gprnNo}`);
      setFormData(data.responseData);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveGi", payload);

      setFormData(prev => ({
        ...prev,
        giNo: data?.responseData?.processNo
      }));

      localStorage.removeItem("goodsInspectionDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save Goods Inspection.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("goodsInspectionDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Goods Inspection" />
      <CustomForm formData={formData}>
        {renderFormFields(generalDtls, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="goodsInspectionDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Goods Inspection" processNo={formData?.giNo} />
    </Card>
  );
};

export default GoodsInspection;
