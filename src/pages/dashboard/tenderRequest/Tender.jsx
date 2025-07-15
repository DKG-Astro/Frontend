import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
import { SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import CustomModal from "../../../components/CustomModal";
import { TenderDetails } from "./InputFields";
import { multiply } from "lodash";
import { useLocation } from "react-router-dom";
import TenderPrintFormat from "../../../utils/TenderPrintFormat";

const { Option } = Select;

const Tender = () => {
  const printRef = useRef();
  const [form] = Form.useForm();

  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [generatedTenderId, setGeneratedTenderId] = useState("");
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTenderId, setSearchTenderId] = useState("");
  const [usedIndentIds, setUsedIndentIds] = useState(new Set());
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvedIndents, setApprovedIndents] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [materialDescOptions, setMaterialDescOptions] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const [tenderIdOptions,setTenderIdOptions] = useState([]);


  const { userName, email, mobileNumber, token, userId } = useSelector(
    (state) => state.auth
  );

   const location = useLocation();
        const { tenderId, indentIds } = location.state || {};
    
        console.log("Tender ID:", tenderId); 
  //const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState({
    indentId: [],  
    materialDetails: [],
    billingAddress: "Koramangala, 2nd Block, Bangalore -560034",

  });
  useEffect(() => {
  const fetchTenderIds = async () => {
    try {
      const res = await axios.get("/getApprovedTenderIdForPOAndSO");
      const tenderList = res.data?.responseData || [];

      // Format for dropdown
      const tenderOptions = tenderList.map((id) => ({
        label: id,
        value: id,
      }));

      // Store in state and use in TenderId field options
      setTenderIdOptions(tenderOptions);
    } catch (err) {
      console.error("Failed to fetch tender IDs", err);
    }
  };

  fetchTenderIds();
}, []);

  
  
  useEffect(() => {
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch approved indents first
      const approvedResponse = await axios.get("/approved-indents");
      ;

      // Fetch locations
      const locationsResponse = await axios.get("/api/location-master");
      setConsigneeOptions(
        (locationsResponse.data.responseData || []).map((location) => ({
          value: location.locationCode,
          label: location.locationName,
        }))
      );

      // Set approved indents as options for the dropdown
      const approvedIds = approvedResponse.data?.responseData || [];
     /*setApprovedIndents(
        (approvedIds || [])
          .filter(indent => indent.indentId && indent.projectName)
          .map(indent => ({
            label: `${indent.indentId} - ${indent.projectName}`,
            value: indent.indentId,
            projectName: indent.projectName,
          }))*/
            setApprovedIndents(
              approvedIds.map((indent) => ({
                label: `${indent.indentId} - ${indent.projectName || ""}`,
                value: indent.indentId,
                projectName: indent.projectName,
              }))
      );
     
       
      
    } catch (error) {
      message.error("Failed to load dropdown data");
      console.error("Dropdown fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);

  
 
  // Now, your indentOptions will use the updated project names:
  const indentOptions = approvedIndents.map((indent) => ({
    value: indent.indentId,
    label: `Indent ${indent.indentId} (${indent.projectName})`,
  }));

  
  ;
  
  const formatMaterial = (material) => ({
    materialCode: material.materialCode,
    materialDescription: material.materialDescription,
    quantity: material.quantity,
    unitPrice: material.unitPrice,
    uom: material.uom,
    budgetCode: material.budgetCode,
    totalPrice: material.totalPrice,
    materialCategory: material.materialCategory,
   // currency: material.currency,
    materialSubCategory: material.materialSubCategory,
    modeOfProcurement: material.modeOfProcurement,
    vendorNames: material.vendorNames,
  });
 
  
  const handleIndentSearch = async (indentIds) => {
    try {
      const allMaterials = [];
  
      // Loop through all selected indent IDs
      for (const id of indentIds) {
        const res = await axios.get(`/api/indents/${id}`);
        const indentData = res.data?.responseData;
  
        if (indentData?.materialDetails) {
          allMaterials.push(...indentData.materialDetails);
        }
       
      }
      
  
      const formattedMaterials = allMaterials.map((material) => ({
        materialCode: material.materialCode,
        materialDescription: material.materialDescription,
        uom: material.uom,
        quantity: material.quantity,
        unitPrice: material.unitPrice,
       // currency: material.currency,
        materialCategory: material.materialCategory,
        materialSubCategory: material.materialSubCategory,
        budgetCode: material.budgetCode,
        totalPrice: material.totalPrice,
        modeOfProcurement: material.modeOfProcurement,
        vendorNames: material.vendorNames,
      }));
  
      // Update formData with the fetched material details
      setFormData((prev) => ({
        ...prev,
        materialDetails: formattedMaterials,
      }));
  
      form.setFieldsValue({ materialDetails: formattedMaterials });
  
    } catch (err) {
      console.error("Failed to fetch materials for indent", err);
      message.error("Failed to load indent materials");
    }
  };
  
  
  /*
  const handleChange = (fieldName, value) => {
    if (fieldName === "indentId") {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      handleIndentSearch(value); // value is now an array, it should be passed directly
      return;
    }
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };*/
  const handleChange = (fieldName, value) => {
    if (fieldName === "tenderId") {
        handleSearch(value);
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
      return;
    }
    if (fieldName === "indentId") {
      const selectedIndents = approvedIndents.filter(indent =>
        value.includes(indent.value)
      );
  
      const projectNames = [...new Set(selectedIndents.map(i => i.projectName))];
  
      if (projectNames.length > 1) {
        message.error("All selected indents must be under the same project");
        return;
      }
  
      if (!selectedProjectName || projectNames[0] === selectedProjectName) {
        setSelectedProjectName(projectNames[0]);
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        handleIndentSearch(value);
      } else {
        message.error(`Selected indent belongs to a different project: ${projectNames[0]}`);
      }
  
      return;
    }
  
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  

  
  /*
  const handleSearch = async () => {
    if (!searchTenderId) {
      message.error("Please enter a Tender ID");
      return;
    }
    try {
      const res = await axios.get(`api/tenders/${searchTenderId}`);
      if (res.data.responseData) {
        setFormData(res.data.responseData);
        message.success("Tender details loaded successfully");
      }
    } catch (error) {
      message.error("Failed to fetch tender details");
      console.error("Search error:", error);
    }
  };*/
  const handleSearch = async (value) => {
  try {
    const { data } = await axios.get(
      `/api/tender-requests/base64Files/${value || formData.tenderId}`
    );

    const responseData = data?.responseData || {};

    const indentIds = Array.isArray(responseData.indentIds)
      ? responseData.indentIds
      : responseData.indentIds
      ? [responseData.indentIds]
      : [];

    // Directly use projectName from response
    const formattedIndentIds = indentIds.map((id) => ({
      value: id,
      label: `Indent ${id} (${responseData.projectName || ""})`,
    }));

    setSelectedProjectName(responseData.projectName);

    setFormData((prev) => ({
      ...prev,
      ...responseData,
      indentId: indentIds,
    }));

    form.setFieldsValue({
      ...responseData,
      indentId: formattedIndentIds,
    });

    if (indentIds.length) {
      await handleIndentSearch(indentIds);
    }
  } catch (error) {
    console.error("Search error:", error);
    message.error(
      error?.response?.data?.responseStatus?.message || "Error fetching tender data."
    );
  }
};

  useEffect(() => {
      if (tenderId) {
          handleSearch(tenderId); 
      }else if (indentIds?.length) {
        handleChange("indentId", indentIds); 
      }
      }, [tenderId, indentIds]);


/*
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });*/
     const printComponentRef = useRef(); 
  
      const handlePrint = useReactToPrint({
          content: () => printComponentRef.current,
          documentTitle: `Tender - ${formData?.tenderId || "Draft"}`
      });
/*
  const onFinish = async () => {
    const { materialDetails, indentMaterials, ...filteredData } = formData;
  
    const payload = {
      ...filteredData,
      createdBy: userId,
      lastUpdatedBy: userId,
      fileType:"Tender",
    };
  
    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post("/api/tender-requests", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (data?.responseData?.tenderId) {
        setGeneratedTenderId(data.responseData.tenderId);
        setIsPrintEnabled(true);
        setModalOpen(true);
        message.success("Tender created successfully!");
      }
    } catch (error) {
      message.error("Failed to submit tender");
      console.error("Submission error:", error);
    } finally {
      setSubmitBtnLoading(false);
    }
  };
  */
  const onFinish = async () => {
  try {
    setSubmitBtnLoading(true);

    const payload = {
      ...formData,
      createdBy: userId,
      lastUpdatedBy: userId,
      fileType: "Tender",
      materialDetails: (formData.materialDetails || []).map((m) => ({
        materialCode: m.materialCode || "",
        materialDescription: m.materialDescription || "",
        uom: m.uom || "",
        quantity: Number(m.quantity) || 0,
        unitPrice: Number(m.unitPrice) || 0,
        materialCategory: m.materialCategory || "",
        materialSubCategory: m.materialSubCategory || "",
        budgetCode: m.budgetCode || "",
        totalPrice: Number(m.totalPrice) || 0,
        modeOfProcurement: m.modeOfProcurement || "",
        vendorNames: m.vendorNames || "",
      })),
    };

    let data;

    if (tenderId) {
      // Update
      const response = await axios.put(`/api/tender-requests/${tenderId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data = response.data;
      message.success("Tender updated successfully");
    } else {
      //Create
      const response = await axios.post("/api/tender-requests", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data = response.data;
      message.success("Tender created successfully");
    }

    if (data?.responseData?.tenderId) {
      setGeneratedTenderId(data.responseData.tenderId);
      setIsPrintEnabled(true);
      setModalOpen(true);
    }
  } catch (error) {
    message.error("Failed to submit tender");
    console.error("Tender submit error:", error);
  } finally {
    setSubmitBtnLoading(false);
  }
};
 const handleSearchTenderIds = async () => {
  const { searchType, searchValue } = formData;

  if (!searchValue || !searchType) {
    message.warning("Please select search type and enter value.");
    return;
  }

  try {
    const { data } = await axios.get(`/api/tender-requests/search`, {
      params: {
        type: searchType,
        value: searchValue
      }
    });

    const tenderList = data?.responseData || [];

    const dropdownOptions = tenderList.map((item) => ({
      label: item.tenderId,
      value: item.tenderId
    }));

    setTenderIdOptions(dropdownOptions);

    if (dropdownOptions.length === 0) {
      message.warning("No Tender IDs found.");
    } else {
      message.success(`${dropdownOptions.length} Please Select Tender Id in Tender Id Drop Down.`);
    }
  } catch (error) {
    message.error("Error fetching Tender IDs.");
  }
};






  const TenderDetails = [
      {
            heading: "Search Indent",
            colCnt: 2,
            fieldList: [
        {
            name: "searchValue",
            label: "Search Value",
            type: "indentSearch",
            onSearch: () => handleSearchTenderIds(),
      // formData.searchType === "submittedDate" ? "date" : "text"
        },
    ]
    },
    {
      heading: "Tender Search",
      colCnt: 1,
      fieldList: [{
        name: "tenderId",
        label: "Tender Id",
        //type: "search",
        type: "select",
        options: tenderIdOptions || [],
        span: 1
      }]
    },
    {
      heading: "Tender Basic Details",
      colCnt: 4,
      fieldList: [
        {
          name: "titleOfTender",
          label: "Title of the Tender",
          type: "text",
          required: true,
          span: 2
        },
        {
          name: "openingDate",
          label: "Start Date",
          type: "date",
          required: true,
          span: 1
        },
        {
          name: "closingDate",
          label: "Closing Date",
          type: "date",
          required: true,
          span: 1
        },
      ]
    },
    {
      heading: "Indent Selection",
      colCnt: 2,
      fieldList: [
          {
              name: "indentId",
              label: "Select Indent ID",
              type: "multiselect", // or "select" if single-select
              mode: "multiple",
              required: true,
              options: approvedIndents, // This will be overridden dynamically
              onChange: (val) => handleChange("indentId", val), 
            },          
      ]
    },
    {
      heading: "Material Details",
      name: "materialDetails",
      colCnt: 8,
      children: [
        // Update materialCode field options to be populated dynamically
        {
          name: "materialCode",
          label: "Material Code",
          type: "select",
          span: 2,
          required: true,
        //  options: [], // Will be populated from API data
          showSearch: true,
          disabled: true,
          filterOption: (input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase()),
        },
  
        // Update description field to show API data
        {
          name: "materialDescription",
          label: "Description",
          type: "select",
          span: 3,
          options: [], // Will be populated from API data
          showSearch: true,
          disabled: true,
          filterOption: (input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase()),
          required: true,
        },
        {
          name: "uom",
          label: "UOM",
          type: "text",
          disabled: true,
          required: true,
          disabled: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "text",
        },
        {
          name: "unitPrice",
          label: "Unit Price",
          disabled: true,
          type: "text",
          span:1
        },
       /* {
          name: "currency",
          label: "Currency",
          disabled: true,
          type: "text",
          required: true,
          span: 1,
          disabled: true,
        }*/,
        {
          name: "budgetCode",
          label: "Budget Code",
          type: "select",
         // required: true,
         // disabled: true,
          span: 2,
          options: [],
        },
        {
          name: "totalPrice",
          label: "Total Price",
          type: "text",
          disabled: true,
          span: 2,
          disabled: true,
        },
        {
          name: "materialCategory",
          label: "Material Category",
          type: "text",
          disabled: true,
          span: 2,
        },
        {
          name: "materialSubCategory",
          label: "Material Sub Category",
          type: "text",
          disabled: true,
          span: 2,
        },
        {
          name: "modeOfProcurement",
          label: "Mode of Procurement",
          type: "select",
          disabled: true,
          span: 3,
          options: [],
        },
        {
          name: "vendorNames",
          label: "Vendor Codes",
          disabled: true,
          type: "text",
          span: 2,
          // required: true,
        },
      ],
    },
    {
      heading: "Tender Attachments",
      colCnt: 3,
      fieldList: [
        {
          name: "uploadTenderDocuments",
          label: "Tender Documents",
         // type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
          type: "multiImage",
          span: 1
        },
        {
          name: "uploadGeneralTermsAndConditions",
          label: "General Terms & Conditions",
        //  type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
          type: "multiImage",
          required: true,
          span: 1
        },
        {
          name: "uploadSpecificTermsAndConditions",
          label: "Specific Terms & Conditions",
          //type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
          type: "multiImage",
          span: 1
        }
      ]
    },
    {
      heading: "Submission Details",
      colCnt: 3,
      fieldList: [
        {
          name: "bidType",
          label: "Bid Type",
          type: "select",
          required: true,
          span: 1,
          options: [
            { value: "Single", label: "Single Bid" },
            { value: "Double", label: "Two Bid" }
          ] 
        },
       /* {
          name: "lastDate",
          label: "Last Date of Submission",
          type: "date",
          required: true,
          span: 1
        },*/
      /*  {
          name: "applicableTaxes",
          label: "Applicable Taxes",
          type: "text",
        //  required: true,
          span: 1
        }*/
      ]
    },
    {
      heading: "Commercial Terms",
      colCnt: 3,
      fieldList: [
        {
          name: "incoTerms",
          label: "INCO Terms",
          type: "text",
          required: true,
          span: 1
        },
        {
          name: "consignes",
          label: "Consignee Address",
          type: "select",
          required: true,
          options: consigneeOptions, // will be overridden
        },
        {
          name: "billingAddress",
          label: "Billing Address",
          type: "text",
          required: true,
          span: 1,
          disabled:true,
          //defaultValue:"Koramangala, 2nd Block, Bangalore -560034"
        }
      ]
    },
    {
      heading: "Payment & Performance",
      colCnt: 3,
      fieldList: [
        {
          name: "paymentTerms",
          label: "Payment Terms",
          type: "select",
          required: true,
          span: 2,
           options: [
            { value: "100% payment within 30 days from the date of acceptance.", label: "100% payment within 30 days from the date of acceptance." },
            { value: "Quarterly in advance on submission of invoice (in case of AMCs)", label: "Quarterly in advance on submission of invoice (in case of AMCs)" }
          ] 
        },
        {
          name: "ldClause",
          label: "LD Clause",
          type: "text",
          required: true,
          span: 1
        },
       /* {
          name: "applicablePerformance",
          label: "Performance Security",
          type: "text",
          required: true,
          span: 1
        }*/
      ]
    },
    {
      heading: "Declarations",
      colCnt: 2,
      fieldList: [
        {
          name: "bidSecurityDeclaration",
          label: "Bid Security Declaration",
          type: "checkbox", //should be a checkbox field (true or false)
          span: 1
        },
        ...(formData.bidSecurityDeclaration ? [/*{
          name: "bidSecurityDownload",
          type: "downloadFile",
          fileName: "bid.pdf",
          downloadText: "Download Bid Security Template",
          required: true,
          span: 2,
          },*/{
                    name: "bidSecurityDeclarationFileName",
                    label: "Upload Bid Security Declaration",
                    type: "multiImage",
                    required: true,
                }] : []),
        {
          name: "mllStatusDeclaration",
          label: "MII Status Declaration",
          type: "checkbox", // should be a checkbox field (true or false)
          span: 1
        },
        ...(formData.mllStatusDeclaration ? [/*{
          name: "mllStatusDeclaration",
          type: "downloadFile",
          fileName: "mll.pdf",
          downloadText: "Download Mll Security Template",
          required: true,
          span: 2,
          },*/{
                    name: "mllStatusDeclarationFileName",
                    label: "Upload MII Security Declaration",
                    type: "multiImage",
                    required: true,
                }] : []),
        
      ]
    }
  ];
  
 


  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Tender Creation" />

      {/* Form Start */}
      <CustomForm
        formData={formData}
        onFinish={onFinish}
        onFinishFailed={() => message.error("Please check required fields")}
      >
        {renderFormFields(
          TenderDetails,
          handleChange,
          formData,
          "",
          null,
          setFormData,
          handleSearch
        )}

        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="tenderDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
         // printBtnEnabled={isPrintEnabled}
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>

      <CustomModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Tender Submission Successful"
        processNo={generatedTenderId}
      />
      <div style={{ display: "none" }}>
                <TenderPrintFormat ref={printComponentRef} data={formData} />
      </div>
    </Card>
  );
};

export default Tender;
