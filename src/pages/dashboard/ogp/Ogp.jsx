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
import { ogpFields, ogpFieldsPo } from "./InputFields";
import { Modal } from "antd";  

import { set } from "lodash";
const confirmReturnable = () => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: "Confirm Return Date",
      content: "Please confirm the Return Date. Do you want to proceed?",
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
};

const Ogp = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
const senderName = useSelector(state => state.auth.userName)

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    issueNoteId: "",
    ogpDate: null,
    materialDtlList: [],
    senderName: senderName
  });

  const handleChange = (fieldName, value) => {

   if (fieldName === "ogpType") {
    if (value === "Non Returnable") {
      setFormData((prev) => ({ ...prev, [fieldName]: value, dateOfReturn: null }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
    return;
  }

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
    if(formData.type === "PO"){
      const {data} = await axios.get(`api/purchase-orders/${formData.issueNoteId}`)
          setFormData(prev => ({
            ...data?.responseData,
            type: "PO",
            ogpType: prev.ogpType,
            issueNoteId: data.responseData?.poId,
            ogpDate: prev.ogpDate,
            senderName: prev.senderName,
            materialDtlList: data?.responseData?.purchaseOrderAttributes || []
          }));

          return;
    }
    try {
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processNo=${formData.issueNoteId}&processStage=ISN`);
      setFormData(prev => ({
        ...data?.responseData,
        issueNoteId: data.responseData?.issueNoteNo,
        type: "Goods Issue",
        ogpType: prev.ogpType,
        senderName: prev.senderName,
        ogpDate: prev.ogpDate,
        materialDtlList: data?.responseData?.materialDtlList?.map(item => ({...item, locatorDesc: locatorMasterObj[parseInt(item.locatorId)]}))
      }));
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching ISN data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    if (formData.ogpType === "Returnable") {
    if (!formData.dateOfReturn) {
      message.error("Please enter the Return Date before submitting.");
      return;
    }
    const confirmed = await confirmReturnable();
    if (!confirmed) return;
  }
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      
      const endpoint = formData.type === "PO" ? "/api/process-controller/savePoOgp" : "/api/process-controller/saveOgp";
      const {data} = await axios.post(endpoint, payload);

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

  const getFilteredOgpFields = () => {
  if (formData.ogpType === "Non Returnable") {
    return ogpFields.map(section => {
      if (!section.fieldList) return section;
      return {
        ...section,
        fieldList: section.fieldList.filter(f => f.name !== "dateOfReturn")
      }
    });
  }
  return ogpFields;
};



const getFilteredOgpFieldsPo = () => {
  if (formData.ogpType === "Non Returnable") {
    return ogpFieldsPo.map(section => {
      if (!section.fieldList) return section;
      return {
        ...section,
        fieldList: section.fieldList.filter(f => f.name !== "dateOfReturn")
      }
    });
  }
  return ogpFieldsPo;
};
console.log(getFilteredOgpFields());
console.log(getFilteredOgpFieldsPo());


  

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Outward Gate Pass" />
      <CustomForm formData={formData} onFinish={onFinish}>
        <h1 className="font-semibold">Order Details</h1>
        <div className="grid md:gap-x-4 md:gap-y-2 md:grid-cols-3">
          <Form.Item name="type" label="Type">
            <Select options={[{label: "PO", value: "PO"}, {label: "Goods Issue", value: "Goods Issue"}]} onChange={(val) => handleChange("type", val)}/>
          </Form.Item>
        </div>
        
        {
          formData.type === "PO" && renderFormFields(getFilteredOgpFieldsPo(), handleChange, formData, "", null, setFormData, handleSearch)
        }
        {
          formData.type === "Goods Issue" && renderFormFields(getFilteredOgpFields(), handleChange, formData, "", null, setFormData, handleSearch)
        }
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
