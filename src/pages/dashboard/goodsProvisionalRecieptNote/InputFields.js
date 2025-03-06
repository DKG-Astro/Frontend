export const generalDtls = [
    {
        heading: "Purchase & Order Details",
        colCnt: 5,
        fieldList: [
            {
                name: "gprnNo",
                label: "GPRN No",
                type:"text",
                disabled: true,
                required: true
            },
            {
                name: "poId",
                label: "PO No.",
                type: "text",
                required: true
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
                span: 2
            }

        ]
    },
    {
        heading: "Vendor Details",
        colCnt: 4,
        fieldList: [
            {
                name: "vendorId",
                label: "Vendor ID",
                type: "text",
                required: true
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                type: "text",
                required: true
            },
            {
                name: "vendorEmail",
                label: "Vendor Email",
                type: "text",
                required: true
            },
            {
                name: "vendorContactNo",
                label: "Vendor Contact No",
                type: "text",
                required: true
            }
        ]
    },
    {
        heading: "Delivery & Invoice Details",
        colCnt: 6,
        fieldList: [
            {
                name: "deliveryChallanNo",
                label: "Delivery Challan/Invoice No.",
                type: "text",
                required: true,
                span: 2
            },
            {
                name: "deliveryChallanDate",
                label: "Delivery Challan/Invoice Date",
                type: "date",
                required: true,
                span: 2
            },
            {
                name: "expectedSupplyDate",
                label: "Expected Date of Supply",
                type: "date",
                required: true,
                span: 2
            },
            {
                name: "fieldStation",
                label: "Field Station",
                type: "text",
                required: true,
                span: 3
            },
            {
                name: "indentorName",
                label: "Indentor Name",
                type: "text",
                required: true,
                span: 3
            },
        ]
    },
    {
        heading: "Material Details",
        name: "gprnMaterials",
        children: [
            {
                name: "materialCode",
                label: "Material Code",
                type: "text",
                required: true
            },
            {
                name: "description",
                label: "Description",
                type: "text",
                required: true
            },
            {
                name: "uom",
                label: "UOM",
                type: "text",
                required: true
            },
            {
                name: "orderedQuantity",
                label: "Ordered Quantity",
                type: "text",
                required: true
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
                required: true
            },
            {
                name: "makeNo",
                label: "Make No.",
                type: "text",
                required: true
            },
            {
                name: "modelNo",
                label: "Model No.",
                type: "text",
                required: true
            },
            {
                name: "serialNo",
                label: "Serial No.",
                type: "text",
                required: true
            },
            {
                name: "warranty",
                label: "Warranty",
                type: "text",
                required: true
            },
            {
                name: "note",
                label: "Note",
                type: "text",
                required: true
            },
            {
                name: "photographPath",
                label: "Photograph",
                type: "text",
                required: true
            }
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
        heading: "Quantity & Acceptance Details",
        colCnt: 4,
        fieldList: [
            {
                name: "receivedQty",
                label: "Received Quantity",
                type: "text",
                required: true
            },
            {
                name: "pendingQty",
                label: "Pending Quantity",
                type: "text",
                required: true
            },
            {
                name: "acceptedQty",
                label: "Accepted Quantity",
                type: "text",
                required: true
            },
            {
                name: "receivedBy",
                label: "Received By",
                type: "text",
                required: true
            }
        ]
    }
]

