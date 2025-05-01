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

  const { userName, email, mobileNumber, token, userId } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({});

  // ... existing code ...

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Fetch used indent IDs
        const tenderResponse = await axios.get("/api/tender-requests");
        const tenderData = tenderResponse.data;
        const allUsedIndents = (tenderData.responseData || []).flatMap(
          (tender) => tender.indentIds?.map(String) || []
        );
        setUsedIndentIds(new Set(allUsedIndents));

        // 2. Fetch approved indent IDs and full indent data
        // In the fetchAllData effect
        const [approvedResponse, indentsResponse] = await Promise.all([
          axios.get("/approved-indents"),
          axios.get("/api/indents"),
        ]);

        // Add debug logging for API responses
        console.log("Approved IDs response:", approvedResponse.data);
        console.log("All indents response:", indentsResponse.data);

        const approvedIds = approvedResponse.data?.responseData || [];
        const allIndents = indentsResponse.data?.responseData || [];

        // Add type coercion for comparison
        const filteredIndents = allIndents.filter((indent) => {
          const isApproved = approvedIds.some(
            (approvedId) => String(approvedId) === String(indent.indentId)
          );
          console.log(
            `Match check: ${approvedIds.join(",")} vs ${
              indent.indentId
            } -> ${isApproved}`
          );
          return isApproved;
        });

        console.log("Filtered approved indents:", filteredIndents);

        setApprovedIndents(filteredIndents.map((indent) => ({label: indent.indentId + ": " + indent.indentorName, value: indent.indentId})));

        // 3. Fetch consignee addresses
        const locationsResponse = await axios.get("/api/location-master");
        setConsigneeOptions(
          (locationsResponse.data.responseData || []).map((location) => ({
            value: location.locationCode,
            label: location.locationName,
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

  // Format options correctly
  const indentOptions = approvedIndents.map((indent) => ({
    value: indent.indentId,
    label: `Indent ${indent.indentId} (${indent.projectName})`,
  }));
  console.log("Indent Dropdown Options:", indentOptions);

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      const selectedIndents = formData.indentId;
      if (!selectedIndents || selectedIndents.length === 0) return;

      try {
        const res = await axios.get(`/api/indents/${selectedIndents[0]}`);
        const materials = res.data.responseData.materialDetails;

        // You can store them in state or inject into formData if needed
        console.log("Fetched materials:", materials);
      } catch (err) {
        console.error("Failed to fetch materials for indent", err);
      }
    };

    fetchMaterialDetails();
  }, [formData.indentId]);

  const handleIndentSearch = async (indentId) => {
    try {
      const res = await axios.get(`/api/indents/${indentId}`);
      const indentData = res.data?.responseData;

      if (indentData?.materialDetails) {
        setFormData((prev) => ({
          ...prev,
          materialDetails: indentData.materialDetails.map((material) => ({
            materialCode: material.materialCode,
            materialDescription: material.materialDescription,
            uom: material.uom,
            quantity: material.quantity,
            unitPrice: material.unitPrice,
            currency: material.currency,
            materialCategory: material.materialCategory,
            materialSubCategory: material.materialSubCategory,
          })),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch materials for indent", err);
      message.error("Failed to load indent materials");
    }
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "indentId") {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      handleIndentSearch(value[0]); // Assuming single select
      return;
    }
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

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
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const onFinish = async () => {
    const payload = {
      ...formData,
      createdBy: userId,
      lastUpdatedBy: userId,
    };

    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post("api/tenders", payload, {
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




  const TenderDetails = [
    {
      heading: "Tender Basic Details",
      colCnt: 4,
      fieldList: [
        {
          name: "title",
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
              type: "select", // or "select" if single-select
              required: true,
              options: approvedIndents, // This will be overridden dynamically
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
          options: [], // Will be populated from API data
          showSearch: true,
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
          filterOption: (input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase()),
          required: true,
        },
        {
          name: "uom",
          label: "UOM",
          type: "text",
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
          type: "text",
        },
        {
          name: "currency",
          label: "Currency",
          type: "text",
          required: true,
          span: 1,
          disabled: true,
        },
        {
          name: "budgetCode",
          label: "Budget Code",
          type: "select",
          required: true,
          span: 3,
          options: [],
        },
        {
          name: "totalPrice",
          label: "Total Price",
          type: "text",
          span: 2,
          disabled: true,
        },
        {
          name: "materialCategory",
          label: "Material Category",
          type: "text",
          span: 2,
        },
        {
          name: "materialSubCategory",
          label: "Material Sub Category",
          type: "text",
          span: 2,
        },
        {
          name: "modeOfProcurement",
          label: "Mode of Procurement",
          type: "select",
          span: 3,
          options: [],
        },
        {
          name: "vendorName",
          label: "Vendor Name",
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
          type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
          span: 1
        },
        {
          name: "uploadGeneralTermsAndConditions",
          label: "General Terms & Conditions",
          type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
          required: true,
          span: 1
        },
        {
          name: "uploadSpecificTermsAndConditions",
          label: "Specific Terms & Conditions",
          type: "image", //should be a multiple file upload field (.png, .jpeg, .pdf, .doc, etc. )
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
          name: "consigneeAddress",
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
          // defaultValue should be "Koramangala, 2nd Block, Bangalore -560034"
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
          type: "text",
          required: true,
          span: 1
        },
        {
          name: "ldClause",
          label: "LD Clause",
          type: "text",
          required: true,
          span: 1
        },
        {
          name: "applicablePerformance",
          label: "Performance Security",
          type: "text",
          required: true,
          span: 1
        }
      ]
    },
    {
      heading: "Declarations",
      colCnt: 2,
      fieldList: [
        {
          name: "bidSecurity",
          label: "Bid Security Declaration",
          type: "text", //should be a checkbox field (true or false)
          span: 1
        },
        {
          name: "mllStatusDeclaration",
          label: "MLL Status Declaration",
          type: "text", // should be a checkbox field (true or false)
          span: 1
        }
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
          setFormData
        )}

        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="tenderDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled={isPrintEnabled}
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
    </Card>
  );
};

export default Tender;
