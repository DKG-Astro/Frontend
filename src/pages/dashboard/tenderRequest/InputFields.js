
export const TenderDetails = [
  {
    heading: "Tender Basic Details",
    colCnt: 4,
    fieldList: [
      {
        name: "title",
        label: "Title of the Tender",
        type: "text",
        required: true,
        span: 2
      },
      {
        name: "openingDate",
        label: "Opening Date",
        type: "date",
        required: true,
        span: 1
      },
      {
        name: "closingDate",
        label: "Closing Date",
        type: "date",
        required: true,
        span: 1
      },
    ]
  },
  {
    heading: "Indent Selection",
    colCnt: 2,
    fieldList: [
        {
            name: "indentId",
            label: "Select Indent ID",
            type: "select", // or "select" if single-select
            required: true,
            options: [], // This will be overridden dynamically
          },          
    ]
  },
  {
    heading: "Material Details",
    name: "materialDetails",
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
        name: "budgetCode",
        label: "Budget Code",
        type: "select",
        required: true,
        span: 3,
        options: [],
      },
      {
        name: "totalPrice",
        label: "Total Price",
        type: "text",
        span: 2,
        disabled: true,
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
      {
        name: "modeOfProcurement",
        label: "Mode of Procurement",
        type: "select",
        span: 3,
        options: [],
      },
      {
        name: "vendorName",
        label: "Vendor Name",
        type: "text",
        span: 2,
        // required: true,
      },
    ],
  },
  {
    heading: "Tender Attachments",
    colCnt: 3,
    fieldList: [
      {
        name: "uploadTenderDocuments",
        label: "Tender Documents",
        type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 1
      },
      {
        name: "uploadGeneralTermsAndConditions",
        label: "General Terms & Conditions",
        type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        required: true,
        span: 1
      },
      {
        name: "uploadSpecificTermsAndConditions",
        label: "Specific Terms & Conditions",
        type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 1
      }
    ]
  },
  {
    heading: "Submission Details",
    colCnt: 3,
    fieldList: [
      {
        name: "bidType",
        label: "Bid Type",
        type: "select",
        required: true,
        span: 1,
        options: [
          { value: "Single", label: "Single" },
          { value: "Double", label: "Double" }
        ] 
      },
      {
        name: "lastDate",
        label: "Last Date of Submission",
        type: "date",
        required: true,
        span: 1
      },
      {
        name: "applicableTaxes",
        label: "Applicable Taxes",
        type: "text",
        required: true,
        span: 1
      }
    ]
  },
  {
    heading: "Commercial Terms",
    colCnt: 3,
    fieldList: [
      {
        name: "incoTerms",
        label: "INCO Terms",
        type: "text",
        required: true,
        span: 1
      },
      {
        name: "consigneeAddress",
        label: "Consignee Address",
        type: "select",
        required: true,
        options: [], // will be overridden
      },
      {
        name: "billingAddress",
        label: "Billing Address",
        type: "text",
        required: true,
        span: 1,
        // defaultValue should be "Koramangala, 2nd Block, Bangalore -560034"
      }
    ]
  },
  {
    heading: "Payment & Performance",
    colCnt: 3,
    fieldList: [
      {
        name: "paymentTerms",
        label: "Payment Terms",
        type: "text",
        required: true,
        span: 1
      },
      {
        name: "ldClause",
        label: "LD Clause",
        type: "text",
        required: true,
        span: 1
      },
      {
        name: "applicablePerformance",
        label: "Performance Security",
        type: "text",
        required: true,
        span: 1
      }
    ]
  },
  {
    heading: "Declarations",
    colCnt: 2,
    fieldList: [
      {
        name: "bidSecurity",
        label: "Bid Security Declaration",
        type: "text", //should be a checkbox field (true or false)
        span: 1
      },
      {
        name: "mllStatusDeclaration",
        label: "MLL Status Declaration",
        type: "text", // should be a checkbox field (true or false)
        span: 1
      }
    ]
  }
];