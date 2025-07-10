import countryList from "react-select-country-list";

const countryOptions = countryList().getData().map(c => ({
  label: c.label,
  value: c.label
}));


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
      /*  {
            name: "deliveryPeriod",
            label: "Delivery Period",
            type: "text",
            required: true
        }*/{
          name:"deliveryDate",
          label:"Delivery Date",
          type:"date",
          required:true
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
            type: "select",
            required: true,
            options: [
              { label: "Nil", value: "0" },
              { label: "5%", value: "5" },
              { label: "12%", value: "12" },
              { label: "18%", value: "18" },
              { label: "28%", value: "28" }
            ]
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
        },
        {
            name: "inrEquivalent",
            label: "Equivalent INR",
            type: "text",
            disabled: true,
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
          type: "select",
          span: 2,
          options: [
            ...Array.from({ length: 20 }, (_, i) => ({
            label: String(i + 1),
            value: String(i + 1),
          })),
          { label: "NA", value: "NA" },
          ],
        },
        {
            name: "transporterAndFreightForWarderDetails",
            label: "Freight Forwarder",
            type: "select",
            options: countryOptions,
            span: 2,
            required: false
        },
        {
                    name: "comparativeStatementFileName",
                    label: "Comparative Statement",
                    type: "multiImage",
                    span:2,
                    //required: true,
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
          type: "select",
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