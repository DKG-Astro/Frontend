import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import CustomModal from "../../../components/CustomModal";
import { IndentDetails } from "./InputFields";

import dayjs from "dayjs";
import { modeOfProcurementList } from "../../../utils/Constants";

const { Option } = Select;

const Indent = () => {
  const printRef = useRef();
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [materialDescriptionMap, setMaterialDescriptionMap] = useState({});
  const [generatedIndentId, setGeneratedIndentId] = useState("");
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);

  // Redux selectors for user and location details
  const { userName, email, mobileNumber, token } = useSelector(
    (state) => state.auth
  );
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  // Data states for fetched data
  const [locations, setLocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});

  // Main form data state
  const [formData, setFormData] = useState({ materialDetails: [{}] });
  const [searchIndentId, setSearchIndentId] = useState("");
  const [materialOptions, setMaterialOptions] = useState([]);
  const [materialDescriptionOptions, setMaterialDescriptionOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Fetch Locations
  const populateInitialData = async () => {
    try {
      const [locationResponse, projectResponse, materialResponse] =
        await Promise.all([
          axios.get("/api/location-master"),
          axios.get("/api/project-master"),
          axios.get("/api/material-master"),
        ]);

      // Format options for dropdowns
      const formattedLocations = (
        locationResponse.data?.responseData || []
      ).map((location) => ({
        label: location.locationName,
        value: location.locationName,
      }));

      const formattedProjects = (projectResponse.data?.responseData || []).map(
        (project) => ({
          label: project.projectNameDescription,
          value: project.projectCode,
        })
      );

      const materials = materialResponse.data?.responseData || [];
      setMaterials(materials);
      const formattedMaterials = materials.map((material) => ({
        label: material.materialName,
        value: material.materialCode,
      }));
      const formattedMaterialDescriptions = materials.map((material) => ({
        label: material.description,
        value: material.description,
      }));
      

      const materialMap = {};
      materials.forEach((material) => {
        materialMap[material.materialCode] = {
          materialDescription: material.description,
          uom: material.uom,
          unitPrice: material.unitPrice,
          materialCategory: material.category,
          materialSubCategory: material.subCategory,
          currency: material.currency,
        };
      });
      const materialDescriptionMap = {};
      materials.forEach((material) => {
        materialDescriptionMap[material.description] = {
          materialCode: material.materialCode,
          uom: material.uom,
          unitPrice: material.unitPrice,
          materialCategory: material.category,
          materialSubCategory: material.subCategory,
          currency: material.currency,
        };
      });
      setMaterialDetailsMap(materialMap); // Already done
      setMaterialDescriptionMap(materialDescriptionMap); // NEW STATE
      setMaterialOptions(formattedMaterials);
      setMaterialDescriptionOptions(formattedMaterialDescriptions);

      // Set options in state
      setLocations(formattedLocations);
      setProjects(formattedProjects);
      //   setMaterialOptions(formattedMaterials);
    } catch (error) {
      console.error("Initial data load failed:", error);
      message.error("Failed to load initial form data");
    }
  };
  
  // Single useEffect to load all initial data
  useEffect(() => {
    populateInitialData();
  }, []);

  // Auto-populate indentor details from Redux on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      indentorName: userName,
      indentorEmailId: email,
      indentorMobileNo: mobileNumber,
    }));
  }, [userName, email, mobileNumber]);

  // --- Search Functionality ---
  const handleSearch = async () => {
    if (!searchIndentId) {
      message.error("Please enter an Indent ID to search");
      return;
    }
    try {
      const res = await axios.get(`api/indents/${searchIndentId}`);
      if (!res.data.responseData) {
        throw new Error("No data found for the provided Indent ID");
      }
      const data = res.data.responseData;
      const updatedData = {
        indentorName: data.indentorName,
        indentorMobileNo: data.indentorMobileNo,
        indentorEmailId: data.indentorEmailAddress,
        consigneeLocation: data.consignesLocation,
        projectName: data.projectName,
        preBidMeetingRequired: data.isPreBidMeetingRequired,
        preBidMeetingDetails: data.preBidMeetingDate
          ? dayjs(data.preBidMeetingDate, "DD/MM/YYYY")
          : null,
        preBidMeetingLocation: data.preBidMeetingVenue,
        rateContractIndent: data.isItARateContractIndent,
        periodOfRateContract: data.periodOfContract,
        singleOrMultipleJob: data.singleAndMultipleJob,
        uploadingPriorApprovalsFileName: data.uploadingPriorApprovalsFileName,
        technicalSpecificationsFileName: data.technicalSpecificationsFileName,
        draftEOIOrRFPFileName: data.draftEOIOrRFPFileName,
        uploadPACOrBrandPACFileName: data.uploadPACOrBrandPACFileName,
        materialDtlList: Array.isArray(data.materialDetails)
          ? data.materialDetails.map((item) => ({
              materialCode: item.materialCode,
              materialDesc: item.materialDescription,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: Number(item.quantity) * Number(item.unitPrice),
              uom: item.uom,
              budgetCode: item.budgetCode,
              materialCategory: item.materialCategory,
              materialSubCategory: item.materialSubCategory,
              modeOfProcurement: item.modeOfProcurement,
              vendorName: Array.isArray(item.vendorNames)
                ? item.vendorNames.join(", ")
                : item.vendorNames,
            }))
          : [{}],
      };
      setFormData(updatedData);
      message.success("Form data fetched successfully");
    } catch (error) {
      console.error("Search error:", error);
      message.error(`Failed to fetch form data: ${error.message}`);
    }
  };

  // --- handleChange Function ---
  const handleChange = async (name, value) => {
    if (Array.isArray(name)) {
      const [section, index, field] = name;

      if (section === "materialDetails") {
        const updatedMaterials = [...formData.materialDetails];

        // If field is materialCode, auto-fill other fields
        if (field === "materialCode") {
          const materialData = materialDetailsMap[value] || {};
          const quantity = updatedMaterials[index].quantity || 0;

          updatedMaterials[index] = {
            ...updatedMaterials[index],
            materialCode: value,
            materialDescription: materialData.materialDescription || "",
            materialCategory: materialData.materialCategory || "",
            materialSubCategory: materialData.materialSubCategory || "",
            uom: materialData.uom || "",
            unitPrice: materialData.unitPrice || 0,
            currency: materialData.currency || "",
            totalPrice: (materialData.unitPrice || 0) * quantity,
          };
        }

        else if (field === "materialDescription") {
            const materialData = materialDescriptionMap[value] || {};
            const quantity = updatedMaterials[index].quantity || 0;
          
            updatedMaterials[index] = {
              ...updatedMaterials[index],
              materialDescription: value,
              materialCode: materialData.materialCode || "",
              materialCategory: materialData.materialCategory || "",
              materialSubCategory: materialData.materialSubCategory || "",
              uom: materialData.uom || "",
              unitPrice: materialData.unitPrice || 0,
              currency: materialData.currency || "",
              totalPrice: (materialData.unitPrice || 0) * quantity,
            };
          }          

        // If field is quantity, update total price
        else if (field === "quantity") {
          const quantity = parseFloat(value || 0);
          const unitPrice = parseFloat(updatedMaterials[index].unitPrice || 0);

          updatedMaterials[index] = {
            ...updatedMaterials[index],
            quantity,
            totalPrice: unitPrice * quantity,
          };
        }

        // If field is unitPrice (user edits manually), recalculate total
        else if (field === "unitPrice") {
          const unitPrice = parseFloat(value || 0);
          const quantity = parseFloat(updatedMaterials[index].quantity || 0);

          updatedMaterials[index] = {
            ...updatedMaterials[index],
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
        }

        // All other fields
        else {
          updatedMaterials[index] = {
            ...updatedMaterials[index],
            [field]: value,
          };
        }

        setFormData((prev) => ({
          ...prev,
          materialDetails: updatedMaterials,
        }));
      }
    } else {
      // Top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- onFinish Function ---
  const onFinish = async () => {
    const payload = { ...formData, createdBy: actionPerformer };

    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post("/api/indents", payload);

      setFormData({
        ...formData,
        indentId: data?.responseData?.indentId,
      });

      localStorage.removeItem("indentDraft");
      setModalOpen(true);
    } catch (error) {
      let errorMessage = "Failed to submit indent";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.responseStatus &&
        error.response.data.responseStatus.message
      ) {
        errorMessage = error.response.data.responseStatus.message;
      } else if (error && error.message) {
        errorMessage = error.message;
      }
      console.error("Submission failed:", error);
      message.error(errorMessage);
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  // --- handleSearch Function ---
  const handleSearch = async (value) => {
    try {
      const { data } = await axios.get(
        `/api/indents/${value ? value : formData.indentId}`
      );

      setFormData({
        ...data?.responseData,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      message.error(
        error?.response?.data?.responseStatus?.message || "Error fetching data."
      );
    }
  };

  // --- Draft Saving and Loading ---
  useEffect(() => {
    const indentDraft = localStorage.getItem("indentDraft");
    if (indentDraft) {
      setFormData(JSON.parse(indentDraft));
      message.success("Form loaded from draft.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("indentDraft", JSON.stringify(formData));
  }, [formData]);

  // --- Printing Function ---
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // --- Populate Dropdowns on Mount ---
  useEffect(() => {
    populateDropdowns();
  }, []);

  // --- Prepare Hydrated Indent Details ---
  const hydratedIndentDetails = IndentDetails.map((section) => {
    if (section.fieldList) {
      return {
        ...section,
        fieldList: section.fieldList.map((field) => {
          if (field.name === "consignesLocation")
            return { ...field, options: locations };
          if (field.name === "projectName")
            return { ...field, options: projects };
          return field;
        }),
      };
    }
    if (section.children) {
      return {
        ...section,
        children: section.children.map((child) => {
          if (child.name === "materialCode")
            return { ...child, options: materialOptions };
          else if (child.name === "materialDescription")
            return {...child, options: materialDescriptionOptions };
          return child;
        }),
      };
    }
    return section;
  });
  // --- Auto Populate Indentor Information Based on Login Info--
  useEffect(() => {
    setFormData({
      ...formData,
      indentorEmailAddress: email,
      indentorMobileNo: mobileNumber,
      indentorName: userName,
    });
  }, []);

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Indent Creation" />
      {/* Search Section */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Form.Item name="indentId">
          <Input
            placeholder="Enter Indent ID to Search"
            style={{ width: 200, marginRight: 8 }}
            value={searchIndentId}
            onChange={(e) => setSearchIndentId(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
          />
        </Form.Item>
      </div>

      <CustomForm
        formData={formData}
        onFinish={onFinish}
        onFinishFailed={(errorInfo) => {
          console.error("Validation Failed:", errorInfo);
          message.error("Please check the required fields");
        }}
      >
        {renderFormFields(
  IndentDetails,
  (fieldName, value) => handleChange(fieldName, value),
  formData,
  "",
  null,  // Keep index as null
  setFormData,  // Proper position for setFormData
  null,  // No search handler needed here
  {  // New options parameter at correct position
    locations: locations,
    projects: projects,
    materials: materialOptions,
    uoms: uomOptions,
    materialCategories: [...new Set(Object.values(materialDetailsMap)
      .map(m => m.materialCategory))].map(c => ({value: c, label: c})),
    materialSubCategories: [...new Set(Object.values(materialDetailsMap)
      .map(m => m.materialSubCategory))].map(s => ({value: s, label: s})),
    procurementModes: [
      {value: "GEM", label: "GEM"},
      {value: "Brand PAC", label: "Brand PAC"},
      {value: "Proprietary/Single Tender", label: "Proprietary/Single Tender"}
    ]
  }
)}
        {/* Dynamic Material Details Section */}
        <div className="material-details-section">
          <Form.List name="materialDtlList">
            {(fields, { add }) => (
              <>
                {/* Place the Add Material button right below the heading */}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    setFormData((prev) => ({
                      ...prev,
                      materialDtlList: [...(prev.materialDtlList || []), {}],
                    }));
                  }}
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16, width: "150px" }}
                >
                  Add Material
                </Button>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{ position: "relative", marginBottom: 16 }}
                  >
                    {renderFormFields(
                      IndentDetails[1].children,
                      (fieldName, value) => {
                        if (fieldName[0] === "materialCode") {
                          handleMaterialSelect(index, value);
                        }
                        handleChange(
                          ["materialDtlList", index, ...fieldName],
                          value
                        );
                      },
                      formData.materialDtlList[index],
                      index
                    )}
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </div>
        <ButtonContainer
          onFinish={onFinish}
          formData={formData}
          draftDataName="indentDraft"
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
        title="Indent Submission Successful"
        processNo={formData?.indentId}
      />
    </Card>
  );
};

export default Indent;
