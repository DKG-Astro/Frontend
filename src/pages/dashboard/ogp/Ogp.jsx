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
import { ogpFields } from "./InputFields";

const Ogp = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    issueNoteId: "",
    ogpDate: null,
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
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processNo=${formData.issueNoteId}&processStage=ISN`);
      setFormData(prev => ({
        ...data?.responseData,
        issueNoteId: data.responseData?.issueNoteNo,
        ogpDate: prev.ogpDate,
        materialDtlList: data?.responseData?.materialDtlList?.map(item => ({...item, locatorDesc: locatorMasterObj[parseInt(item.locatorId)]}))
      }));
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching ISN data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveOgp", payload);

      setFormData(prev => ({
        ...prev,
        ogpId: data?.responseData?.processNo
      }));

      localStorage.removeItem("ogpDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save OGP.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("ogpDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Outward Gate Pass" />
      <CustomForm formData={formData}>
        {renderFormFields(ogpFields, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="ogpDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Outward Gate Pass" processNo={formData?.ogpId} />
    </Card>
  );
};

export default Ogp;
