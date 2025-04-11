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
        label: "Indent ID",
        type: "select",
        mode: "multiple",
        required: true,
        span: 2,
        options: [] // Populated dynamically
      }
    ]
  },
  {
    heading: "Tender Attachments",
    colCnt: 3,
    fieldList: [
      {
        name: "uploadTenderDocuments",
        label: "Tender Documents",
        type: "image",
        span: 1
      },
      {
        name: "uploadGeneralTermsAndConditions",
        label: "General Terms & Conditions",
        type: "image",
        required: true,
        span: 1
      },
      {
        name: "uploadSpecificTermsAndConditions",
        label: "Specific Terms & Conditions",
        type: "image",
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
        span: 1,
        options: [] // Populated dynamically
      },
      {
        name: "billingAddress",
        label: "Billing Address",
        type: "text",
        required: true,
        span: 1
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
        type: "text",
        span: 1
      },
      {
        name: "mllStatusDeclaration",
        label: "MLL Status Declaration",
        type: "text",
        span: 1
      }
    ]
  }
];