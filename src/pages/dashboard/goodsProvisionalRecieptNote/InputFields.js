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
    }
]