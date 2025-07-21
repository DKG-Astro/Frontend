import { getNames } from 'country-list';

const countryNames = getNames(); // ['India', 'USA', 'Germany', ...]

const countryOptions = countryNames.map((country) => ({
  label: country,
  value: country,
}));

export const CpDetails =(formData = {}) => [
   {
            heading: "Search Indent",
            colCnt: 2,
            fieldList: [
        {
            name: "searchValue",
            label: "Search Value",
            type: "indentSearch",
          //  onSearch: () => handleSearchIndentIds(),
        },
    ]
    },
  {
      heading: "Contingency Search",
      colCnt: 4,
      fieldList: [
        {
          name: "cpId",
          label: "Contingency ID",
          //type: "search",
          type: "select",
          span: 1,
        },  
      ]
    },
     {
        heading: "Status",
        colCnt:2,
        fieldList:[
            ...(formData.cpId ? [
    {
        name: "processStage",
        label: "Process Stage",
        type: "text",
        disabled: true
    },
    {
        name: "status",
        label: "Status",
        type: "text",
        disabled: true
    }
] : [])
        ]
    },
{
  colCnt: 4,
  fieldList: [
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
  ],
},
{
  heading: "Material Details",
  name: "materialDetails",
  addButton: true,
  colCnt: 8,
  children: [
    // Update materialCode field options to be populated dynamically
    {
      name: "materialCode",
      label: "Material Code",
      type: "select",
      span: 2,
      required: true,
      options: [], // Will be populated from API data
      showSearch: true,
      filterOption: (input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase()),
    },

    // Update description field to show API data
    {
      name: "materialDescription",
      label: "Description",
      type: "select",
      span: 2,
      options: [], // Will be populated from API data
      showSearch: true,
      filterOption: (input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase()),
      required: true,
    },
    {
      name: "uom",
      label: "UOM",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "text",
      required: true,
    },
    {
      name: "unitPrice",
      label: "Unit Price",
      type: "text",
      disabled: true,
    },
    {
      name: "currency",
      label: "Currency",
      type: "text",
      required: true,
      span: 1,
      disabled: true,
    },
    {
      name: "gst",
      label: "GST (%)",
      type: "select",
      required: true,
      span: 2,
      options: [
        { label: "Nil", value: "0" },
        { label: "5%", value: "5" },
        { label: "12%", value: "12" },
        { label: "18%", value: "18" },
        { label: "28%", value: "28" }
      ]
    },
    {
      name: "budgetCode",
      label: "Budget Code",
      type: "select",
      required: true,
      span: 2,
      options: [
        {
          value: "Capital",
          label: "Capital",
        },
        {
          value: "Consumable",
          label: "Consumable",
        },
        {
          value: "Instrument and Accessories",
          label: "Instrument and Accessories",
        },
      ],
    },
    {
      name: "materialCategory",
      label: "Material Category",
      type: "text",
      span: 2,
    },
    {
      name: "materialSubCategory",
      label: "Material Sub Category",
      type: "text",
      span: 2,
    },
   /* {
      name: "modeOfProcurement",
      label: "Mode of Procurement",
      type: "select",
      span: 3,
      options: [
        {
          value: "GEM",
          label: "GEM",
        },
        {
          value: "Brand PAC",
          label: "Brand PAC",
        },
        {
          value: "Proprietary/Single Tender",
          label: "Proprietary/Single Tender",
        },
        {
          value: "Open Tender",
          label: "Open Tender",
        },
        {
          value: "Global Tender",
          label: "Global Tender",
        },
      ],
    },*/
    
    {
      name: "totalPrice",
      label: "Total Price",
      type: "text",
      span: 2,
      disabled: true,
    },
    {
      name: "countryOfOrigin",
      label: "Country of Origin",
      type: "select",
      required: true,
      span: 2,
      options: countryOptions, 
    }
  ],
},
{
  heading: "Vendor Details",
  colCnt: 4,
  fieldList: [
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "select",
     // required: true,
      required: formData.paymentTo !== "employee", 
      span: 2,
    },
    {
      name: "vendorInvoiceNo",
      label: "Vendor Invoice No.",
      type: "text",
    },
  ],
},{
  heading: "Payment Details",
  fieldList: [
    {
      name: "paymentTo",
      label: "Payment To",
      type: "select",
      required: true,
      options: [
        { label: "Vendor", value: "vendor" },
        { label: "Employee", value: "employee" }
      ]
    },
    ...(formData.paymentTo === "vendor" ? [
      {
        name: "paymentToVendor",
        label: "Vendor Name",
        type: "select",
        required: true,
      }
    ] : []),
    ...(formData.paymentTo === "employee" ? [
      {
        name: "paymentToEmployee",
        label: "Employee Name",
        type: "select",
        required: true,
      }
    ] : [])
  ]
},
{
  heading: "Purchase Details",
  colCnt: 4,
  fieldList: [
    {
      name: "remarksForPurchase",
      label: "Remarks For Purchase",
      type: "text",
    },
 /*   {
      name: "amountToBePaid",
      label: "Amount to be Paid",
      type: "text",
      required: true,
    },*/
    {
      name: "predifinedPurchaseStatement",
      label: "Purchase Statement",
      type: "text",
    },
    {
      name: "uploadCopyOfInvoice",
      label: "Upload Copy of Invoice",
      type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
      fileType: "CP",
     // required: true,
    },
  ],
},
{
  heading: "Project Details",
  colCnt: 4,
  fieldList: [
    {
      name: "projectName",
      label: "Project Name",
      type: "select",
    },
    {
      name: "projectDetail",
      label: "Project Detail",
      type: "text",
    }
  ],
},{
  heading: "",
  colCnt: 4,
  fieldList: [
    {
      name: "purpose",
      label: "purpose",
      type: "text",
      required: true,
    },
    ]},
  {
  heading: "Declarations",
  colCnt: 2,
  fieldList: [
    {
      name: "declarationOne",
      type: "checkboxWithLabelText",
      label: "I, hereby declare that the proposed procurement of [Description of Goods/Services/Works - to be auto-fetched] complies with the Government of India’s Order (Public Procurement No. 1), dated July 23, 2020. The goods/services originate from [Country of Origin - to be auto-fetched], and the supplier [Supplier Name - to be auto-fetched] is registered with the DPIIT’s Competent Authority for supplying goods/services from [Country - to be auto-fetched], if applicable. I confirm that all necessary due diligence has been conducted to ensure compliance with the said order.",
      span: 2,
      required: true
    },
     {
      name: "declarationTwo",
      type: "checkboxWithLabelText",
      label: "I, hereby declare that these goods/ services purchased are of the requisite quality and specification and have been purchased from a reliable supplier at a reasonable price.",
      span: 2,
      required: true
    }
  ]
}
];
