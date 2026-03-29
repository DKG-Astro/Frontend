import { handleSearch } from "../../../utils/CommonFunctions";
import { Table } from "antd";

export const locatorMaster = [
    {
        value: "1",
        label: "Locator 1"
    },
    {
        value: "2",
        label: "Locator 2"
    },
    {
        value: "3",
        label: "Locator 3"
    },
    {
        value: "4",
        label: "Locator 4"
    },
]


export const invoiceFields =(formData,pvPoOptions,pvIds, poOptions, grnIds,setSelectedPoId, soOptions,advancePoOptions)=> [
 {
    heading: "Search",
    colCnt: 2,
    fieldList: [
{
  name: "pvPoId",
  label: "Previous Voucher PO",
  type: "select",
  options: pvPoOptions
},
{
  name: "pvId",
  label: "Previous Voucher ID",
  type: "select",
  options: pvIds
},]},

  {
    heading: "Invoice Details",
    colCnt: 2,
    fieldList: [
      // {
      //   name: "paymentVoucherNumber",
      //   label: "Payment Voucher Number",
      //   type: "text",
       
      // },
      {
        name: "paymentVoucherDate",
        label: "Payment Voucher Date",
        type: "date",
        required: true,
      },
      {
        name: "paymentVoucherIsFor",
        label: "Payment Voucher Is For",
        type: "select",
        required: true,
        options: [
            { value: "Purchase Order", label: "Purchase Order" },
            { value: "Service Order", label: "Service Order" },
        ],
      },
    /* ...(formData.paymentVoucherIsFor === "Purchase Order"
    ? [
        {
          name: "purchaseOrderids",
          label: "Purchase Order Ids",
          type: "pvselect",
          required: true,
          options: poOptions,
           showSearch: true,
  filterOption: (input, option) =>
    option.searchText.includes(input.toLowerCase()),
        },
         {
          name: "grnNumber",
          label: "GRN Number",
          type: "select",
          required: true,
          options: grnIds,
        },
      ]
    : []),*/
    ...(formData.paymentVoucherIsFor === "Purchase Order" &&
    formData.paymentVoucherType === "Advance"
  ? [
      {
        name: "purchaseOrderids",
        label: "Purchase Order Id",
        type: "pvselect",
        required: true,
        options: advancePoOptions, 
        showSearch: true,
        filterOption: (input, option) =>
          option.searchText.includes(input.toLowerCase()),
      },
    ]
  : []),

//  If Payment Voucher Is For = PURCHASE ORDER AND TYPE = PARTIAL or FULL PAYMENT
//    → show Purchase Order + GRN
...(formData.paymentVoucherIsFor === "Purchase Order" &&
    (formData.paymentVoucherType === "Partial" ||
     formData.paymentVoucherType === "Full Payment")
  ? [
      {
        name: "purchaseOrderids",
        label: "Purchase Order Id",
        type: "pvselect",
        required: true,
        options: poOptions,
        showSearch: true,
        filterOption: (input, option) =>
          option.searchText.includes(input.toLowerCase()),
      },
      {
        name: "grnNumber",
        label: "GRN Number",
        type: "multiselect",
        required: true,
        options: grnIds,
      },
    ]
  : []),
     ...(formData.paymentVoucherIsFor === "Service Order"
    ? [
        {
          name: "ServiceOrderDetails",
          label: "Service Order Ids",
          type: "select",
          required: true,
          options: soOptions,
        },
      ]
    : []),
    {
        name: "paymentVoucherType",
        label: "Payment Voucher Type",
        type: "select",
        required:true,
         options: [
            { value: "Advance", label: "Advance" },
            { value: "Partial", label: "Partial" },
            { value: "Full Payment", label: "Full Payment" },
        ],

      },
       {
        name: "vendorName",
        label: "Vendor Name",
        type: "text",
      },
     
       ...(formData.paymentVoucherType !== "Advance"
  ? [
      {
        name: "vendorInvoiceNumber",
        label: "Vendor Invoice Number",
        type: "text",
        required: true,
      },
      {
        name: "vendorInvoiceDate",
        label: "Vendor Invoice Date",
        type: "date",
      },
         ]
  : []),
      {
        name: "currency",
        label: "Currency",
        type: "text",
        required: true,
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

     /* {
        name: "status",
        label: "Status",
        type: "text",
      },*/
       {
        name: "remarks",
        label: "Remarks",
        type: "text",
        span: 2,
      },
      
      ...(formData.paymentVoucherType === "Advance"
        ? [
            {
              name: "advanceAmount",
              label: "Advance Amount",
              type: "text",
              required: true,
             // disabled: true,
            },
           /* {
              name: "advanceRemarks",
              label: "Advance Remarks",
              type: "text",
            },*/
          ]
        : []),
    ...(formData.partialAmountAlreadyPaid > 0  && formData.paymentVoucherType === "Full Payment"
  ? [
       {
  name: "advanceAdjustedAmount",
  label: "Advance Deducted From GRN",
  type: "text",
  required: false,
  //disabled: formData.advanceAmountAlreadyPaid > 0, 
}, /* {
          name: "advanceBalanceAmount",
          label: "Balance Amount (Advance)",
          type: "text",
          disabled: true,
        },*/
         ] : []),

          ...(formData.paymentVoucherType === "Full Payment"
  ? [
      {
        name: "partialAmountAlreadyPaid",
        label: "Already Paid (Previous Partials)",
        type: "text",
        disabled: true,
      },
      {
        name: "partialBalanceAmount",
        label: "Remaining Amount (Before Full Payment)",
        type: "text",
        disabled: true,
      }
    ]
  : [])
,
         
  ...(formData.paymentVoucherType === "Partial"
  ? [
      {
        name: "partialAmount",
        label: "Partial Amount (Current Payment)",
        type: "text",
        required: true,
      },
       ...(formData.partialAmountAlreadyPaid >= 0 && formData.advanceAmountAlreadyPaid > 0
  ? [
       {
  name: "advanceAdjustedAmount",
  label: "Advance Deducted From GRN",
  type: "text",
  required: false,
  //disabled: formData.advanceAmountAlreadyPaid > 0, 
},  {
          name: "advanceBalanceAmount",
          label: "Balance Amount (Advance)",
          type: "text",
          disabled: true,
        },
         ] : []),
     ...(formData.partialAmountAlreadyPaid > 0
  ? [
      {
        name: "partialAmountAlreadyPaid",
        label: "Already Paid (Previous Partials)",
        type: "text",
        disabled: true,
      },
     

        ...(formData.paymentVoucherType === "Partial" ?[
           {
        name: "partialBalanceAmount",
        label: "Balance Amount (Remaining)",
        type: "text",
        disabled: true,
      }
        ] : []),
     
    ]
  : []),


    ]
  : []),



//...(formData.paymentVoucherType === "Advance"
...(formData.advanceAmountAlreadyPaid > 0
    ? [
        {
          name: "advanceAmountAlreadyPaid",
          label: "Advance Amount",
          type: "text",
          disabled: true,
        },
        ...(formData.paymentVoucherType === "Advance"  ?[
           {
          name: "advanceBalanceAmount",
          label: "Balance Amount (Advance)",
          type: "text",
          disabled: true,
        },
        ] : []),
       
      ]
    : []),

    ],
    
  },

   {
  heading: "Voucher Amount Details",
  colCnt: 2,
  fieldList: [

    // ✅ Income Tax TDS
    {
      label: "Income Tax TDS (%)",
      name: "incomeTdsPercentage",
      type: "select",
      options: [
        { value: 1, label: "1%" },
        { value: 2, label: "2%" },
        { value: 5, label: "5%" },
        { value: 10, label: "10%" }
      ]
    },
    {
      label: "Income Tax TDS Amount",
      name: "incomeTdsAmount",
      type: "text",
      disabled: true
    },
    {
      label: "Income TDS Remarks",
      name: "incomeTdsRemarks",
      type: "text"
    },

    // ✅ GST TDS
    {
      label: "GST TDS (%)",
      name: "gstTdsPercentage",
      type: "select",
      options: [
        { value: 1, label: "1%" },
        { value: 2, label: "2%" },
        { value: 5, label: "5%" },
        { value: 10, label: "10%" }
      ]
    },
    {
      label: "GST TDS Amount",
      name: "gstTdsAmount",
      type: "text",
      disabled: true
    },
    {
      label: "GST TDS Remarks",
      name: "gstTdsRemarks",
      type: "text"
    },

    // ✅ Total TDS
    {
      label: "Total TDS",
      name: "tdsAmount",
      type: "text",
      disabled: true
    }
  ]
},
   /*  {
    heading: "Purchase Order Details",
    name: "poDtlList",
    colCnt: 4,
    children: [
      { name: "purchaseOrderAmount", label: "Purchase Order Amount (Rs)", type: "text", required: true },
      { name: "advanceAmount", label: "Advance Amount", type: "text", required: true },
      { name: "advancePaid", label: "Advance Paid (Rs)", type: "text" },
      { name: "alreadyInvoicedAmount", label: "Already Invoice Amount (Rs)", type: "text" },
      { name: "balanceAmount", label: "Balance Amount (Rs)", type: "text" },
    ],
  },*/ {
      heading: "Material Details",
      name: "materialDtlList",
      colCnt: 6,
      children: [
          ...(!formData.paymentVoucherType === "Full Payment"
  ? [
      {
        name: "grnNum",
        label: "Grn Number",
        type: "text",
        disabled: true,
        required: true,
        span: 2
      }
    ]
  : []),
        {
          name: "materialCode",
          label: "Material Code",
          type: "text",
          disabled: true,
          required: true,
          span: 2
        },
        {
          name: "materialDescription",
          label: "Material Description",
          type: "text",
          disabled: true,
          required: true,
          span: 2
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "text",
          required: true,
             disabled: true,
        },
        {
          name: "rate",
          label: "Unit Rate",
          type: "text",
          required: true,
             disabled: true,
        },
       /* {
          name: "currency",
          label: "Currency",
          type: "text",
          disabled: true,
          required: true
        },
        {
            name: "exchangeRate",
            label: "Exchange Rate",
            type: "text",
            span: 2
        },*/
        {
            name: "gst",
            label: "GST (%)",
            type: "text",
            required: true,
               disabled: true,
        },  {
            name: "amount",
            label: "Amount",
            type: "text",
            required: true,
               disabled: true,
        },
       
      ]
    },
    {
  heading: "Payment Voucher Attachments",
  colCnt: 2,
  fieldList: [
    
     {
  label: "Attachments",
  name: "attachments",
  type: "multiImage",   
  required: false
}
  ]},
{
  heading: "Final Payable Amount",
  colCnt: 2,
  fieldList: [
    {
      name: "paymentVoucherNetAmount",
      label: "Total Amount Payable (Final)",
      type: "text",
      disabled: true,
      span: 2
    }
  ]
}
   /* {
        heading: "Material Details",
        name: "materialDtlList",
        colCnt: 8,
        children: [
            {
                name: "assetId",
                label: "Asset ID",
                type: "text",
                span: 2,
                // required: true
            },
            {
                name: "assetDesc",
                label: "Asset Description",
                type: "text",
                span: 3,
                // required: true
            },
            {
                name: "materialCode",
                label: "Material Code",
                type: "text",
                span: 2,
                // required: true
            },
            {
                name: "materialDesc",
                label: "Material Description",
                type: "text",
                span: 3,
                // required: true
            },
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 1,
                required: true
            },
            {
                name: "locatorId",
                label: "Locator",
                type: "select",
                options: locatorMaster,
                span: 2,
                required: true
            },
            {
                name: "unitPrice",
                label: "Unit Price",
                type: "text",
                required: true
            },...(formData.isDepreciationDisabled ? [] : [{
                name: "depriciationRate",
                label: "Depreciation Rate",
                type: "text",
                required: true
            }]),
            {
                name: "bookValue",
                label: "Book Value",
                type: "text",
                required: true,
                disabled: true,
            
            },
            
            {
                name: "receivedQuantity",
                label: "Received Quantity",
                type: "text",
                required: true
            },
            {
                name: "acceptedQuantity",
                label: "Accepted Quantity",
                type: "text",
                required: true
            },
        ]
    },*/
   /* {
    heading: "Vendor Details",
    name: "vendorDtlList",
    colCnt: 4,
    children: [
      { name: "vendorCode", label: "Vendor Code", type: "text", required: true },
      { name: "vendorName", label: "Vendor Name", type: "text", required: true },
      { name: "gstNumber", label: "GST Number", type: "text" },
      { name: "contactPerson", label: "Contact Person", type: "text" },
      { name: "contactNumber", label: "Contact Number", type: "text" },
      { name: "email", label: "Email", type: "text" },
    ],
  },*/
   
];

