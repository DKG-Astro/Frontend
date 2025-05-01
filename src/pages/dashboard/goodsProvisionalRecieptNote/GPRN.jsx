import { Card, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/DKG_Heading'
import CustomForm from '../../../components/DKG_CustomForm';
import { renderFormFields } from '../../../utils/CommonFunctions';
import ButtonContainer from '../../../components/ButtonContainer';
import { useReactToPrint } from 'react-to-print';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomModal from '../../../components/CustomModal';
import dayjs from 'dayjs';

const GPRN = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [fsDd, setFsDd] = useState([])

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: dayjs().format('DD/MM/YYYY'),
    deliveryDate: dayjs().format('DD/MM/YYYY'),
    supplyExpectedDate: dayjs().format('DD/MM/YYYY'),
  });

  const handleChange = (fieldName, value) => {
    if (typeof fieldName === 'string') {

      if (fieldName === "poId") {
        setFormData(prev => ({ ...prev, poId: value }))
        handleSearch(value)
        return;
      }
      setFormData(prev => ({ ...prev, [fieldName]: value }))
    }
    else {
      setFormData(prev => {
        const prevMaterialDtlList = prev.materialDtlList
        prevMaterialDtlList[fieldName[1]][fieldName[2]] = value

        // Calculate total amount when receivedQuantity changes
        if (fieldName[2] === 'receivedQuantity') {
          const unitPrice = parseFloat(prevMaterialDtlList[fieldName[1]].unitPrice || 0);
          const quantity = parseFloat(value || 0);
          prevMaterialDtlList[fieldName[1]].totalAmount = (unitPrice * quantity).toFixed(2);
        }

        return { ...prev, materialDtlList: prevMaterialDtlList }
      })
    }
  }

  const { userId, locationId } = useSelector(state => state.auth)

  const onFinish = async () => {
    const payload = { ...formData, locationId, createdBy: userId }

    try {
      setSubmitBtnLoading(true)
      const { data } = await axios.post("/api/process-controller/saveGprn", payload)

      setFormData({
        ...formData,
        gprnNo: data?.responseData?.processNo
      })

      localStorage.removeItem("gprnDraft")
      setModalOpen(true)

    }
    catch (error) {
      message.error(error?.response?.data?.responseStatus?.message || "Failed to save GPRN.");
      console.log("Error: ", error?.response?.data?.responseStatus?.message);
    }
    finally {
      setSubmitBtnLoading(false)
    }
  }

  const handleSearch = async (value) => {
    try {
      const { data } = await axios.get(`api/purchase-orders/${value ? value : formData.poId}`)

      const { data: vendorData } = await axios.get(`/api/vendor-master/${data?.responseData?.vendorId}`)
      const { data: indentData } = await axios.get(`/api/indents/${data?.responseData?.indentIds[0]}`)

      setFormData({
        poId: data?.responseData?.poId,
        vendorId: data?.responseData?.vendorId,
        vendorName: vendorData?.responseData?.vendorName,
        vendorEmail: vendorData?.responseData?.emailAddress,
        vendorContactNo: vendorData?.responseData?.contactNo,
        project: data?.responseData?.projectName || "N/A",
        indentorName: indentData?.responseData?.indentorName,
        consigneeDetail: data?.responseData?.consignesAddress,
        materialDtlList: data?.responseData?.purchaseOrderAttributes?.map((mat, idx) => ({ ...mat, materialDesc: mat.materialDescription, uomId: mat.uom, orderedQuantity: mat.quantity })),
        date: dayjs().format('DD/MM/YYYY'),
        deliveryDate: dayjs().format('DD/MM/YYYY'),
        supplyExpectedDate: dayjs().format('DD/MM/YYYY'),
      })
    }
    catch (error) {
      console.log("ERROR: ", error)
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }

  useEffect(() => {
    const gprnDraft = localStorage.getItem("gprnDraft");
    if (gprnDraft) {
      setFormData(JSON.parse(gprnDraft))
      message.success("Form loaded from draft.")
    }
  }, [])

  const [pendingGprnList, setPendingGprnList] = useState([])

  const [userDd, setUserDd] = useState([]);

  const populatePendingGprn = async () => {
    try {
      const [gprnResponse, locationResponse, userResponse] = await Promise.all([
        axios.get("/api/process-controller/getPendingGprn"),
        axios.get("/api/location-master"),
        axios.get("/api/userMaster")
      ]);

      const formattedList = (gprnResponse.data?.responseData?.pendingGprnList || []).map(item => ({
        label: item,
        value: item
      }));

      const formattedLocations = (locationResponse.data?.responseData || []).map(location => ({
        label: location.locationName,
        value: location.locationCode
      }));

      const formattedUsers = (userResponse.data?.responseData || []).map(user => ({
        label: user.userName,
        value: user.userId
      }));

      setPendingGprnList(formattedList);
      setFsDd(formattedLocations);
      setUserDd(formattedUsers);
    }
    catch (error) {
      console.log("ERROR: ", error)
      message.error(error?.response?.data?.responseStatus?.message || "Error fetching data.");
    }
  }

  useEffect(() => {
    populatePendingGprn();
  }, [])

  const generalDtls = [
    {
      heading: "Purchase & Order Details", // optional
      colCnt: 5, // optional
      fieldList: [
        {
          name: "poId",
          label: "PO No.",
          type: "select",
          options: pendingGprnList,
        },
        {
          name: "gprnNo", // required
          label: "GPRN No", // optional
          type: "text", // required
          disabled: true, //optional
        },
        {
          name: "date",
          label: "Date",
          type: "date",
          required: true
        },
        {
          name: "project",
          label: "Project",
          type: "text",
          required: true,
          span: 2 // optional
        }

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
          name: "vendorContactNo",
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
          type: "select",
          options: fsDd,
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
          required: true,
          // disabled: true
        },
        {
          name: "materialDesc",
          label: "Description",
          type: "text",
          span: 3,
          required: true
        },
        {
          name: "uomId",
          label: "UOM",
          type: "text",
          span: 1,
          required: true,
          // disabled: true
        },
        {
          name: "warranty",
          label: "Warranty",
          type: "text",
          span: 2,
          required: true
        },
        {
          name: "orderedQuantity",
          label: "Ordered Quantity",
          type: "text",
          required: true,
          // disabled: true
        },
        {
          name: "quantityDelivered",
          label: "Quantity Delivered",
          type: "text",
          required: true
        },
        {
          name: "receivedQuantity",
          label: "Received Quantity",
          type: "text",
          required: true
        },
        {
          name: "unitPrice",
          label: "Unit Price",
          type: "text",
          required: true,
          disabled: true
        },
        {
          name: "totalAmount",
          label: "Total Amount",
          type: "text",
          required: true,
          disabled: true,
        },
        {
          name: "makeNo",
          label: "Make No.",
          type: "text",
          span: 2,
          required: true,
          // disabled: true
        },
        {
          name: "modelNo",
          label: "Model No.",
          type: "text",
          span: 2,
          required: true,
          // disabled: true
        },
        {
          name: "serialNo",
          label: "Serial No.",
          type: "text",
          span: 2,
          required: true,
          // disabled: true
        },
        {
          name: "category",
          label: "Category",
          type: "text",
          required: true,

        },
        {
          name: "note",
          label: "Note",
          type: "text",
          span: 5,
          // required: true,
        },
        {
          name: "imageBase64",
          label: "Material Photographs",
          type: "multiImage",  // changed from "image" to "multiImage"
          span: 3,
          required: true,
          accept: "image/*",
          multiple: true  // added multiple property
        }
      ]
    },
    {
      heading: "Consignee & Warranty Information",
      colCnt: 3,
      fieldList: [
        {
          name: "consigneeDetail",
          label: "Consignee Details",
          type: "select",
          options: fsDd,
          required: true,
          span: 2
        },
        {
          name: "warrantyYears",
          label: "Warranty Years",
          type: "text",
          required: true
        },
        {
          name: "warranty",
          label: "Warranty",
          type: "text",
          span: 3
        }
      ]
    },
    {
      heading: "Acceptance Details",
      colCnt: 4,
      fieldList: [
        {
          name: "receivedBy",
          label: "Received By",
          type: "select",
          options: userDd,
          required: true
        }
      ]
    }
  ]

  return (
    <Card className='a4-container' ref={printRef}>
      <Heading title="Goods Provisional Receipt Note" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(generalDtls, handleChange, formData, "", null, setFormData, handleSearch)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="gprnDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="GPRN" processNo={formData?.gprnNo} />
    </Card>
  )
}

export default GPRN
