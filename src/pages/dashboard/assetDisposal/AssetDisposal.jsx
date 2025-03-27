import { Card, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { assetDisposalFields } from "./InputFields";
import ItemSearch from "../../../components/ItemSearch";
import { renderFormFields } from "../../../utils/CommonFunctions";

const AssetDisposal = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    disposalDate: null,
    vendorId: "",
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

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/asset/dispose", payload);

      setFormData(prev => ({
        ...prev,
        disposalId: data?.responseData?.processNo
      }));

      localStorage.removeItem("assetDisposalDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save Asset Disposal.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("assetDisposalDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  const [itemQtyList, setItemQtyList] = useState([]);

  const populateItemQtyDtls = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/process-controller/getIsnAssetOhqDtls');
      if (data?.responseData) {
        setItemQtyList(data.responseData);
      }
    } catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching asset details.");
    }
  }, [])

  useEffect(() => {
    populateItemQtyDtls()
  }, [populateItemQtyDtls])

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Asset Disposal" />

      <ItemSearch itemArray={itemQtyList} setFormData={setFormData} />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(assetDisposalFields, handleChange, formData)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="assetDisposalDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Asset Disposal" processNo={formData?.disposalId} />
    </Card>
  );
};

export default AssetDisposal;