import { locatorMaster } from "../grn/InputFields";

export const assetFields = [
    {
        heading: "Asset Details",
        colCnt: 6,
        fieldList: [
            {
                name: "assetId",
                label: "Asset ID",
                type: "search",
                span: 2,
               // disabled: true,
                // required: true
            },
            {
                name: "materialCode",
                label: "Material Code",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "materialDesc",
                label: "Material Description",
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
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 3,
                required: true
            }
        ]
    },
    {
        heading: "Technical Details",
        colCnt: 6,
        fieldList: [
            {
                name: "makeNo",
                label: "Make No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "modelNo",
                label: "Model No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "serialNo",
                label: "Serial No",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "componentName",
                label: "Component Name",
                type: "text",
                span: 3,
                required: false
            },
            {
                name: "componentId",
                label: "Component ID",
                type: "text",
                span: 3,
                required: false
            }
        ]
    },
    {
        heading: "Quantity and Price Details",
        colCnt: 6,
        fieldList: [
            {
                name: "initQuantity",
                label: "Initial Quantity",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "unitPrice",
                label: "Unit Price",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "stockLevels",
                label: "Stock Levels",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "depriciationRate",
                label: "Depreciation Rate",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "locatorId",
                label: "Locator",
                type: "select",
                options: locatorMaster,
                span: 2,
                required: true
            }
        ]
    },
    {
        heading: "Additional Details",
        colCnt: 6,
        fieldList: [
            {
                name: "endOfLife",
                label: "End of Life",
                type: "date",
                span: 2,
                required: true
            },
            {
                name: "shelfLife",
                label: "Shelf Life",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "conditionOfGoods",
                label: "Condition of Goods",
                type: "text",
                span: 2,
                required: true
            }
        ]
    }
];