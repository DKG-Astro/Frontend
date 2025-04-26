export const IndentDetails = [
  {
    heading: "Indent Search",
    colCnt: 4,
    fieldList: [
      {
        name: "indentId",
        label: "Indent ID",
        type: "search",
        span: 1,
      },
    ],
  },
  {
    heading: "Indentor Details",
    colCnt: 4,
    fieldList: [
      {
        name: "indentorName",
        label: "Indentor Name",
        type: "text",
        required: true,
      },
      {
        name: "indentorMobileNo",
        label: "Indentor Mobile No.",
        type: "text",
        required: true,
      },
      {
        name: "indentorEmailAddress",
        label: "Indentor Email Id",
        type: "text",
        required: true,
      },
      {
        name: "consignesLocation",
        label: "Consignee Location",
        type: "select",
        required: true,
        // options: (props) => props.locations,
        showSearch: true,
      },
    ],
  },
  {
    heading: "Material Details",
    name: "materialDetails",
    colCnt: 9,
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
        label: "Material Description",
        type: "select",
        span: 3,
        options: [], // Will be populated from API data
        showSearch: true,
        filterOption: (input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase()),
        required: true,
      },

      // Update UOM field with dynamic options
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
        required: true,
        span: 2,
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
        required: true,
      },
      {
        name: "materialSubCategory",
        label: "Material Sub Category",
        type: "text",
        span: 3,
        required: true,
      },
      {
        name: "modeOfProcurement",
        label: "Mode of Procurement",
        type: "select",
        span: 3,
        required: true,
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
            value: "Limited Pre Approved Vendor Tender",
            label: "Limited Pre Approved Vendor Tender",
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
      },
      {
        name: "vendorNames",
        label: "Vendor Name",
        type: "select",
        span: 3,
        // disabled: (formData) => {
        //   const mode = formData.materialDetails?.[0]?.modeOfProcurement;
        //   return ![
        //     "Proprietary/Single Tender",
        //     "Limited Pre Approved Vendor Tender",
        //   ].includes(mode);
        // },
        showSearch: true,
        mode: (formData) =>
          formData.materialDetails?.[0]?.modeOfProcurement ===
          "Limited Pre Approved Vendor Tender"
            ? "select"
            : undefined,
        // options: (props) => props.vendors,
        dependencies: ["materialDetails[0].modeOfProcurement"],
        shouldShow: (formData) =>
          [
            "Proprietary/Single Tender",
            "Limited Pre Approved Vendor Tender",
          ].includes(formData.materialDetails?.[0]?.modeOfProcurement),
        filterOption: (input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase()),
      },
      {
        name: "totalPrice",
        label: "Total Price",
        type: "text",
        span: 2,
        disabled: true,
      },
    ],
  },
  // MOVED UP: Project Details now comes after Material Details
  {
    heading: "Project Details",
    colCnt: 4,
    fieldList: [
      {
        name: "projectName",
        label: "Project Name",
        type: "select",
        // required: true,
        // options: (props) => props.projects,
        span: 2,
      },
    ],
  },
  {
    heading: "Pre-Bid Meeting Details",
    colCnt: 6,
    fieldList: [
      {
        name: "isPreBidMeetingRequired",
        label: "Pre-Bid Meeting Required?",
        type: "checkbox", //should be a checkbox field (true or false)
        span: 2,
      },
      {
        name: "preBidMeetingDate",
        label: "Tentative Meeting Date",
        type: "date",
        span: 2,
        dependencies: ["isPreBidMeetingRequired"],
        shouldShow: (formData) => formData.isPreBidMeetingRequired === true,
        required: (formData) => formData.isPreBidMeetingRequired === true,
      },
      {
        name: "preBidMeetingVenue",
        label: "Tentative Meeting Location",
        type: "select",
        span: 2,
        dependencies: ["isPreBidMeetingRequired"],
        options: [],
        shouldShow: (formData) => formData.isPreBidMeetingRequired === true,
        required: (formData) => formData.isPreBidMeetingRequired === true,
      },
    ],
  },
  {
    heading: "Rate Contract Indent Details",
    colCnt: 10,
    fieldList: [
      {
        name: "isItARateContractIndent",
        label: "Is it a Rate Contract Indent?",
        type: "checkbox", //should be a checkbox field (true or false)
        span: 3,
      },
      {
        name: "periodOfContract",
        label: "Contract Period (Months)",
        type: "text",
        span: 3,
        dependencies: ["isItARateContractIndent"],
        shouldShow: (formData) => formData.isItARateContractIndent === true,
        required: (formData) => formData.isItARateContractIndent === true,
      },
      {
        name: "singleAndMultipleJob",
        label: "Job Type",
        type: "select",
        // required: true,
        span: 2,
        options: [
          { value: "Single", label: "Single" },
          { value: "Multiple", label: "Multiple" },
        ],
        shouldShow: (formData) => formData.isItARateContractIndent === true,
        required: (formData) => formData.isItARateContractIndent === true,
      },
      {
        name: "estimatedRate",
        label: "Estimated Rate",
        type: "text",
        span: 2,
        dependencies: ["isItARateContractIndent"],
        shouldShow: (formData) => formData.isItARateContractIndent === true,
        required: (formData) => formData.isItARateContractIndent === true,
      },
    ],
  },
  {
    heading: "Additional Details",
    colCnt: 4,
    fieldList: [
      {
        name: "quarter",
        label: "Quarter",
        type: "select",
        span: 2,
        options: [
          { value: "Q1", label: "Q1" },
          { value: "Q2", label: "Q2" },
          { value: "Q3", label: "Q3" },
          { value: "Q4", label: "Q4" },
        ],
      },
      {
        name: "purpose",
        label: "Purpose",
        type: "text",
        span: 2,
      },
    ],
  },
  {
    heading:
      "Proprietary Details (if mode of procurement is Proprietary/Single Tender)",
    colCnt: 4,
    fieldList: [
      //   {
      //     name: "proprietary",
      //     label: "Is Proprietary?",
      //     type: "checkbox", //should be a checkbox field (true or false)
      //     span: 1,
      //   },
      {
        name: "reason",
        label: "Reason for Proprietary",
        type: "select",
        span: 5,
        options: [
          {
            value:
              "It is in the knowledge of the user department that only a particular firm is the manufacturer of the required goods",
            label:
              "It is in the knowledge of the user department that only aparticular firm is the manufacturer of the required goods",
          },
          {
            value:
              "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
            label:
              "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
          },
          {
            value:
              "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
            label:
              "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
          },
        ],
        dependencies: ["materialDetails[0].modeOfProcurement"],
        shouldShow: (formData) =>
          formData.materialDetails?.[0]?.modeOfProcurement ===
          "Proprietary/Single Tender",
      },
      {
        name: "proprietaryJustification",
        label: "Justification",
        type: "text",
        span: 4,
        dependencies: ["materialDetails[0].modeOfProcurement"],
        shouldShow: (formData) =>
          formData.materialDetails?.[0]?.modeOfProcurement ===
          "Proprietary/Single Tender",
      },
    ],
  },
  {
    heading: "Attachments",
    colCnt: 6,
    fieldList: [
      {
        name: "uploadingPriorApprovalsFileName",
        label: "Prior Approvals",
        type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 2,
        fileType: "Indent",
      },
      {
        name: "technicalSpecificationsFileName",
        label: "Upload Technical Specifications",
        type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 2,
        fileType: "Indent",
      },
      {
        name: "draftEOIOrRFPFileName",
        label: "Draft EOI/RFP",
        type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 2,
        fileType: "Indent",
      },
    ],
  },
  {
    heading: "Buy Back Details",
    colCnt: 4,
    fieldList: [
      {
        name: "buyBack",
        label: "Is Buy Back Required?",
        type: "checkbox", //should be a checkbox field (true or false)
        span: 1,
      },
      {
        name: "uploadBuyBackFileNames",
        label: "Buy Back File",
        type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        dependencies: ["buyBack"],
        shouldShow: (formData) => formData.buyBack === true,
        required: (formData) => formData.buyBack === true,
        fileType: "Indent",
      },
    ],
  },
  {
    heading: "Brand PAC Details",
    colCnt: 4,
    fieldList: [
      {
        name: "brandPac",
        label: "Is Brand PAC Required?",
        type: "checkbox", //should be a checkbox field (true or false)
        span: 1,
      },
      {
        name: "brandAndModel",
        label: "Brand & Model",
        type: "text",
        span: 2,
        dependencies: ["brandPac"],
        shouldShow: (formData) => formData.brandPac === true,
        required: (formData) => formData.brandPac === true,
      },
      {
        name: "uploadPACOrBrandPACFileName",
        label: "Brand PAC",
        type: "uploadFiles", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
        span: 1,
        dependencies: ["brandPac"],
        fileType: "Indent",
        shouldShow: (formData) => formData.brandPac === true,
        required: (formData) => formData.brandPac === true,
      },
      {
        name: "justification",
        label:
          "It is known that as per the Rule 144 of GFR, where in the Fundamental principles of public buying states that the description of the subject matter of procurement to the extent practicable should not indicate a requirement for a particular trade mark, trade name or brand. However in the subject requirement, it is required to prefer the above mentioned brand for the following reasons:",
        type: "text",
        span: 4,
        dependencies: ["brandPac"],
        shouldShow: (formData) => formData.brandPac === true,
        required: (formData) => formData.brandPac === true,
      },
    ],
  },
];
