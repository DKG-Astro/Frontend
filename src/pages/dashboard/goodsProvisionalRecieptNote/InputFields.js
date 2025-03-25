export const generalDtls = [
    {
        heading: "Purchase & Order Details", // optional
        colCnt: 5, // optional
        fieldList: [
            {
                name: "poId",
                label: "PO No.",
                type: "search",
                required: true
            },
            {
                name: "gprnNo", // required
                label: "GPRN No", // optional
                type:"text", // required
                disabled: true, //optional
                // required: true // option
            },
            {
                name: "date",
                label: "Date",
                type: "date",
                required: true
            },
            {
                name: "project",
                label: "Project",
                type: "text",
                required: true,
                span: 2 // optional
            }

        ]
    },
    {
        heading: "Vendor Details",
        colCnt: 10,
        fieldList: [
            {
                name: "vendorId",
                label: "Vendor ID",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "vendorEmail",
                label: "Vendor Email",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "vendorContactNo",
                label: "Vendor Contact",
                type: "text",
                span: 2,
                required: true
            }
        ]
    },
    {
        heading: "Delivery & Invoice Details",
        colCnt: 5,
        fieldList: [
            {
                name: "challanNo",
                label: "Challan/Invoice No.",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "deliveryDate",
                label: "Delivery Date",
                type: "date",
                required: true,
                span: 1
            },
            {
                name: "supplyExpectedDate",
                label: "Date of Supply",
                type: "date",
                required: true,
                span: 1
            },
            {
                name: "fieldStation",
                label: "Field Station",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "indentorName",
                label: "Indentor Name",
                type: "text",
                required: true,
                span: 2
            },
        ]
    },
    {
        heading: "Material Details",
        name: "materialDtlList",
        colCnt: 8,
        children: [
            {
                name: "materialCode",
                label: "Material Code",
                type: "text",
                span: 2,
                required: true,
                // disabled: true
            },
            {
                name: "materialDesc",
                label: "Description",
                type: "text",
                span: 3,
                required: true
            },
            {
                name: "uomId",
                label: "UOM",
                type: "text",
                span: 1,
                required: true,
                // disabled: true
            },
            {
                name: "warranty",
                label: "Warranty",
                type: "text",
                span: 2,
                required: true
            },
            {
                name: "orderedQuantity",
                label: "Ordered Quantity",
                type: "text",
                required: true,
                // disabled: true
            },
            {
                name: "quantityDelivered",
                label: "Quantity Delivered",
                type: "text",
                required: true
            },
            {
                name: "receivedQuantity",
                label: "Received Quantity",
                type: "text",
                required: true
            },
            {
                name: "unitPrice",
                label: "Unit Price",
                type: "text",
                required: true,
                // disabled: true
            },
            {
                name: "makeNo",
                label: "Make No.",
                type: "text",
                span: 2,
                required: true,
                // disabled: true
            },
            {
                name: "modelNo",
                label: "Model No.",
                type: "text",
                span: 2,
                required: true,
                // disabled: true
            },
            {
                name: "serialNo",
                label: "Serial No.",
                type: "text",
                span: 2,
                required: true,
                // disabled: true
            },
            {
                name: "note",
                label: "Note",
                type: "text",
                span: 5,
                required: true,
            },
            {
                name: "imageBase64",
                label: "Material Photograph",
                type: "image",
                span: 3,
                required: true,
                accept: "image/*"
            }
            // {
            //     name: "photographPath",
            //     label: "Photograph",
            //     type: "text",
            //     required: true
            // }
        ]
    },
    {
        heading: "Consignee & Warranty Information",
        colCnt: 3,
        fieldList: [
            {
                name: "consigneeDetail",
                label: "Consignee Details",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "warrantyYears",
                label: "Warranty Years",
                type: "text",
                required: true
            }
        ]
    },
    {
        heading: "Acceptance Details",
        colCnt: 4,
        fieldList: [
            // {
            //     name: "receivedQty",
            //     label: "Received Quantity",
            //     type: "text",
            //     required: true
            // },
            // {
            //     name: "pendingQty",
            //     label: "Pending Quantity",
            //     type: "text",
            //     required: true
            // },
            // {
            //     name: "acceptedQty",
            //     label: "Accepted Quantity",
            //     type: "text",
            //     required: true
            // },
            {
                name: "receivedBy",
                label: "Received By",
                type: "text",
                required: true
            }
        ]
    }
]

