
export const ogpFields = [
    {
        // heading: "OGP Details",
        colCnt: 5,
        fieldList: [
            // {
            //     name: "type",
            //     label: "Type",
            //     type: "select",
            //     required: true,
            //     options: [
            //         {
            //             value: "Goods Issue",
            //             label: "Goods Issue"
            //         },
            //         {
            //             value: "PO",
            //             label: "PO"
            //         }
            //     ],
            // },
            {
                name: "issueNoteId",
                label: "Process No",
                type: "search",
                span: 2,
                required: true
            },
            {
                name: "ogpId",
                label: "OGP No",
                type: "text",
                disabled: true,
                span: 2,
                // required: true
            },
            {
                name: "ogpDate",
                label: "OGP Date",
                type: "date",
                required: true
            }
        ]
    },
    {
        heading: "Material Details",
        name: "materialDtlList",
        colCnt: 6,
        children: [
            {
                name: "assetId",
                label: "Asset ID",
                type: "text",
                span: 1,
                disabled: true,
                required: true
            },
            {
                name: "assetDesc",
                label: "Asset Description",
                type: "text",
                span: 2,
                disabled: true,
                required: true
            },
            {
                name: "locatorDesc",
                label: "Locator",
                type: "text",
                span: 2,
                disabled: true,
                required: true
            },
            {
                name: "quantity",
                label: "Quantity",
                type: "text",
                span: 1,
                required: true
            },
        ]
    }
];

export const ogpFieldsPo = [
    {
        // heading: "OGP Details",
        colCnt: 5,
        fieldList: [
            // {
            //     name: "type",
            //     label: "Type",
            //     type: "select",
            //     required: true,
            //     options: [
            //         {
            //             value: "Goods Issue",
            //             label: "Goods Issue"
            //         },
            //         {
            //             value: "PO",
            //             label: "PO"
            //         }
            //     ],
            // },
            {
                name: "issueNoteId",
                label: "Process No",
                type: "search",
                span: 2,
                required: true
            },
            {
                name: "ogpId",
                label: "OGP No",
                type: "text",
                disabled: true,
                span: 2,
                // required: true
            },
            {
                name: "ogpDate",
                label: "OGP Date",
                type: "date",
                required: true
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
                span: 1,
                disabled: true,
                required: true
            },
            {
                name: "materialDescription",
                label: "Material Description",
                type: "text",
                span: 2,
                disabled: true,
                required: true
            },
            // {
            //     name: "locatorDesc",
            //     label: "Locator",
            //     type: "text",
            //     span: 2,
            //     disabled: true,
            //     required: true
            // },
            {
                name: "quantity",
                label: "Quantity",
                type: "text",
                span: 1,
                required: true
            },
            {
                name: "uom",
                label: "UOM",
                type: "text",
                span: 1,
                required: true
            },
        ]
    }
];