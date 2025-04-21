export const igpFields = [
    {
        heading: "IGP Details",
        colCnt: 5,
        fieldList: [
            {
                name: "ogpId",
                label: "OGP No",
                type: "search",
                span: 2,
                required: true
            },
            {
                name: "igpId",
                label: "IGP No",
                type: "text",
                disabled: true,
                span: 2,
                // required: true
            },
            {
                name: "igpDate",
                label: "IGP Date",
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
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 2,
                disabled: true,
                required: true
            }
        ]
    }
];
export const igpPoFields = [
    {
        heading: "IGP Details",
        colCnt: 5,
        fieldList: [
            {
                name: "ogpId",
                label: "OGP No",
                type: "search",
                span: 2,
                required: true
            },
            {
                name: "igpId",
                label: "IGP No",
                type: "text",
                disabled: true,
                span: 2,
                // required: true
            },
            {
                name: "igpDate",
                label: "IGP Date",
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
                disabled: true,
                required: true
            }
        ]
    }
];