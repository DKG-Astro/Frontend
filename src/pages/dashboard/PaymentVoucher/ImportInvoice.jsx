import { Card, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";

const ImportInvoice = () => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [poList, setPoList] = useState([]);

  const [formData, setFormData] = useState({
    poId: "",
    vendorName: "",
    vendorId: "",
    poValue: "",
    indentorName: "",
    supplierAddress: "",
    currency: "",
    materialDtlList: [],
    transactionMode: "",
    debitAccountNo: "",
    accountTitle: "",
    foreignBankName: "",
    foreignBankAddress: "",
    branchName: "",
    iban: "",
    swiftCode: "",
    sortCode: "",
    remarks: "",
  });

  const { userId } = useSelector((state) => state.auth);

  const fetchPoIds = async () => {
    try {
      const { data } = await axios.get("/api/purchase-orders/import-po-ids");
      setPoList(data?.responseData || []);
    } catch (error) {
      message.error("Failed to load PO IDs");
    }
  };


  const handlePoSelect = async (poId) => {
    if (!poId) return;
    try {
      const { data } = await axios.get(`/api/purchase-orders/PoImportOrderdetails/${poId}`);

      const po = data?.responseData;
      setFormData((prev) => ({
        ...prev,
        poId: po.poId,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        poValue: po.poValue,
        supplierAddress: po.vendorAddress,
        indentorName: po.indentorName,
        materialDtlList: po.materials,
      }));
    } catch (err) {
      message.error("Failed to fetch PO details");
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

 
  const onFinish = async () => {
    try {
      setSubmitBtnLoading(true);
      const payload = { ...formData, createdBy: userId };

      const { data } = await axios.post(
        "/api/import-payment/saveVoucher",
        payload
      );

      message.success("Import Payment Voucher Saved Successfully!");

      setModalOpen(true);
    } catch (error) {
      message.error("Failed to save payment voucher");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  const formConfig = [
    {
      heading: "Import Order Details",
      colCnt: 5,
      fieldList: [
         {
                name: "importPaymentType",
                label: "Payment Type",
                type: "select",
                required: true,
                 span: 2,
                options: [
                    {
                        value: "Purchase Order",
                        label: "Purchase Order"
                    },
                    {
                        value: "Service Order",
                        label: "Service Order"
                    }
                ],
            },
        
       {
  name: "poId",
  label: "Select PO ID",
  type: "select",
  required: true,
  options: poList.map((po) => ({ label: po, value: po })),
  span: 2,
  props: {
    onChange: (val) => {
      handleChange("poId", val);
      handlePoSelect(val);   
    }
  }
}
,
        {
          name: "vendorName",
          label: "Supplier Name",
          type: "text",
          disabled: true,
          span: 2,
        },
        {
          name: "vendorId",
          label: "Vendor ID",
          type: "text",
          disabled: true,
          span: 1,
        },
        {
          name: "supplierAddress",
          label: "Supplier Address",
          type: "text",
          disabled: true,
          span: 5,
        },
        {
          name: "poValue",
          label: "PO Value",
          type: "text",
          disabled: true,
        },
         ...(formData.currency !== "INR"
  ? [
      {
        name: "exchangeRate",
        label: "Exchange Rate",
        type: "text",
      }
    ]
  : []),
      ],
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
          disabled: true,
          span: 2,
        },
        {
          name: "materialDescription",
          label: "Description",
          type: "text",
          disabled: true,
          span: 2,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "text",
          disabled: true,
        },
        {
          name: "rate",
          label: "Unit Price",
          type: "text",
          disabled: true,
        },
        {
          name: "currency",
          label: "Currency",
          type: "text",
          disabled: true,
        },
      ],
    },

    {
      heading: "Bank & Transaction Details",
      colCnt: 4,
      fieldList: [
        {
          name: "transactionMode",
          label: "Mode of Transaction",
          type: "select",
          required: true,
          options: [
            { label: "Wire Transfer", value: "WIRE" },
            { label: "Letter of Credit", value: "LC" },
            { label: "Others", value: "OTHER" },
          ],
          span: 2,
        },
        {
          name: "debitAccountNo",
          label: "Debit Account Number",
          type: "text",
          required: true,
        },
        {
          name: "accountTitle",
          label: "Account Title",
          type: "text",
          required: true,
        },
        {
          name: "foreignBankName",
          label: "Foreign Bank Name",
          type: "text",
          required: true,
        },
        {
          name: "foreignBankAddress",
          label: "Foreign Bank Address",
          type: "text",
          required: true,
          span: 2,
        },
        {
          name: "branchName",
          label: "Branch Name",
          type: "text",
          required: true,
        },
        {
          name: "iban",
          label: "IBAN / Account No.",
          type: "text",
          required: true,
        },
        {
          name: "swiftCode",
          label: "Swift Code / BIC",
          type: "text",
          required: true,
        },
        {
          name: "sortCode",
          label: "Sort Code",
          type: "text",
          required: false,
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "text",
          span: 4,
        },
      ],
    },
  ];

  useEffect(() => {
    fetchPoIds();
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Import Invoice Processing" />

      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(formConfig, handleChange, formData)}
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftBtnEnabled
          submitBtnEnabled
          printBtnEnabled
          submitBtnLoading={submitBtnLoading}
          handlePrint={handlePrint}
          draftDataName="importPaymentDraft"
        />
      </CustomForm>

      <CustomModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Import Payment Voucher Created"
        processNo={formData?.poId}
      />
    </Card>
  );
};

export default ImportInvoice;
