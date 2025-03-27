export const assetDisposalFields = [
    {
        heading: "Disposal Details",
        colCnt: 4,
        fieldList: [
            {
                name: "disposalDate",
                label: "Disposal Date",
                type: "date",
                span: 2,
                required: true
            },
            {
                name: "vendorId",
                label: "Vendor ID",
                type: "text",
                span: 2,
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
                name: "disposalQuantity",
                label: "Disposal Quantity",
                type: "text",
                span: 1,
                required: true
            },
            {
                name: "disposalCategory",
                label: "Disposal Category",
                type: "select",
                options: [
                    { value: "SCRAP", label: "Scrap" },
                    { value: "SALE", label: "Sale" },
                    { value: "DONATION", label: "Donation" }
                ],
                span: 1,
                required: true
            },
            {
                name: "disposalMode",
                label: "Disposal Mode",
                type: "select",
                options: [
                    { value: "AUCTION", label: "Auction" },
                    { value: "DIRECT_SALE", label: "Direct Sale" },
                    { value: "TENDER", label: "Tender" }
                ],
                span: 1,
                required: true
            },
            {
                name: "salesNoteFilename",
                label: "Sales Note",
                type: "image",
                span: 2,
                required: false
            },
            {
                name: "locatorId",
                label: "Locator ID",
                type: "text",
                disabled: true,
                span: 2,
                required: true
            }
        ]
    }
];