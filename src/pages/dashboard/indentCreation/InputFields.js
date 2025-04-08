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
      {
        name: "materialCode",
        label: "Material Code",
        type: "select",
        span: 2,
        required: true,
        options: [
          {
            value: "1",
            label: "Material 1",
          },
          {
            value: "2",
            label: "Material 2",
          },
          {
            value: "3",
            label: "Material 3",
          },
        ],
      },
      {
        name: "materialDesc",
        label: "Description",
        type: "select",
        span: 3,
        required: true,
        options: [
          {
            value: "1",
            label: "Description 1",
          },
          {
            value: "2",
            label: "Description 2",
          },
          {
            value: "3",
            label: "Description 3",
          },
        ],
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
        name: "uom",
        label: "UOM",
        type: "select",
        required: true,
        // disabled: true,
        options: [
          {
            value: "1",
            label: "UOM 1",
          },
          {
            value: "2",
            label: "UOM 2",
          },
          {
            value: "3",
            label: "UOM 3",
          },
        ],
      },
      {
        name: "budgetCode",
        label: "Budget Code",
        type: "select",
        required: true,
        span: 2,
        options: [
          {
            value: "1",
            label: "Budget Code 1",
          },
          {
            value: "2",
            label: "Budget Code 2",
          },
          {
            value: "3",
            label: "Budget Code 3",
          },
        ],
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
        type: "select",
        span: 2,
        required: true,
        options: [
          {
            value: "1",
            label: "Material Category 1",
          },
          {
            value: "2",
            label: "Material Category 2",
          }, 
        ]
      },
      {
        name: "materialSubCategory",
        label: "Material Sub Category",
        type: "select", 
        span: 2,
        options: [
          {
            value: "1",
            label: "Material Sub Category 1",
          },
          {
            value: "2",
            label: "Material Sub Category 2",
          },
          {
            value: "3",
            label: "Material Sub Category 3",
          },
        ],
      },
      {
        name: "modeOfProcurement",
        label: "Mode of Procurement",
        type: "select",
        span: 2,
        required: true, 
        options: [
          {
            value: "1",
            label: "Mode of Procurement 1",
          },
          {
            value: "2",
            label: "Mode of Procurement 2",
          },
          {
            value: "3",
            label: "Mode of Procurement 3",
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
