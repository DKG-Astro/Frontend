import { handleSearch } from "../../../utils/CommonFunctions";

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

// export const grvFields =(formData)=> [
//     {
//         heading: "Order Details",
//         colCnt: 5,
//         fieldList: [
//             {
//                 name: "grnType",
//                 label: "GRN Type",
//                 type: "select",
//                 required: true,
//                 options: [
//                     {
//                         value: "GI",
//                         label: "GI"
//                     },
//                     {
//                         value: "IGP",
//                         label: "IGP"
//                     }
//                 ],
//             },
//             {
//                 name: "giNo",
//                 label: "Enter Process No",
//                 type: "search",
//                 required: true,
//                 span: 2
//             },
//             {
//                 name: "grnNo",
//                 label: "GRN No",
//                 type: "search",
//               //  disabled: true,
//                 span: 2,
//             },
//             {
//                 name: "grnDate",
//                 label: "GRN Date",
//                 type: "date",
//                 required: true
//             },
//             {
//                 name: "installationDate",
//                 label: "Installation Date",
//                 type: "date",
//                 required: true
//             },
//             {
//                 name: "commissioningDate",
//                 label: "Commission Date",
//                 type: "date",
//                 required: true
//             }
//         ]
//     },
//     {
//         heading: "Material Details",
//         name: "materialDtlList",
//         colCnt: 8,
//         children: [
//             {
//                 name: "assetId",
//                 label: "Asset ID",
//                 type: "text",
//                 span: 2,
//                 // required: true
//             },
//             {
//                 name: "assetDesc",
//                 label: "Asset Description",
//                 type: "text",
//                 span: 3,
//                 // required: true
//             },
//             {
//                 name: "materialCode",
//                 label: "Material Code",
//                 type: "text",
//                 span: 2,
//                 // required: true
//             },
//             {
//                 name: "materialDesc",
//                 label: "Material Description",
//                 type: "text",
//                 span: 3,
//                 // required: true
//             },
//             {
//                 name: "uomId",
//                 label: "UOM",
//                 type: "text",
//                 span: 1,
//                 required: true
//             },
//             {
//                 name: "locatorId",
//                 label: "Locator",
//                 type: "select",
//                 options: locatorMaster,
//                 span: 2,
//                 required: true
//             },
//             {
//                 name: "unitPrice",
//                 label: "Unit Price",
//                 type: "text",
//                 required: true
//             },...(formData.isDepreciationDisabled ? [] : [{
//                 name: "depriciationRate",
//                 label: "Depreciation Rate",
//                 type: "text",
//                 required: true
//             }]),
//             {
//                 name: "bookValue",
//                 label: "Book Value",
//                 type: "text",
//                 required: true,
//                 disabled: true,
            
//             },
            
//             {
//                 name: "receivedQuantity",
//                 label: "Received Quantity",
//                 type: "text",
//                 required: true
//             },
//             {
//                 name: "acceptedQuantity",
//                 label: "Accepted Quantity",
//                 type: "text",
//                 required: true
//             },
//         ]
//     },
//     {
//         heading: "Custodian Details",
//         fieldList: [
//             {
//                 label: "Custodian Name",
//                 name: "indentorName",
//               //  disabled: true,
//                 type: "text"
//             }
//         ]
//     }
// ];

// export const igpGrnFields = [
//     {
//         heading: "Order Details",
//         colCnt: 5,
//         fieldList: [
//             {
//                 name: "grnType",
//                 label: "GRN Type",
//                 type: "select",
//                 required: true,
//                 options: [
//                     {
//                         value: "GI",
//                         label: "GI"
//                     },
//                     {
//                         value: "IGP",
//                         label: "IGP"
//                     }
//                 ],
//             },
//             {
//                 name: "giNo",
//                 label: "Enter Process No",
//                 type: "search",
//                 required: true,
//                 span: 2
//             },
//             {
//                 name: "grnNo",
//                 label: "GRN No",
//                 type: "search",
//              //   disabled: true,
//                 span: 2
//             },
//             {
//                 name: "grnDate",
//                 label: "GRN Date",
//                 type: "date",
//                 required: true
//             },
//             // {
//             //     name: "installationDate",
//             //     label: "Installation Date",
//             //     type: "date",
//             //     required: true
//             // },
//             // {
//             //     name: "commissioningDate",
//             //     label: "Commission Date",
//             //     type: "date",
//             //     required: true
//             // }
//         ]
//     },
//     {
//         heading: "Material Details",
//         name: "materialDtlList",
//         colCnt: 8,
//         children: [
//             {
//                 name: "assetId",
//                 label: "Asset ID",
//                 type: "text",
//                 span: 2,
//                 // required: true
//             },
//             {
//                 name: "assetDesc",
//                 label: "Asset Description",
//                 type: "text",
//                 span: 3,
//                 // required: true
//             },
//             {
//                 name: "materialCode",
//                 label: "Material Code",
//                 type: "text",
//                 span: 2,
//                 // required: true
//             },
//             {
//                 name: "materialDesc",
//                 label: "Material Description",
//                 type: "text",
//                 span: 3,
//                 // required: true
//             },
//             {
//                 name: "uomId",
//                 label: "UOM",
//                 type: "text",
//                 span: 1,
//                 required: true
//             },
//             {
//                 name: "locatorId",
//                 label: "Locator",
//                 type: "select",
//                 options: locatorMaster,
//                 span: 2,
//                 required: true
//             },
//             // {
//             //     name: "bookValue",
//             //     label: "Book Value",
//             //     type: "text",
//             //     required: true
//             // },
//             // {
//             //     name: "receivedQuantity",
//             //     label: "Received Quantity",
//             //     type: "text",
//             //     required: true
//             // },
//             {
//                 name: "acceptedQuantity",
//                 label: "Quantity",
//                 type: "text",
//                 required: true
//             },
//             // {
//             //     name: "depriciationRate",
//             //     label: "Depreciation Rate",
//             //     type: "text",
//             //     required: true
//             // }
//         ]
//     },
//     {
//         heading: "Custodian Details",
//         fieldList: [
//             {
//                 label: "Custodian Name",
//                 name: "indentorName",
//                 type: "text",
//                 disabled: true
//             }
//         ]
//     }
// ]