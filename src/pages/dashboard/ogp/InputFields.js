
export const ogpFields = [
    {
        heading: "OGP Details",
        colCnt: 5,
        fieldList: [
            {
                name: "issueNoteId",
                label: "Issue Note No",
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
                required: true
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