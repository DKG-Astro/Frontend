import { Card, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { grvFields, igpGrnFields } from "./InputFields";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";

const Grn = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    giNo: "",
    materialDtlList: [],
    grnType: "GI"
  });

  const handleChange = (fieldName, value) => {
    console.log("Fieldnm: ", fieldName[2])
    if(typeof fieldName === 'string')
      setFormData(prev => ({...prev, [fieldName]: value}))
    else{
      setFormData(prev => {
        const prevMaterialDtlList = [...prev.materialDtlList];
        prevMaterialDtlList[fieldName[1]][fieldName[2]] = value;
        
        // Calculate book value when depreciation rate changes
        if(fieldName[2] === 'depriciationRate') {
          const unitPrice = parseFloat(prevMaterialDtlList[fieldName[1]].unitPrice || 0);
          const depreciationRate = parseFloat(value || 0);
          const depreciation = (depreciationRate * unitPrice) / 100;
          prevMaterialDtlList[fieldName[1]].bookValue = (unitPrice - depreciation).toFixed(2);
        }

        return {...prev, materialDtlList: prevMaterialDtlList}  
      })
    }
  }

  const handleSearch = async () => {
    try {
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processStage=${formData.grnType}&processNo=${formData.giNo}`);
      if(formData.grnType === "GI") {
        // Map GPRN material details to get unit price
        const materialWithPrice = data?.responseData?.giDtls?.materialDtlList.map(material => {
          const gprnMaterial = data?.responseData?.gprnDtls?.materialDtlList.find(
            m => m.materialCode === material.materialCode
          );
          return {
            ...material,
            unitPrice: gprnMaterial?.unitPrice || 0
          };
        });

        setFormData({
          ...data?.responseData?.giDtls, 
          indentorName: data?.responseData?.gprnDtls?.indentorName,
          giNo: data.responseData?.giDtls?.inspectionNo, 
          grnType: "GI",
          materialDtlList: materialWithPrice
        });
      }
      else {
        setFormData(
          {...data?.responseData, giNo: data.responseData?.igpId, grnType: "IGP",
            materialDtlList: data?.responseData?.materialDtlList?.map((material, index) => ({
              ...material, acceptedQuantity: material.quantity
            }))
          });
        }
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveGrn", payload);

      setFormData(prev => ({
        ...prev,
        grnNo: data?.responseData?.processNo
      }));

      localStorage.removeItem("grnDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save GRN.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("grnDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Goods Receipt Note" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {
          formData.grnType === "GI" && (
            renderFormFields(grvFields, handleChange, formData, "", null, setFormData, handleSearch)
          )
        }
        {
          formData.grnType === "IGP" && (
            renderFormFields(igpGrnFields, handleChange, formData, "", null, setFormData, handleSearch)
          )
        }
        {/* {renderFormFields(grvFields, handleChange, formData, "", null, setFormData, handleSearch)} */}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="grnDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Goods Receipt Note" processNo={formData?.grnNo} />
    </Card>
  );
};

export default Grn;