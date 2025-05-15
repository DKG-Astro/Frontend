import { Card, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { grvFields, igpGrnFields} from "./InputFields";
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
  const [isDepreciationDisabled, setIsDepreciationDisabled] = useState(false);

  const [formData, setFormData] = useState({
    giNo: "",
    materialDtlList: [],
    grnType: "GI"
  });

 const handleChange = (fieldName, value) => {
  if (typeof fieldName === "string") {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  } else {
    setFormData(prev => {
      const prevMaterialDtlList = [...prev.materialDtlList];
      prevMaterialDtlList[fieldName[1]] = { ...prevMaterialDtlList[fieldName[1]] };
      prevMaterialDtlList[fieldName[1]][fieldName[2]] = value;

      if (fieldName[2] === "depriciationRate") {
        const material = prevMaterialDtlList[fieldName[1]];
        const unitPrice = parseFloat(material.unitPrice || 0);
        const acceptedQuantity = parseFloat(material.acceptedQuantity || 0);
        const depriciationRate = parseFloat(value || 0);

       // const purchaseDateStr =pre.deliveryDate;
       const purchaseDateStr = prev.gprnDtls?.deliveryDate || prev.deliveryDate;

        let yearsPassed = 0;

        console.log("purchaseDateStr" + purchaseDateStr);
        if (purchaseDateStr) {
          const [day, month, year] = purchaseDateStr.split("/");
          const purchaseDate = new Date(`${year}-${month}-${day}`);
          const today = new Date();

          yearsPassed = today.getFullYear() - purchaseDate.getFullYear();
          const monthDiff = today.getMonth() - purchaseDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < purchaseDate.getDate())) {
            yearsPassed--;
          }
          if (yearsPassed < 0) yearsPassed = 0;
        }

        console.log("depreciationRate" +depriciationRate);
        const purchaseValue = unitPrice * acceptedQuantity;
        console.log("yearsPassed" +yearsPassed)
        const bookValue =
          yearsPassed > 0
            ? purchaseValue * Math.pow(1 - depriciationRate / 100, yearsPassed)
            : purchaseValue;
            console.log("book value " +bookValue);

        prevMaterialDtlList[fieldName[1]].bookValue = bookValue.toFixed(2);
      }

      return { ...prev, materialDtlList: prevMaterialDtlList };
    });
  }
};


const handleSearch = async () => {
  try {
    let processStage = "GRN";
    let processNo = formData.grnNo;

   /* // Override stage and number if GRN number is present
    if (formData.grnType == "GI") {
      processStage = "GI";
      processNo = formData.giNo;
    } else if (formData.grnType === "IGP") {
      processStage = "IGP";
      processNo = formData.giNo;
    }*/
    if (!formData.grnNo) {
      if (formData.grnType === "GI") {
        processStage = "GI";
        processNo = formData.giNo;
      } else if (formData.grnType === "IGP") {
        processStage = "IGP";
        processNo = formData.giNo;
    }
    }

    const { data } = await axios.get(
      `/api/process-controller/getSubProcessDtls?processStage=${processStage}&processNo=${processNo}`
    );

    if (processStage === "GI") {
  const deliveryDate = data?.responseData?.gprnDtls?.deliveryDate;

  // Prepare delivery date for calculation
  let isDepreciationDisabled = false;
  if (deliveryDate) {
    const [day, month, year] = deliveryDate.split('/');
    const poDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    const oneYearLater = new Date(poDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    isDepreciationDisabled = today < oneYearLater;
  }

  const materialWithPrice = data?.responseData?.giDtls?.materialDtlList?.map(material => {
    const gprnMaterial = data?.responseData?.gprnDtls?.materialDtlList?.find(
      m => m.materialCode === material.materialCode
    );
    const unitPrice = parseFloat(gprnMaterial?.unitPrice || 0);
    const acceptedQuantity = parseFloat(material.acceptedQuantity || 0);

    let bookValue = 0;
    let depriciationRate = material.depriciationRate || 0;

    if (isDepreciationDisabled) {
      bookValue = acceptedQuantity * unitPrice;
      depriciationRate = 0; // hide/disable input
    } else {
      // initial value until user inputs depreciationRate
      bookValue = acceptedQuantity * unitPrice * (1 - depriciationRate / 100);
    }

    return {
      ...material,
      unitPrice,
      bookValue: parseFloat(bookValue.toFixed(2)),
      depriciationRate,
    };
  });

  setFormData({
    ...data?.responseData?.giDtls,
    indentorName: data?.responseData?.gprnDtls?.indentorName,
    giNo: data?.responseData?.giDtls?.inspectionNo,
    grnType: "GI",
    materialDtlList: materialWithPrice,
    //deliveryDate,
    gprnDtls: {
  deliveryDate,
},

  });

  setIsDepreciationDisabled(isDepreciationDisabled);

    } else if (processStage === "IGP") {
      setFormData({
        ...data?.responseData,
        giNo: data?.responseData?.igpId,
        grnType: "IGP",
        materialDtlList: data?.responseData?.materialDtlList?.map(material => ({
          ...material,
          acceptedQuantity: material.quantity,
        })),
      });

    } else if (processStage === "GRN") {
      console.log("Handling GRN Type:", data?.responseData?.grnDtls);

      setFormData({
    ...data?.responseData,
    giNo: data?.responseData?.grnDtls?.giNo,  
    grnType: "GI",  
    grnNo: data?.responseData?.grnDtls?.grnNo, 
    grnDate: data?.responseData?.grnDtls?.grnDate, 
    installationDate: data?.responseData?.grnDtls?.installationDate,  
    commissioningDate: data?.responseData?.grnDtls?.commissioningDate,  
    indentorName:data?.responseData.grnDtls?.createdBy,
    materialDtlList: data?.responseData?.grnDtls?.materialDtlList?.map(material => ({
      ...material,
      acceptedQuantity: material.quantity || 0, 
      locatorId: material.locatorId || 0,  
      depriciationRate: material.depriciationRate || 0, 
      bookValue: material.bookValue || 0,  
    })),
      });
    }
  } catch (error) {
    message.error(
      error?.response?.data?.responseStatus?.message || "Error fetching data."
    );
  }
};

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
            renderFormFields(grvFields({ ...formData, isDepreciationDisabled }), handleChange, formData, "", null, setFormData, handleSearch)
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