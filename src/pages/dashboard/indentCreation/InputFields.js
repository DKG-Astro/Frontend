export const IndentDetails = [
    {
        heading: "Indentor Details",
        colCnt: 4,
        fieldList: [
            {
                name: "indentorName",
                label: "Indentor Name",
                type: "text",
                required: true
            },
            {
                name: "indentorMobileNo",
                label: "Indentor Mobile No.",
                type: "text",
                required: true
            }, 
            {
                name: "indentorEmailId",
                label: "Indentor Email Id",
                type: "text", 
                required: true
            },
            {
                name: "consigneeLocation",
                label: "Consignee Location",
                type: "select",
                required: true,
                options: [
                    {
                        value: "1",
                        label: "Locator 1"
                    }, 
                    {
                        value: "2",
                        label: "Locator 2" 
                    },
                    {
                        value: "3",
                        label: "Locator 3"
                    },
                ]
            },
        ]
    },
    {
        heading: "materialDetails",
        label: "Material Details",
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
        ]
         
    }
]