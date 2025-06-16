export const isnFields = [
    {
        heading: "Issue Note Details",
        colCnt: 3,
        fieldList: [
            {
                name: "issueNoteNo",
                label: "Issue Note No",
                type: "text",
                disabled: true,
                // required: true
            },
            {
                name: "issueDate",
                label: "Issue Date",
                type: "date",
                required: true
            },
            // {
            //     name: "issueNoteType",
            //     label: "Type",
            //     type: "select",
            //     options: [
            //         {
            //             value: "Returnable",
            //             label: "Returnable"
            //         },
            //         {
            //             value: "Non Returnable",
            //             label: "Non Returnable"
            //         }
            //     ],
            // }
        ]
    },
    {
        heading: "Consignee Details",
        colCnt: 3,
        fieldList: [
            {
                name: "consigneeDetail",
                label: "Consignee Details",
                type: "text",
                // span: 2,
                required: true
            },
            {
                name: "indentorName",
                label: "Indentor Name",
                type: "text",
                // span: 2,
                required: true
            },
            {
                name: "fieldStation",
                label: "Field Station",
                type: "text",
                // span: 2,
                required: true
            }
        ]
    },
    {
        heading: "Material Details",
        name: "materialDtlList",
        colCnt: 8,
        children: [
            {
                name: "assetId",
                label: "Asset ID",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "assetDesc",
                label: "Asset Description",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "poId",
                label: "PO ID",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "locatorDesc",
                label: "Locator",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "quantity",
                label: "Quantity",
                type: "text",
                span: 1,
                required: true
            },
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 2,
                required: true
            }
        ]
    }
];