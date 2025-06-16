
export const ogpFields = [
    {
        // heading: "OGP Details",
        colCnt: 4,
        fieldList: [
            {
                name: "ogpType",
                label: "OGP Type",
                type: "select",
                required: true,
                // span: 2,
                options: [
                    {
                        value: "Returnable",
                        label: "Returnable"
                    },
                    {
                        value: "Non Returnable",
                        label: "Non Returnable"
                    }
                ],
            },
            {
                name: "issueNoteId",
                label: "Process No",
                type: "search",
                // span: 2,
                required: true
            },
            {
                name: "ogpId",
                label: "OGP No",
                type: "text",
                disabled: true,
                // span: 2,
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
    },
    {
        heading: "Receiver and Sender Details",
        fieldList: [
            {
                name: "senderName",
                label: "Sender Name",
                type: "text",
                required: true,
                disabled: true
            },
            {
                name: "receiverName",
                label: "Receiver Name",
                type: "text",
                required: true,
            },
            {
                name: "receiverLocation",
                label: "Receiver Location",
                type: "text",
                required: true,
            },
            {
                name: "dateOfReturn",
                label: "Return Date",
                type: "date",
                // required: true,
            }
        ]
    }
];

export const ogpFieldsPo = [
    {
        // heading: "OGP Details",
        colCnt: 4,
        fieldList: [
            {
                name: "ogpType",
                label: "OGP Type",
                type: "select",
                required: true,
                // span: 2,
                options: [
                    {
                        value: "Returnable",
                        label: "Returnable"
                    },
                    {
                        value: "Non Returnable",
                        label: "Non Returnable"
                    }
                ],
            },
            {
                name: "issueNoteId",
                label: "Process No",
                type: "search",
                // span: 2,
                required: true
            },
            {
                name: "ogpId",
                label: "OGP No",
                type: "text",
                disabled: true,
                // span: 2,
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
    },
    {
        heading: "Receiver And Sender Details",
        fieldList: [
            {
                name: "senderName",
                label: "Sender Name",
                type: "text",
                required: true,
                disabled: true
            },
            {
                name: "receiverName",
                label: "Receiver Name",
                type: "text",
                required: true,
            },
            {
                name: "receiverLocation",
                label: "Receiver Location",
                type: "text",
                required: true,
            },
            {
                name: "dateOfReturn",
                label: "Return Date",
                type: "date",
                // required: true,
            }
        ]
    }
];