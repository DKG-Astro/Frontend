import { Card, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
// import { generalDtls } from "./InputFields";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";
import { useLocation } from "react-router-dom";

const GoodsInspection = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const location = useLocation();
  const processNo = location?.state?.processNo || null;

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    gprnNo: processNo || "",
    materialDtlList: []
  });

  const handleChange = (fieldName, value) => {
    if(typeof fieldName === 'string')
      setFormData(prev => ({...prev, [fieldName]: value}))
    else{
      setFormData(prev => {
        const prevMaterialDtlList = [...prev.materialDtlList];
        if(fieldName[2] === "acceptedQuantity"){
          const acceptedQuantity = parseFloat(value);
          const rejectedQuantity = parseFloat(prevMaterialDtlList[fieldName[1]].receivedQuantity) - acceptedQuantity;

          if(rejectedQuantity + acceptedQuantity !== parseFloat(prevMaterialDtlList[fieldName[1]].receivedQuantity)){
            message.error("Total accepted quantity must be equal to received quantity.");
            prevMaterialDtlList[fieldName[1]].acceptedQuantity = 0;
            prevMaterialDtlList[fieldName[1]].rejectedQuantity = 0;
            prevMaterialDtlList[fieldName[1]].rejectReason = '';
            return {...prev, materialDtlList: prevMaterialDtlList};
          }
          
          prevMaterialDtlList[fieldName[1]].rejectedQuantity = rejectedQuantity;
          prevMaterialDtlList[fieldName[1]].acceptedQuantity = acceptedQuantity;
          
          // Clear rejection reason if rejected quantity is 0
          if (rejectedQuantity <= 0) {
            prevMaterialDtlList[fieldName[1]].rejectReason = '';
          }
          
          return {...prev, materialDtlList: prevMaterialDtlList};
        }
        prevMaterialDtlList[fieldName[1]][fieldName[2]] = value;
        return {...prev, materialDtlList: prevMaterialDtlList}  
      })
    }
  }

  console.log("Form: ", formData)

  const handleSearch = useCallback(async () => {
    try {
      console.log("FROMDATA: ", formData)
      const {data} = await axios.get(`/api/process-controller/getSubProcessDtls?processStage=GPRN&processNo=${formData?.gprnNo}`);
      setFormData({...data?.responseData, gprnNo: data.responseData?.processId});
    } catch(error) {
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }, [formData.gprnNo])

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


  const generalDtls = [
    {
        heading: "Order Details", // optional
        colCnt: 5, // optional
        fieldList: [
            {
                name: "gprnNo", // required
                label: "GPRN No", // optional
                type:"search", // required
                disabled: true, //optional
                required: true, // option
                span: 2
            },{
              name: "poId",
              label: "PO Id.",
              type: "text",
              disabled: true,
              
              // required: true
          },
            {
                name: "giNo",
                label: "Gi No.",
                type: "text",
                disabled: true,
                span: 2
                // required: true
            },
            {
                name: "date",
                label: "Date",
                type: "date",
                required: true
            },
            {
                name: "installationDate",
                label: "Installation Date",
                type: "date",
                required: true
            },
            {
                name: "commissioningDate",
                label: "Commission Date",
                type: "date",
                required: true
            },
            // {
            //     name: "project",
            //     label: "Project",
            //     type: "text",
            //     required: true,
            //     span: 2 // optional
            // }

        ]
    },
    {
        heading: "Vendor Details",
        colCnt: 10,
        fieldList: [
            {
                name: "vendorId",
                label: "Vendor ID",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "vendorEmail",
                label: "Vendor Email",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "vendorContact",
                label: "Vendor Contact",
                type: "text",
                span: 2,
                required: true
            }
        ]
    },
    {
        heading: "Delivery & Invoice Details",
        colCnt: 5,
        fieldList: [
            {
                name: "challanNo",
                label: "Challan/Invoice No.",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "deliveryDate",
                label: "Delivery Date",
                type: "date",
                required: true,
                span: 1
            },
            {
                name: "supplyExpectedDate",
                label: "Date of Supply",
                type: "date",
                required: true,
                span: 1
            },
            {
                name: "fieldStation",
                label: "Field Station",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "indentorName",
                label: "Indentor Name",
                type: "text",
                required: true,
                span: 2
            },
        ]
    },
    {
        heading: "Material Details",
        name: "materialDtlList",
        colCnt: 8,
        children: [
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
                span: 3,
                required: true
            },
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 1,
                required: true
            },

            // {
            //     name: "warranty",
            //     label: "Warranty",
            //     type: "text",
            //     span: 2,
            //     required: true
            // },
            // {
            //     name: "orderedQuantity",
            //     label: "Ordered Quantity",
            //     type: "text",
            //     required: true
            // },
            // {
            //     name: "quantityDelivered",
            //     label: "Quantity Delivered",
            //     type: "text",
            //     required: true
            // },
            {
                name: "receivedQuantity",
                label: "Received Quantity",
                type: "text",
                disabled: true,
                required: true
            },
            {
                name: "acceptedQuantity",
                label: "Accepted Quantity",
                type: "text",
                required: true
            },
            {
                name: "rejectedQuantity",
                label: "Rejected Quantity",
                type: "text",
                disabled: true,
                required: true
            },
            {
              name: "rejectReason",
              label: "Reason for Rejection",
              type: "text",
              span: 4,
            },
            {
                name: "installationRepostBase64",
                label: "Installation Report",
                type: "image",
                span: 3,
                required: true,
                accept: "image/*"
            },
            // {
            //     name: "unitPrice",
            //     label: "Unit Price",
            //     type: "text",
            //     required: true
            // },
            // {
            //     name: "makeNo",
            //     label: "Make No.",
            //     type: "text",
            //     span: 2,
            //     required: true
            // },
            // {
            //     name: "modelNo",
            //     label: "Model No.",
            //     type: "text",
            //     span: 2,
            //     required: true
            // },
            // {
            //     name: "serialNo",
            //     label: "Serial No.",
            //     type: "text",
            //     span: 2,
            //     required: true
            // },
            // {
            //     name: "note",
            //     label: "Note",
            //     type: "text",
            //     span: 5,
            //     required: true
            // },
            // {
            //     name: "photographPath",
            //     label: "Photograph",
            //     type: "text",
            //     required: true
            // }
        ]
    },
    {
        heading: "Consignee & Warranty Information",
        colCnt: 3,
        fieldList: [
            {
                name: "consigneeDetail",
                label: "Consignee Details",
                type: "text",
                required: true,
                span: 2
            },
            // {
            //     name: "warrantyYears",
            //     label: "Warranty Years",
            //     type: "text",
            //     required: true
            // }
        ]
    },
    // {
    //     heading: "Quantity & Acceptance Details",
    //     colCnt: 4,
    //     fieldList: [
    //         {
    //             name: "receivedQty",
    //             label: "Received Quantity",
    //             type: "text",
    //             required: true
    //         },
    //         {
    //             name: "pendingQty",
    //             label: "Pending Quantity",
    //             type: "text",
    //             required: true
    //         },
    //         {
    //             name: "acceptedQty",
    //             label: "Accepted Quantity",
    //             type: "text",
    //             required: true
    //         },
    //         {
    //             name: "receivedBy",
    //             label: "Received By",
    //             type: "text",
    //             required: true
    //         }
    //     ]
    // },
    // {
    //     heading: "Goods Installation Details",
    //     colCnt: 4,
    //     fieldList: [
    //         {
    //             name: "goodsInpectionNo", // required
    //             label: "Goods Inpection No", // optional
    //             type:"text", // required
    //             disabled: true, //optional
    //             required: true // option
    //         },
    //         {
    //             name: "installationDate",
    //             label: "Installation Date",
    //             type: "date",
    //             required: true
    //         },
    //         {
    //             name: "commissioningDate",
    //             label: "Commissioning Date",
    //             type: "date",
    //             required: true
    //         },
            // {
            //     name: "uploadInstallationReport",
            //     label: "Upload Installation Report",
            //     type: "text",
            // }
        // ]
    // },
    // {
    //     heading: "Quantity Details",
    //     colCnt: 4,
    //     fieldList: [
    //         {
    //             name: "acceptedQuantity",
    //             label: "Accepted Quantity",
    //             type: "text",
    //             required: true
    //         },
    //         {
    //             name: "rejectedQuantity",
    //             label: "Rejected Quantity",
    //             type: "text",
    //             required: true
    //         }
    //     ]
    // },
    // {
    //     heading: "Return Details",
    //     colCnt: 4,
    //     fieldList:[
    //         {
    //             name: "goodsReturn",
    //             label: "Goods Return",
    //             type: "text",
    //             required: true,
    //             span: 2
    //         }
    //     ]
    // }
]

  useEffect(() => {
    const draft = localStorage.getItem("goodsInspectionDraft");
    if(draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);

  useEffect(() => {
    if(processNo) {
      // setFormData({gprnNo: processNo})
      handleSearch();
    }
  }, [processNo, handleSearch])


console.log("Foprmdata: ", formData)
  


  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Goods Inspection" />
      <CustomForm formData={formData} onFinish={onFinish}>
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
