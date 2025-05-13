import { Card, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { isnFields } from "./InputFields";
import ItemSearch from "../../../components/ItemSearch";
import { renderFormFields } from "../../../utils/CommonFunctions";

const Isn = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    issueNoteNo: ``,
    issueDate: null,
    consigneeDetail: "",
    indentorName: "",
    fieldStation: "",
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
      const {data} = await axios.get(`/api/asset-controller/getAssetDetails?assetId=${formData.assetId}`);
      
      setFormData(prev => ({
        ...prev,
        materialDtlList: data?.responseData || []
      }));
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }

  const {userId, locationId} = useSelector(state => state.auth);

  const onFinish = async () => {
    const payload = {...formData, locationId, createdBy: userId};

    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post("/api/process-controller/saveIsn", payload);

      setFormData(prev => ({
        ...prev,
        issueNoteNo: data?.responseData?.processNo
      }));

      localStorage.removeItem("isnDraft");
      setModalOpen(true);
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save Issue Note.");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  useEffect(() => {
    const draft = localStorage.getItem("isnDraft");
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
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching item quantity details.");
    }
  }, [])

  

  useEffect(() => {
    populateItemQtyDtls()
  }, [populateItemQtyDtls])

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Issue Note" />

      <ItemSearch itemArray={itemQtyList} setFormData={setFormData} />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(isnFields, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="isnDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Issue Note" processNo={formData?.issueNoteNo} />
    </Card>
  );
};

export default Isn;
