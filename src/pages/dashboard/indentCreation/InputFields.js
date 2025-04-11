export const IndentDetails = [
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
        name: "indentorEmailId",
        label: "Indentor Email Id",
        type: "text",
        required: true,
      },
      {
        name: "consigneeLocation",
        label: "Consignee Location",
        type: "select",
        required: true,
        options: [
          {
            value: "1",
            label: "Locator 1",
          },
          {
            value: "2",
            label: "Locator 2",
          },
          {
            value: "3",
            label: "Locator 3",
          },
        ],
      },
    ],
  },
  {
    heading: "Material Details",
    name: "materialDtlList",
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
          option.label.toLowerCase().includes(input.toLowerCase())
      },
      
      // Update description field to show API data
      {
        name: "materialDesc",
        label: "Description",
        type: "text",
        span: 3,
        required: true,
        disabled: true // Becomes read-only as it's auto-populated
      },
      
      // Update UOM field with dynamic options
      {
        name: "uom",
        label: "UOM",
        type: "select",
        required: true,
        options: [], // Populated from API's uom values
        showSearch: true
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
        name: "budgetCode",
        label: "Budget Code",
        type: "select",
        required: true,
        span: 2,
        options: [],
      },
      {
        name: "totalPrice",
        label: "Total Price",
        type: "text",
        span: 2,
        // disabled: true,
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
        span: 2,
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
        name: "vendorName",
        label: "Vendor Name",
        type: "text",
        span: 2,
        // required: true,
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
        options: [
          {
            value: "1",
            label: "Project 1", 
          },
          {
            value: "2",
            label: "Project 2", 
          }
        ],
        span: 2
      },
    ]
  },
  {
    heading: "Pre-Bid Meeting Details",
    colCnt: 4,
    fieldList: [
      {
        name: "preBidMeetingRequired",
        label: "Pre-Bid Meeting Required?",
        type: "text",
        span: 1
      },
      {
        name: "preBidMeetingDetails",
        label: "Pre-Bid Meeting Date",
        type: "date",
        span: 2,
        dependencies: ["preBidMeetingRequired"]
      },
      {
        name: "preBidMeetingLocation",
        label: "Pre-Bid Meeting Location",
        type: "select",
        span: 2,
        dependencies: ["preBidMeetingRequired"],
        options: [
          { value: "Location 1", label: "Location 1" },
          { value: "Location 2", label: "Location 2" },
          { value: "Location 3", label: "Location 3" }
        ]
      }
    ]
  },
  {
    heading: "Rate Contract Indent Details",
    colCnt: 9,
    fieldList: [
      {
        name: "rateContractIndent",
        label: "Rate Contract Indent",
        type: "text",
        span: 3
      },
      {
        name: "periodOfRateContract",
        label: "Contract Period (Months)",
        type: "text",
        // required: true,
        span: 3,
        dependencies: ["rateContractIndent"]
      },
      {
        name: "singleOrMultipleJob",
        label: "Job Type",
        type: "select",
        // required: true,
        span: 3,
        options: [
          { value: "Single", label: "Single" },
          { value: "Multiple", label: "Multiple" }
        ]
      }
    ]
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
           { value: "Q4", label: "Q4" }
         ]
       },{
         name: "purpose",
         label: "Purpose",
         type: "text",
         span: 2,
       } 
    ]  
  },
  {
    heading: "Attachments",
    colCnt: 6,
    fieldList: [
      {
        name: "uploadingPriorApprovalsFileName",
        label: "Prior Approvals",
        type: "image",
        span: 2
      },
      {
        name: "technicalSpecificationsFileName",
        label: "Technical Specs",
        type: "image",
        span: 2
      },
      {
        name: "draftEOIOrRFPFileName",
        label: "Draft EOI/RFP",
        type: "image",
        span: 2
      },
    ]
  },
  {
    heading: "Brand PAC Details",
    colCnt: 4,
    fieldList: [
      {
        name: "brandPac",
        label: "Brand PAC Required",
        type: "text",
        span: 1
      },
      {
        name: "brandAndModel",
        label: "Brand & Model",
        type: "text",
        span: 2,
        dependencies: ["brandPac"]
      },
      {
        name: "uploadPACOrBrandPACFileName",
        label: "Brand PAC",
        type: "image",
        span: 1,
        dependencies: ["brandPac"]
      },
      {
        name: "justification",
        label: "It is known that as per the Rule 144 of GFR, where in the Fundamental principles of public buying states that the description of the subject matter of procurement to the extent practicable should not indicate a requirement for a particular trade mark, trade name or brand. However in the subject requirement, it is required to prefer the above mentioned brand for the following reasons:",
        type: "text",
        span: 4,
        dependencies: ["brandPac"]
      }
    ]
  }
];
