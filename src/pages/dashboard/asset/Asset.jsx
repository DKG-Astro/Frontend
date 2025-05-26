import { Card, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { assetFields } from "./InputFields";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { locatorMaster } from "../grn/InputFields";

const Asset = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [assetIdList, setAssetIdList] = useState([]);



const assetFields = [
    {
        heading: "Asset Details",
        colCnt: 6,
        fieldList: [
            {
                name: "assetId",
                label: "Asset ID",
                type: "select",
                span: 2,
                options: assetIdList,
                // disabled: true,
                // required: true
            },
            {
                name: "materialCode",
                label: "Material Code",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "materialDesc",
                label: "Material Description",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "assetDesc",
                label: "Asset Description",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 3,
                required: true
            }
        ]
    },
    {
        heading: "Technical Details",
        colCnt: 6,
        fieldList: [
            {
                name: "makeNo",
                label: "Make No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "modelNo",
                label: "Model No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "serialNo",
                label: "Serial No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "componentName",
                label: "Component Name",
                type: "text",
                span: 3,
                required: false
            },
            {
                name: "componentId",
                label: "Component ID",
                type: "text",
                span: 3,
                required: false
            }
        ]
    },
    {
        heading: "Quantity and Price Details",
        colCnt: 6,
        fieldList: [
            {
                name: "initQuantity",
                label: "Initial Quantity",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "unitPrice",
                label: "Unit Price",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "stockLevels",
                label: "Stock Levels",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "depriciationRate",
                label: "Depreciation Rate",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "locatorId",
                label: "Locator",
                type: "select",
                options: locatorMaster,
                span: 2,
                required: true
            }
        ]
    },
    {
        heading: "Additional Details",
        colCnt: 6,
        fieldList: [
            {
                name: "endOfLife",
                label: "End of Life",
                type: "date",
                span: 2,
                required: true
            },
            {
                name: "shelfLife",
                label: "Shelf Life",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "conditionOfGoods",
                label: "Condition of Goods",
                type: "text",
                span: 2,
                required: true
            }
        ]
    }
];

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

  const populateAssetDtls = async (assetId) => {
    try{
      const {data} = await axios.get(`/api/asset/getAssetDtl?assetId=${assetId}`);
      setFormData(data.responseData);
    }
    catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to load asset details.');
    }
  }

  const handleChange = (fieldName, value) => {
    if(fieldName === "assetId") {
      populateAssetDtls(value);
      return;
    }
    setFormData(prev => ({...prev, [fieldName]: value}));
  }

  const {userId, locationId} = useSelector(state => state.auth);
 


  const updateAsset = async (payload) => {
    try {
      setSubmitBtnLoading(true);
      const {data} = await axios.post('/api/asset/update', payload);
      message.success('Asset updated successfully');
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to update asset.');
    } finally {
      setSubmitBtnLoading(false);
    }
  }

  const onFinish = async () => {
    const payload = {
      ...formData,
      locationId,
      createdBy: userId
    };

    if(formData?.assetId) {
      
      updateAsset(payload);
      return;
    }

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

  const populateData = useCallback(async () => {
    try{
      const {data} = await axios.get(`/api/asset/assetIds`);
      const assetIdOption = data.responseData?.map(item => ({label: item, value: item}));

      setAssetIdList(assetIdOption);
    }
    catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || 'Failed to load asset ids.');
    }
  }, [])

  useEffect(() => {
    populateData();
  }, [])

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
