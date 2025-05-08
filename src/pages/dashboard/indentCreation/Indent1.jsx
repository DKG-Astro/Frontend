import { Card, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Heading from '../../../components/DKG_Heading'
import { renderFormFields } from '../../../utils/CommonFunctions'
import CustomForm from '../../../components/DKG_CustomForm'
import ButtonContainer from '../../../components/ButtonContainer'
import { useReactToPrint } from 'react-to-print'
import axios from 'axios'
import CustomModal from '../../../components/CustomModal'

const proprietaryLimitedDeclarationLabel = "The budgetary quote was obtained informing the vendor about:  (i) IIA's Payment Terms - 100% payment within 30 days from acceptance (ii). Applicability of providing performance & warranty security. (iii) Applicability of LD Clause."

const modeOfProcurementOptions = [
    {
        label: "GEM",
        value: "GEM"
    },
    {
        label: "Brand PAC",
        value: "Brand PAC"
    },
    {
        label: "Proprietary/Single Tender",
        value: "Proprietary/Single Tender"
    },
    {
        label: "Limited Pre Approved Vendor Tender",
        value: "Limited Pre Approved Vendor Tender"
    },
    {
        label: "Open Tender",
        value: "Open Tender"
    },
    {
        label: "Global Tender",
        value: "Global Tender"
    }
];

const reasonDropdown = [
    {
        label:
            "It is in the knowledge of the user department that only a particular firm is the manufacturer of the required goods",
        value:
            "It is in the knowledge of the user department that only a particular firm is the manufacturer of the required goods",
    },
    {
        label:
            "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
        value:
            "In a case of emergency, the required goods are necessarily to be purchased from a particular source",
    },
    {
        label:
            "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
        value:
            "For standardization of machinery or spare parts to be compatible to the existing sets of equipment, the required item is to be purchased only from a selected firm",
    },
];

const Indent1 = () => {

    const { userName, mobileNumber, email, userId } = useSelector(state => state.auth)

    const printRef = useRef();

    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const [formData, setFormData] = useState({
        indentorName: userName,
        indentorMobileNo: mobileNumber,
        indentorEmailAddress: email,
        projectName: "",
        consignesLocation: "",
        materialDetails: [{}]
    })

    const { locationMaster, projectMaster, materialMaster, vendorMaster } = useSelector(state => state.masters)

    const [materialMasterState, setMaterialMasterState] = useState(materialMaster)

    const [selectedModeOfProcurement, setSelectedModeOfProcurement] = useState("")

    const locationDropdown = locationMaster.map((item) => {
        return {
            label: item.locationName,
            value: item.locationCode
        }
    })

    const projectDropdown = projectMaster.map((item) => {
        return {
            label: item.projectNameDescription,
            value: item.projectCode
        }
    })

    const vendorDropdown = vendorMaster.map((item) => {
        return {
            label: item.vendorName,
            value: item.vendorId
        }
    })

    const budgetCodeDropdown = [...new Set(projectMaster.map(p => p.budgetType))].map(bt => ({ label: bt, value: bt }))

    const [modalOpen, setModalOpen] = useState(false);

    const inputFields = [
        {
            heading: "Indentor Details",
            colCnt: 4,
            fieldList: [
                {
                    name: "indentId",
                    label: "Indent ID",
                    type: "text",
                    disabled: true,
                },
                {
                    name: "indentorName",
                    label: "Indentor Name",
                    type: "text",
                    required: true
                },
                {
                    name: "indentorMobileNo",
                    label: "Mobile No",
                    type: "text",
                    required: true
                },
                {
                    name: "indentorEmailAddress",
                    label: "Email",
                    type: "text",
                    required: true
                }
            ]
        },
        {
            heading: "Project and Location Details",
            fieldList: [
                {
                    name: "projectName",
                    label: "Project Name",
                    type: "select",
                    options: projectDropdown,
                    required: true
                },
                {
                    name: "consignesLocation",
                    label: "Consignee Location",
                    type: "select",
                    options: locationDropdown,
                    required: true
                }
            ]
        },
        {
            heading: "Material Details",
            addButton: true,
            name: "materialDetails",
            children: [
                {
                    name: "materialCode",
                    label: "Material Code",
                    type: "select",
                    required: true,
                    options: materialMasterState.map((item) => {
                        return {
                            label: item.materialCode + " - " + item.description,
                            value: item.materialCode
                        }
                    })
                },
                {
                    name: "materialDescription",
                    label: "Material Description",
                    type: "text",
                    span: 2,
                    required: true,
                    disabled: true
                },
                {
                    name: "materialCategory",
                    label: "Material Category",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "materialSubCategory",
                    label: "Material Sub Category",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "uom",
                    label: "UOM",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "quantity",
                    label: "Quantity",
                    type: "text",
                    required: true
                },
                {
                    name: "unitPrice",
                    label: "Unit Price inclusive of all taxes, duties and free door delivery",
                    type: "text",
                    required: true
                    // disabled: true
                },
                {
                    name: "currency",
                    label: "Currency",
                    type: "text",
                    required: true,
                    disabled: true
                },
                {
                    name: "modeOfProcurement",
                    label: "Mode of Procurement",
                    type: "select",
                    span: 2,
                    options: modeOfProcurementOptions,
                    required: true
                },
                {
                    name: "budgetCode",
                    label: "Budget Code",
                    type: "select",
                    options: budgetCodeDropdown,
                    required: true
                },
                {
                    name: "vendorNames",
                    label: "Vendor Names",
                    type: selectedModeOfProcurement === "Proprietary/Single Tender" ? "select" : "multiselect",
                    options: vendorDropdown,
                    span: 2,
                    disabled: selectedModeOfProcurement !== "Proprietary/Single Tender" && selectedModeOfProcurement !== "Limited Pre Approved Vendor Tender",
                }
            ]
        },
        {
            heading: "Document Uploads",
            colCnt: 2,
            fieldList: [
                {
                    name: "uploadingPriorApprovalsFileName",
                    label: "Upload Prior Approvals if any",
                    type: "multiImage",
                    
                },
                {
                    name: "technicalSpecificationsFileName",
                    label: "Upload Technical Specifications/ Budgetary Quote",
                    type: "multiImage",
                    
                },
                {
                    name: "draftEOIOrRFPFileName",
                    label: "Draft EOI/RFP",
                    type: "multiImage",
                    
                },
                {
                    name: "quarter",
                    label: "Quarter",
                    type: "select",
                    options: [
                        {
                            label: "Q1",
                            value: "Q1"
                        },
                        {
                            label: "Q2",
                            value: "Q2"
                        },
                        {
                            label: "Q3",
                            value: "Q3"
                        },
                        {
                            label: "Q4",
                            value: "Q4"
                        }
                    ]
                },
                {
                    name: "purpose",
                    label: "Purpose",
                    type: "text",
                    span: 2
                },
                ...(selectedModeOfProcurement === "Proprietary/Single Tender" ? [
                    {
                        name: "reason",
                        label: "Reason",
                        type: "select",
                        span: 2,
                        options: reasonDropdown,
                        required: true
                    },
                    {
                        name: "proprietaryJustification",
                        label: "Proprietary Justification",
                        type: "text",
                        span: 2,
                        required: true
                    }
                ] : []),
                ...((selectedModeOfProcurement === "Proprietary/Single Tender" || selectedModeOfProcurement === "Limited Pre Approved Vendor Tender") ? [
                    {
                        name: "proprietaryAndLimitedDeclaration",
                        label: proprietaryLimitedDeclarationLabel,
                        type: "text",
                        span: 2,
                        required: true

                    },
                    {
                        name: "proprietaryJustification",
                        label: "Proprietary Justification",
                        type: "text",
                        span: 2,
                        required: true
                    }
                ] : []),
                {
                    name: "buyBack",
                    type: "checkbox",
                    label: "Buy Back",
                    required: selectedModeOfProcurement === "Brand PAC"
                },
                ...(formData.buyBack ? [{
                    name: "uploadBuyBackFileNames",
                    label: "Upload Buy Back File",
                    type: "multiImage",
                    required: true
                },{
                    name: "modelNumber",
                    label: "Model Number",
                    type: "text",
                    required: true,
                },{
                    name: "serialNumber",
                    label: "Serial Number",
                    type: "text",
                    required: true,
                },{
                    name: "dateOfPurchase",
                    label: "Date Of Purchase",
                    type: "date",
                    required: true,
                }
            ] : []),
                {
                    name: "brandPac",
                    type: "checkbox",
                    label: "Is a Brand PAC?",
                },
                ...(formData.brandPac ? [{
                    name: "uploadPACOrBrandPACFileName",
                    label: "Upload PAC/Brand PAC File Name",
                    type: "multiImage",
                    required: true,
                }, {
                    name: "brandAndModel",
                    label: "Brand and Model",
                    type: "text",
                    required: true,
                },
                {
                    name: "justification",
                    label: "It is known that as per the Rule 144 of GFR, where in the Fundamental principles of public buying states that the description of the subject matter of procurement to the extent practicable should not indicate a requirement for a particular trade mark, trade name or brand. However in the subject requirement, it is required to prefer the above mentioned brand for the following reasons:",
                    type: "text",
                    placeholder: "Declaration",
                    required: true,
                    span: 2
                }
                ] : []),
                {
                    name: "isPreBidMeetingRequired",
                    type: "checkbox",
                    label: "Pre-Bid Meeting Required?",
                },
                ...(formData.isPreBidMeetingRequired ? [{
                    name: "preBidMeetingDate",
                    label: "Tentative Meeting Date",
                    type: "date",
                    required: true,
                }, {
                    name: "preBidMeetingVenue",
                    label: "Tentative Meeting Location",
                    type: "select",
                    required: true,
                    options: locationDropdown,
                    // required: true
                }
                ] : []),
                {
                    name: "isItARateContractIndent",
                    type: "checkbox",
                    label: "Is it a Rate Contract Indent",
                },
                ...(formData.isItARateContractIndent ? [
                    {
                        name: "estimatedRate",
                        label: "Estimated Rate",
                        type: "text",
                        required:true,
                    },
                    {
                        name: "periodOfContract",
                        label: "Contract Period (Months)",
                        type: "text",
                        required:true,
                    },
                    {
                        name: "singleAndMultipleJob",
                        label: "Job Type",
                        type: "select",
                        required:true,
                        options: [
                            {
                                label: "Single",
                                value: "Single"
                            },
                            {
                                label: "Multiple",
                                value: "Multiple"
                            }
                        ],
                    }
                ] : []),
            ].filter(Boolean),
        },
    ]

    useEffect(() => {
        if(selectedModeOfProcurement === "Brand PAC"){
            setFormData({
                ...formData,
                buyBack: true
            })
        }
    }, [selectedModeOfProcurement, formData])

    const replaceMaterial = (prevMaterial, newMaterial) => {
        const prevMtlrDtl = materialMaster.find((item) => item.materialCode === prevMaterial.materialCode)
       setMaterialMasterState(prev => {
           let newMaterialMaster = [...prev]
           newMaterialMaster = newMaterialMaster.filter((item) => item.materialCode !== newMaterial.materialCode)
           newMaterialMaster.push(prevMtlrDtl)
           return newMaterialMaster
       })
    }

    const handleChange = (fieldName, value) => {
        if (typeof fieldName === "string") {
            setFormData({
                ...formData,
                [fieldName]: value
            })

            return
        }

        const name = fieldName[2]
        const index = fieldName[1]

        if (name === "materialCode") {
            const prevMaterialCode = formData.materialDetails[index]?.materialCode || null;
            const material = materialMasterState.find((item) => item.materialCode === value)
            if(prevMaterialCode){
                replaceMaterial(formData.materialDetails[index], material)
            }
            else{
                handleMaterialSelect(material)
            }
            const { materialDetails } = formData;
            materialDetails[index].materialCode = value
            materialDetails[index].materialDescription = material.description
            materialDetails[index].materialCategory = material.category
            materialDetails[index].materialSubCategory = material.subCategory
            materialDetails[index].uom = material.uom
            materialDetails[index].quantity = ""
            materialDetails[index].unitPrice = material.unitPrice
            materialDetails[index].currency = material.currency

            setFormData({
                ...formData,
                materialDetails: materialDetails
            })
        }
        else if (name === "modeOfProcurement") {
            const { materialDetails } = formData;
            const updatedMaterialDetails = materialDetails.map(item => ({ ...item, modeOfProcurement: value }))

            setSelectedModeOfProcurement(value)

            setFormData({
                ...formData,
                materialDetails: updatedMaterialDetails
            })
        }
        else {
            const { materialDetails } = formData;
            materialDetails[index][name] = value
            setFormData({
                ...formData,
                materialDetails: materialDetails
            })
        }
    }

    const handleMaterialSelect = (material) => {
        console.log("MATERIAL SELECT :", materialMasterState)
        const { materialCode, category } = material
        const newMaterialMasterState = materialMasterState.filter((item) => {
            return item.category === category && item.materialCode !== materialCode
        })
        setMaterialMasterState(newMaterialMasterState)
    }

    const handleMaterialDeselect = (index) => {
        const { materialDetails } = formData;
        const material = materialDetails[index]

        if (material.materialCode) {
            if(formData.materialDetails.length === 1){
                setMaterialMasterState(materialMaster)
            }
            else{
                const newMaterialDtl = materialMaster.find((item) => item.materialCode === material.materialCode)
                const newMaterialMasterState = [...materialMasterState, newMaterialDtl]
                setMaterialMasterState(newMaterialMasterState)
            }
        }
    }
    console.log("Material state", materialMasterState)

    const onFinish = async () => {
        if (selectedModeOfProcurement === "Limited Pre Approved Vendor Tender") {
            let minFourVendorSelected = true;

            formData.materialDetails.forEach((item, index) => {
                if (item.vendorNames.length < 4) {
                    message.error("Atleast 4 vendors should be selected for Limited Pre Approved Vendor Tender.")
                    minFourVendorSelected = false;
                    return;
                }
            })

            if (!minFourVendorSelected) {
                return;
            }

        }
        const payload = {
            ...formData,
            fileType: "Indent",
            uploadBuyBackFileNames: formData.buyBack ? formData.uploadBuyBackFileNames : null,
            uploadPACOrBrandPACFileName: formData.brandPac ? formData.uploadPACOrBrandPACFileName : null,
            brandAndModel: formData.brandPac ? formData.brandAndModel : null,
            preBidMeetingDate: formData.isPreBidMeetingRequired ? formData.preBidMeetingDate : null,
            preBidMeetingVenue: formData.isPreBidMeetingRequired ? formData.preBidMeetingVenue : null,
            estimatedRate: formData.isItARateContractIndent ? formData.estimatedRate : null,
            periodOfContract: formData.isItARateContractIndent ? formData.periodOfContract : null,
            singleAndMultipleJob: formData.isItARateContractIndent ? formData.singleAndMultipleJob : null,
            justification: formData.brandPac ? formData.justification : null,
            reason: selectedModeOfProcurement === "Proprietary/Single Tender" ? formData.reason : null,
            proprietaryJustification: selectedModeOfProcurement === "Proprietary/Single Tender" ? formData.proprietaryJustification : null,
            createdBy: userId,
        }

        try {
            setSubmitBtnLoading(true)
            const { data } = await axios.post("/api/indents", payload)
            setFormData({
                ...formData,
                indentId: data?.responseData?.indentId
            })
            setModalOpen(true)
        }
        catch (error) {
            console.log(error)
            message.error(error.message || "Error submitting indent.")
        }
        finally {
            setSubmitBtnLoading(false)
        }
    }

    const addMaterialFunc = () => {
        setFormData({
            ...formData,
            materialDetails: [...formData.materialDetails, {}]
        })
    }
    const additionalFunc = {
        "addMaterialSection": addMaterialFunc,
        "materialDeselect": (index) => handleMaterialDeselect(index)
    }

    return (
        <Card className='a4-container' ref={printRef}>
            <Heading title="Indent Creation" />
            <CustomForm formData={formData} onFinish={onFinish}>
                {renderFormFields(inputFields, handleChange, formData, "", null, setFormData, null, additionalFunc)}
                <ButtonContainer
                    onFinish={onFinish}
                    formData={formData}
                    draftDataName="indentDraft"
                    submitBtnLoading={submitBtnLoading}
                    submitBtnEnabled
                    printBtnEnabled
                    draftBtnEnabled
                    handlePrint={handlePrint}
                />
            </CustomForm>
            <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen} title="Indent" processNo={formData?.indentId} />
        </Card>
    )
}

export default Indent1
