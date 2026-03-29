import { Card, message, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { invoiceFields } from "./InvoiceFields";
import ButtonContainer from "../../../components/ButtonContainer";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";


const extractPoFromGrn = (grn) => {
  if (!grn) return null;
  const match = grn.match(/^INV(\d+)\//);
  return match ? `PO${match[1]}` : null;
};

const Invoice = () => {
const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [grnIds, setGrnIds] = useState([]);
  const [selectedPoId, setSelectedPoId] = useState(""); // Purchase Order ID
  const [selectedSoId, setSelectedSoId] = useState("");
  //const [selectedGrnId, setSelectedGrnId] = useState("");

const [selectedGrnIds, setSelectedGrnIds] = useState([]);

const [pvPoOptions, setPvPoOptions] = useState([]);
const [pvIds, setPvIds] = useState([]);


  const [formData, setFormData] = useState({
    grnNo: "",
    materialDtlList: [],
    grnType: "GRN",
    processId: "" ,
    advanceAdjustedAmount: 0,
    
  });
  const [poOptions, setPoOptions] = useState([]);
  const [soOptions, setSoOptions] = useState([]);
  const userId = useSelector(state => state.auth.userId);
  const [advancePoOptions, setAdvancePoOptions] = useState([]);


useEffect(() => {
  const fetchPvPoIds = async () => {
    try {
      const { data } = await axios.get("/api/process-controller/paymentVoucherPoIds");

      const list = data?.responseData || [];

      setPvPoOptions(list.map(po => ({
        value: po,
        label: po
      })));
    } catch (e) {
      message.error("Failed to load PV PO IDs");
    }
  };

  fetchPvPoIds();
}, []);


const fetchPvIds = async (poId) => {
  try {
    const { data } = await axios.get(
      `/api/process-controller/paymentVoucherIdsByPo?poId=${poId}`
    );

    const list = data?.responseData || [];

    setPvIds(list.map(id => ({
      value: id,
      label: id
    })));

  } catch (e) {
    message.error("Failed to fetch PV IDs");
  }
};
// ================== FIXED FETCH PV DATA ==================
const fetchPvData = async (pvId) => {
  try {
    const { data } = await axios.get(
      `/api/process-controller/VoucherData?processNo=${encodeURIComponent(pvId)}`
    );

    const res = data?.responseData;

    if (res) {
      setFormData(prev => ({
        ...prev,

        // ================== BASIC ==================
        paymentVoucherIsFor: res.paymentVoucherIsFor,
        purchaseOrderids: res.purchaseOrderId, 
        paymentVoucherType: res.paymentVoucherType,

        // ================== VENDOR ==================
        vendorName: res.vendorName,
        vendorInvoiceNumber: res.vendorInvoiceNumber,
        vendorInvoiceDate: res.vendorInvoiceDate,

        // ================== MONEY ==================
        totalAmount: res.totalAmount,
        partialAmount: res.partialAmount,
        advanceAmount: res.advanceAmount,
        advanceAdjustedAmount: res.advanceAdjustedAmount || 0,

        paymentVoucherNetAmount: res.paymentVoucherNetAmount,
        tdsAmount: res.tdsAmount,

        // ================== TDS ==================
        incomeTdsAmount: res.incomeTdsAmount,
        gstTdsAmount: res.gstTdsAmount,
        incomeTdsRemarks: res.incomeTdsRemarks,
        gstTdsRemarks: res.gstTdsRemarks,

        // ================== CURRENCY ==================
        currency: res.currency,
        exchangeRate: res.exchangeRate,

        // ================== OTHER ==================
        remarks: res.remarks,
        // ================== PAYMENT SUMMARY FIX ==================
totalPoAmount: res.totalAmount || 0,

advanceAmountAlreadyPaid: res.advanceAmount || 0,

// DO NOT USE paidAmount directly
partialAmountAlreadyPaid: 0,

currentPaymentAmount: res.partialAmount || 0,

balanceAmount: (
  (res.totalAmount || 0)
  - (res.partialAmount || 0)
).toFixed(2),
// ================== END ==================

        // ================== MATERIAL ==================
        materialDtlList: res.materials?.map(mat => ({
          grnNum: mat.grnNumber,
          materialCode: mat.materialCode,
          materialDescription: mat.materialDescription,
          quantity: mat.quantity,
          rate: mat.unitPrice,  
          currency: mat.currency,
          exchangeRate: mat.exchangeRate,
          gst: mat.gst,
          amount: mat.amount
        })) || [],

       
        attachments: res.attachments || []
      }));
    }

  } catch (e) {
    message.error("Failed to load voucher data");
  }
};

  useEffect(() => {
 /* const fetchPoIds = async () => {
    try {
      const { data } = await axios.get("/api/process-controller/approvedGrnPoIds");
      const ids = data?.responseData || [];

     
     // const options = ids.map(id => ({ value: id, label: id }));
     const options = ids.map(id => ({ value: id, label: `PO${id}` }));
      setPoOptions(options);
    } catch (error) {
      message.error("Failed to fetch Purchase Order IDs");
    }
  };*/
  const fetchPoIds = async () => {
  try {
    const { data } = await axios.get("/api/process-controller/approvedGrnPoIds");
    const poList = data?.responseData || [];

   const options = poList.map(item => ({
  value: item.poId,
  label: item.poId,
  searchText: (
    item.poId +
    " " +
    item.vendorName +
    " " +
    (item.projectName || "") +
    " " +
    item.createdDate +
    " " +
    item.materialDescriptions.join(" ")
  ).toLowerCase()
}));


    setPoOptions(options);

  } catch (error) {
    message.error("Failed to fetch Purchase Order IDs");
  }
};

  fetchPoIds();
}, []);
 useEffect(() => {
  const fetchSoIds = async () => {
    try {
      const { data } = await axios.get("/api/process-controller/approvedSoIds");
      const ids = data?.responseData || [];

     
      const options = ids.map(id => ({ value: id, label: id }));
      setSoOptions(options);
    } catch (error) {
      message.error("Failed to fetch Purchase Order IDs");
    }
  };

  fetchSoIds();
}, []);
  useEffect(() => {
  const draft = localStorage.getItem("grnDraft");
  if (draft) {
    setFormData(JSON.parse(draft));
    message.success("Form loaded from draft.");
  } else {
    setFormData(prev => ({
      ...prev,
      poDtlList: [{}],         
      vendorDtlList: [{}],     
      materialDtlList: [{}]    
    }));
  }
}, []);
const fetchGrnIds = async (poId) => {
  try {
    const response = await axios.get(`/api/process-controller/paymentVoucherGrnId?grnProcessId=${poId}`);
     const ids = response.data?.responseData || [];
    
    
    setGrnIds(ids.map(id => ({ value: id, label: id })));
  } catch (err) {
    console.error("Error fetching GRN IDs", err);
  }
};
useEffect(() => {
  if (selectedPoId) {
    fetchGrnIds(selectedPoId);
  }
}, [selectedPoId]);
const fetchServiceOrderData = async (soId) => {
  try {
    const { data } = await axios.get(`/api/process-controller/paymentVoucherSOData?processNo=${soId}`);
    const res = data?.responseData;

    if (res) {
      setFormData(prev => ({
        ...prev,
        vendorName: res.vendorName,
        vendorInvoiceNumber: res.vendorInvoiceName,
        vendorInvoiceDate: res.vendorInvoiceDate,
        currency: res.materialsList?.[0]?.currency || "INR",
        exchangeRate: res.materialsList?.[0]?.exchangeRate || 0,
        totalAmount: res.totalAmount,
        paymentVoucherType: res.paymentVoucherType  || formData.paymentVoucherType || "" ,
        partialAmount: res.partialAmountAlreadypaid || null,
        partialBalanceAmount: res.partialBalanceAmount || null,
        advanceAmount: res.advanceAmountAlreadyPaid || null,
        advanceBalanceAmount: res.advanceBalanceAmount || null,
        materialDtlList: res.materialsList?.map(mat => ({
          materialCode: mat.materialCode,
          materialDescription: mat.materialDescription,
          quantity: mat.quantity,
          rate: mat.unitPrice,
          currency: mat.currency,
          exchangeRate: mat.exchangeRate,
          gst: mat.gst,
          amount: mat.amount,
        })) || []
      }));
    }
  } catch (error) {
    message.error("Failed to fetch Service Order data");
    console.error(error);
  }
};

useEffect(() => {
  const fetchAdvancePoIds = async () => {
    try {
      const { data } = await axios.get("/api/process-controller/approvedPoIdswithoutGrn");
      const list = data?.responseData || [];

      const options = list.map(item => ({
        value: item.poId,
        label: item.poId,
        searchText: (
          item.poId +
          " " +
          item.vendorName +
          " " +
          (item.projectName || "") +
          " " +
          item.createdDate +
          " " +
          item.materialDescriptions.join(" ")
        ).toLowerCase()
      }));

      setAdvancePoOptions(options);
    } catch (e) {
      message.error("Failed to fetch PO IDs for Advance");
    }
  };

  fetchAdvancePoIds();
}, []);

const fetchAdvancePaymentVoucherData = async (poId) => {
  try {
    const { data } = await axios.get(
      `/api/process-controller/paymentVoucherPoDataForAdvance?processNo=${poId}`
    );

    const res = data?.responseData;

    if (res) {
      setFormData(prev => ({
        ...prev,
        vendorName: res.vendorName,
        vendorInvoiceNumber: res.vendorInvoiceName,
        vendorInvoiceDate: res.vendorInvoiceDate,
        totalAmount: res.totalAmount,
        paymentVoucherType: "Advance",
        advanceAmountAlreadyPaid: res.advanceAmountAlreadyPaid || 0,
        advanceBalanceAmount: res.advanceBalanceAmount || res.totalAmount,
        currency: res.materialsList?.[0]?.currency || "INR",
        exchangeRate: res.materialsList?.[0]?.exchangeRate || 0,

        materialDtlList: res.materialsList.map(mat => ({
          materialCode: mat.materialCode,
          materialDescription: mat.materialDescription,
          quantity: mat.quantity,
          rate: mat.unitPrice,
          currency: mat.currency,
          exchangeRate: mat.exchangeRate,
          gst: mat.gst,
          amount: mat.amount
        }))
      }));
    }
  } catch (err) {
    message.error("Failed to load Advance payment voucher data");
  }
};

const fetchPaymentVoucherData = async (grnNumber) => {
  try {
    const { data } = await axios.get(`/api/process-controller/multipleGrnsPaymentVoucherData?processNo=${grnNumber}`);
    const res = data?.responseData;

    if (res) {
       let partialPaid = res.partialAmountAlreadypaid || 0;
      let advancePaid = res.advanceAmountAlreadyPaid || 0;

      // First-time partial or advance
      if (res.paymentVoucherType === "Partial" && partialPaid === 0) {
        partialPaid = 0;
      }
      if (res.paymentVoucherType === "Advance" && advancePaid === 0) {
        advancePaid = 0;
      }
      setFormData(prev => ({
        ...prev,
        vendorName: res.vendorName,
        vendorInvoiceNumber: res.vendorInvoiceName,
        vendorInvoiceDate: res.vendorInvoiceDate,
        currency: res.materialsList?.[0]?.currency || "INR",
        exchangeRate: res.materialsList?.[0]?.exchangeRate || 0,
        totalAmount: res.totalAmount,
        paymentVoucherType: res.paymentVoucherType ,
       // partialAmount: res.partialAmountAlreadypaid || null, 
        partialAmountAlreadyPaid: res.partialAmountAlreadypaid || null,
        partialBalanceAmount: res.partialBalanceAmount || null,
       // advanceAmount: res.advanceAmountAlreadyPaid || null,
       advanceAmountAlreadyPaid: res.advanceAmountAlreadyPaid || 0,
       advanceAdjustedAmount: res.advanceAdjustedAmount || null,   

        //advanceBalanceAmount: res.advanceBalanceAmount || 0,
        advanceBalanceAmount: res.advanceBalanceAmount || null,
        materialDtlList: res.materialsList?.map(mat => ({
          grnNum: mat.grnNumber,
          materialCode: mat.materialCode,
          materialDescription: mat.materialDescription,
          quantity: mat.quantity,
          rate: mat.unitPrice,
          currency: mat.currency,
          exchangeRate: mat.exchangeRate,
          gst: mat.gst,
          amount: mat.amount,
        })) || []
      }));
    
    }
  } catch (error) {
   //  message.error();
   // message.error("Failed to fetch Payment Voucher Data");
    console.error(error);
  }
};

  useEffect(() => {
    if (selectedGrnIds) {
      fetchPaymentVoucherData(selectedGrnIds);
    }
  }, [selectedGrnIds]);



  const handleChange = (fieldName, value) => {
    
if (fieldName === "pvPoId") {
  fetchPvIds(value);
}


if (fieldName === "pvId") {
  fetchPvData(value);
}

 
  if (typeof fieldName === "string") {
    setFormData(prev => {
      let updated = { ...prev, [fieldName]: value };

      let baseAmount = 0;

      //  Reset dependent fields on voucher type change
      if (fieldName === "paymentVoucherType") {
        if (value === "Advance") {
          updated.grnNumber = "";
          updated.partialAmount = null;
          updated.partialBalanceAmount = null;
        }

        if (value !== "Partial") {
          updated.partialAmount = null;
        }

        if (value !== "Advance") {
          updated.advanceAmount = null;
          updated.advanceBalanceAmount = null;
        }
      }

      //  Decide base amount
      if (updated.paymentVoucherType === "Partial") {
        baseAmount = parseFloat(updated.partialAmount || 0);
      }
      else if (updated.paymentVoucherType === "Advance") {
        baseAmount = parseFloat(updated.advanceAmount || 0);
      }
      else if (updated.paymentVoucherType === "Full Payment") {
        const total = parseFloat(updated.partialBalanceAmount || 0);
       // const alreadyPaid = parseFloat(updated.partialAmountAlreadyPaid || 0);
        const advanceAdjusted = parseFloat(updated.advanceAdjustedAmount || 0);

        baseAmount = total  - advanceAdjusted;
        //baseAmount = total - alreadyPaid;
         if (baseAmount <= 0) {
          baseAmount = 0;           
          updated.advanceAdjustedAmount = 0;
        }
      }
      else {
        baseAmount = parseFloat(updated.totalAmount || 0);
      }

      //  TDS calculation 
      const tdsPerc = parseFloat(updated.tdsPercentage || 0);
      const tdsAmount = (baseAmount * tdsPerc) / 100;

    //  updated.tdsAmount = tdsAmount.toFixed(2);
     // updated.paymentVoucherNetAmount = (baseAmount - tdsAmount).toFixed(2);
     // ==================  MULTIPLE TDS CALCULATION ==================

// Income Tax TDS
const incomeTdsPerc = parseFloat(updated.incomeTdsPercentage || 0);
const incomeTdsAmount = (baseAmount * incomeTdsPerc) / 100;

// GST TDS
const gstTdsPerc = parseFloat(updated.gstTdsPercentage || 0);
const gstTdsAmount = (baseAmount * gstTdsPerc) / 100;

// Total TDS
const totalTds = incomeTdsAmount + gstTdsAmount;

// Set values
updated.incomeTdsAmount = incomeTdsAmount.toFixed(2);
updated.gstTdsAmount = gstTdsAmount.toFixed(2);
updated.tdsAmount = totalTds.toFixed(2);

// Final Payable
updated.paymentVoucherNetAmount = (baseAmount - totalTds).toFixed(2);


// ================== PAYMENT SUMMARY FIX ==================
// ================== FINAL PAYMENT SUMMARY FIX ==================

const totalPo = parseFloat(updated.totalAmount || 0);
const advancePaid = parseFloat(updated.advanceAmountAlreadyPaid || 0);
const partialPaid = parseFloat(updated.partialAmountAlreadyPaid || 0);
const currentAdvance = parseFloat(updated.advanceAmount || 0);
const currentPartial = parseFloat(updated.partialAmount || 0);

let balance = 0;
let currentPayment = 0;

if (updated.paymentVoucherType === "Advance") {

 
  balance = totalPo - (advancePaid + currentAdvance);
  currentPayment = currentAdvance;

}
else if (updated.paymentVoucherType === "Partial") {

  balance = parseFloat(updated.partialBalanceAmount || totalPo);
  currentPayment = currentPartial;

}
else if (updated.paymentVoucherType === "Full Payment") {

  balance = totalPo - advancePaid - partialPaid;
  currentPayment = balance;

}

//  SET ONLY ONCE (IMPORTANT)
updated.totalPoAmount = totalPo;
updated.balanceAmount = balance.toFixed(2);
updated.currentPaymentAmount = currentPayment.toFixed(2);

// ================== END ==================
      return updated;
    });

    
    if (fieldName === "purchaseOrderids") {
      if (formData.paymentVoucherType === "Advance") {
        fetchAdvancePaymentVoucherData(value);
      } else {
        setSelectedPoId(value);
        setSelectedGrnIds([]);   
        setGrnIds([]);  
      }
    }

    // if (fieldName === "grnNumber") {
    //  setSelectedGrnIds(value);
    // }
    if (fieldName === "grnNumber") {
  const selected = Array.isArray(value) ? value : [value];

  const poSet = new Set(
    selected.map(grn => extractPoFromGrn(grn))
  );

  if (poSet.size > 1) {
    message.error("You cannot select GRNs from different Purchase Orders");
    return; // ❌ BLOCK
  }

  // Optional: ensure matches selected PO dropdown
  const selectedPo = poSet.values().next().value;
  if (selectedPoId && selectedPo !== selectedPoId) {
    message.error(`Selected GRNs belong to ${selectedPo}, not ${selectedPoId}`);
    return;
  }

  setSelectedGrnIds(selected);
}


    if (fieldName === "ServiceOrderDetails") {
      setSelectedSoId(value);
      fetchServiceOrderData(value);
    }

  }
  
  else {
    setFormData(prev => {
      const materialDtlList = [...prev.materialDtlList];
      materialDtlList[fieldName[1]] = {
        ...materialDtlList[fieldName[1]],
        [fieldName[2]]: value
      };
      return { ...prev, materialDtlList };
    });
  }
};


   const handleSearch = async (value) => {
    try {
      const { data } = await axios.get(
        `/api/purchase-orders/${value ? value : formData.poId}`
      );
      const responseData = data?.responseData || {};

      setFormData({
        ...responseData,
        materialDtlList: responseData?.purchaseOrderAttributes || [],
        poDtlList: responseData?.purchaseOrderDetails || [],
        vendorDtlList: responseData?.vendorDetails || [],
      });
    } catch (error) {
      ;
      message.error(
        error?.response?.data?.responseStatus?.message || "Error fetching data."
      );
    }
  };


  const { locationId } = useSelector(state => state.auth);
 
const paymentSummaryData = [
  {
    key: "1",
    totalPoAmount: formData.totalPoAmount || 0,
    advanceAmount: formData.advanceAmountAlreadyPaid || 0,
    alreadyPaid: formData.partialAmountAlreadyPaid || 0,
    balanceAmount: formData.balanceAmount || 0,
    currentPayment: formData.currentPaymentAmount || 0,
    totalPayable: formData.paymentVoucherNetAmount || 0
  }
];

const paymentSummaryColumns = [
  {
    title: "Total PO Amount",
    dataIndex: "totalPoAmount"
  },
  {
    title: "Advance Amount",
    dataIndex: "advanceAmount"
  },
  {
    title: "Already Paid",
    dataIndex: "alreadyPaid"
  },
  {
    title: "Balance Amount",
    dataIndex: "balanceAmount"
  },
  {
    title: "Current Payment",
    dataIndex: "currentPayment"
  },
  {
    title: "Total Payable",
    dataIndex: "totalPayable"
  }
];
const onFinish = async () => {
  try {
    const total = parseFloat(formData.totalAmount || 0);
    const partial = parseFloat(formData.partialAmount || 0);
    const advance = parseFloat(formData.advanceAmount || 0);

    
    if (partial > total) {
      message.error("Partial amount cannot exceed Total amount.");
      return;
    }
    if (advance > total) {
      message.error("Advance amount cannot exceed Total amount.");
      return;
    }
    setSubmitBtnLoading(true);

    // Prepare DTO in the same structure as backend expects
    const payload = {
    
      paymentVoucherDate: formData.paymentVoucherDate,
      paymentVoucherIsFor: formData.paymentVoucherIsFor,
      purchaseOrderId: formData.purchaseOrderids || "",
    //  advanceAdjustedAmount: formData.advanceAdjustedAmount,    
    attachments: formData.attachments || [],
advanceAdjustedAmount:
  formData.advanceAdjustedAmount === "" ||
  formData.advanceAdjustedAmount === null ||
  formData.advanceAdjustedAmount === undefined
    ? 0
    : Number(formData.advanceAdjustedAmount),

     // grnNumber: formData.grnNumber || "",
      grnNumbers: selectedGrnIds,
      serviceOrderDetails: formData.ServiceOrderDetails || "",
      paymentVoucherType: formData.paymentVoucherType,
      vendorName: formData.vendorName,
      vendorInvoiceNumber: formData.vendorInvoiceNumber,
      vendorInvoiceDate: formData.vendorInvoiceDate,
      currency: formData.currency,
      exchangeRate: formData.exchangeRate,
      status: formData.status,
      remarks: formData.remarks,
      partialAmount : formData.partialAmount,
      totalAmount: formData.totalAmount,
      advanceAmount: formData.advanceAmount,
      serviceOrderDetails: formData.ServiceOrderDetails,
      createdBy: userId,
      tdsAmount: formData.tdsAmount,
      paymentVoucherNetAmount: formData.paymentVoucherNetAmount,

incomeTdsAmount: formData.incomeTdsAmount || 0,
gstTdsAmount: formData.gstTdsAmount || 0,

incomeTdsPercentage: formData.incomeTdsPercentage || 0,
gstTdsPercentage: formData.gstTdsPercentage || 0,

incomeTdsRemarks: formData.incomeTdsRemarks || "",
gstTdsRemarks: formData.gstTdsRemarks || "",
      materials: formData.materialDtlList?.map(mat => ({
        grnNumber: mat.grnNum,
        materialCode: mat.materialCode,
        materialDescription: mat.materialDescription,
        quantity: mat.quantity,
        unitPrice: mat.rate,
        currency: mat.currency,
        exchangeRate: mat.exchangeRate,
        gst: mat.gst
      })) || []
    };

    // Call backend API
    const { data } = await axios.post("/api/process-controller/savePaymentVoucher", payload);

    message.success("Payment Voucher saved successfully!");
    console.log("Saved Data:", data);

    // Optionally clear form or show modal
    setFormData(prev => ({
      ...prev,
      processId: data?.responseData?.processNo || prev.processId,
      paymentVoucherNumber: data?.responseData?.paymentVoucherNumber || prev.paymentVoucherNumber
    }));

    setModalOpen(true);
    } catch (error) {

  let errorMessage = "Failed to save Payment Voucher.";

  if (error?.response?.data?.responseStatus?.message) {
    errorMessage = error.response.data.responseStatus.message;
  } else if (error?.message) {
    errorMessage = error.message;
  }

  message.error(errorMessage);
  console.error("Save Error:", error);

} finally {
  setSubmitBtnLoading(false);
}


  // } catch (error) {
  //   message.error(error?.response?.data?.responseStatus?.message || "Failed to save Payment Voucher.");
  //   console.error("Save Error:", error);
  // } finally {
  //   setSubmitBtnLoading(false);
  // }
};

  useEffect(() => {
    const draft = localStorage.getItem("grnDraft");
    if (draft) {
      setFormData(JSON.parse(draft));
      message.success("Form loaded from draft.");
    }
  }, []);
  console.log(grnIds);
  
const fields = invoiceFields(formData,pvPoOptions,pvIds, poOptions, grnIds, setSelectedPoId, soOptions, advancePoOptions);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Invoice" />
      <CustomForm formData={formData} onFinish={onFinish}>
        
        
        {/* {renderFormFields(invoiceFields(formData, poOptions, grnIds, setSelectedPoId, soOptions, advancePoOptions), handleChange, formData, "", null, setFormData, handleSearch)} */}
  {/**
{renderFormFields([fields[0]], handleChange, formData, "", null, setFormData, handleSearch)}


{renderFormFields(fields.slice(1), handleChange, formData, "", null, setFormData, handleSearch)}

<h3 style={{ marginTop: 20 }}>Payment Summary</h3>

<Table
  columns={paymentSummaryColumns}
  dataSource={paymentSummaryData}
  pagination={false}
  bordered
/>*/ }

{renderFormFields([fields[0]], handleChange, formData, "", null, setFormData, handleSearch)}

{renderFormFields(fields.slice(1, fields.length - 1), handleChange, formData, "", null, setFormData, handleSearch)}

<div style={{ marginTop: 24, marginBottom: 24 }}>
 {/* <h3 style={{ marginBottom: 10 }}>Payment Summary</h3>*/}

  <Table
    columns={paymentSummaryColumns}
    dataSource={paymentSummaryData}
    pagination={false}
    bordered
  />
</div>


{renderFormFields([fields[fields.length - 1]], handleChange, formData, "", null, setFormData, handleSearch)}

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
      <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Invoice" processNo={formData?.processId} />
    </Card>
  );
};
export default Invoice;
