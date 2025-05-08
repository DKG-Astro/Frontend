export const CpDetails = [
  {
      heading: "Contingency Search",
      colCnt: 4,
      fieldList: [
        {
          name: "cpId",
          label: "Contingency ID",
          type: "search",
          span: 1,
        },  
      ]
    },
{
  colCnt: 4,
  fieldList: [
    {
      name: "date",
      label: "Date",
      type: "date",
      // required: true,
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
      span: 3,
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
      label: "Gst",
      type: "text",
      required: true,
      span: 1,
    },
    {
      name: "budgetCode",
      label: "Budget Code",
      type: "select",
      required: true,
      span: 3,
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
      required: true,
      span: 2,
    },
    {
      name: "vendorInvoiceNo",
      label: "Vendor Invoice No.",
      type: "text",
    },
  ],
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
},
];
