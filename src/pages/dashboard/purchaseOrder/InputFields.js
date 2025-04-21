export const PoDetails = [
    {
      heading: "PO Search",
      colCnt: 4,
      fieldList: [{
        name: "poId",
        label: "PO ID",
        type: "search",
        span: 1
      }]
    },
    {
      heading: "Tender Details",
      colCnt: 4,
      fieldList: [
        {
          name: "tenderId",
          label: "Tender ID",
          type: "select",
          options: [],
          required: true
        },
        {
          name: "consignesAddress",
          label: "Consignee Address",
          type: "text",
        },
        {
          name: "billingAddress",
          label: "Billing Address",
          type: "text",
          required: true,
          span: 2
        },
        {
            name: "deliveryPeriod",
            label: "Delivery Period",
            type: "text",
            required: true
        }
      ]
    },
    {
      heading: "Material Details",
      name: "materialDtlList",
      colCnt: 6,
      children: [
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
          required: true
        },
        {
          name: "rate",
          label: "Unit Rate",
          type: "text",
          required: true
        },
        {
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
        },
        {
            name: "gst",
            label: "GST (%)",
            type: "text",
            required: true
        },
        {
            name: "duties",
            label: "Duties (%)",
            type: "text",
            required: true
        },
        {
            name: "freightCharge",
            label: "Freight Charges",
            type: "text", 
            span: 2
        }
      ]
    },
    {
      heading: "Purchase Details",
      colCnt: 4,
      fieldList: [
        {
          name: "warranty",
          label: "Warranty",
          type: "text",
        }, 
        {
          name: "ifLdClauseApplicable",
          label: "If LD Clause Applicable",
          type: "checkbox",
        },
        {
          name: "incoTerms",
          label: "Inco Terms",
          type: "text",  
        },
        {
          name: "paymentTerms",
          label: "Payment Terms",
          type: "text",
        },
        {
          name: "applicablePbgToBeSubmitted",
          label: "Applicable PBG to be Submitted",
          type: "text",
          span: 2
        },
        {
            name: "transporterAndFreightForWarderDetails",
            label: "Transporter Details",
            type: "text",
            span: 2
        }
      ]
    },
    {
      heading: "Vendor Details",
      colCnt: 3,
      fieldList: [
        {
          name: "vendorName",
          label: "Vendor Name",
          type: "select",
          required: true,
          options: [],
        }, 
        {
          name: "vendorId",
          label: "Vendor ID",
          type: "text",
          disabled: true,
          required: true 
        },
        {
          name: "vendorAddress",
          label: "Vendor Address",
          type: "text",
          required: true,
          disabled: true,
        },
        {
          name: "vendorAccountNumber",
          label: "Vendor A/C No.",
          type: "text",
          required: true,
          disabled: true,
        },
        {
            name: "vendorsIfscCode",
            label: "Vendor IFSC Code",
            type: "text",
            required: true,
            disabled: true,
        },
        {
            name: "vendorAccountName",
            label: "Vendor A/C Name",
            type: "text",
            required: true,
            disabled: true,
        }
      ]
    }
  ];