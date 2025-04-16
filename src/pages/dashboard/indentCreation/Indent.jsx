import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Form, Input, Select, DatePicker, message } from "antd";
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

const { Option } = Select;

const Indent = () => {
  const printRef = useRef();
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [generatedIndentId, setGeneratedIndentId] = useState("");
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);

  // Redux selectors for user and location details
  const { userName, email, mobileNumber, token, userId, locationId } =
    useSelector((state) => state.auth);

  // Data states for fetched data
  const [locations, setLocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});


  // Main form data state
  const [formData, setFormData] = useState({ materialDtlList: [{}] });
  const [searchIndentId, setSearchIndentId] = useState("");
  const [materialOptions, setMaterialOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);


  // --- Dynamic Field Population ---
  const populateDropdowns = async () => {
    try {
      const [
        locationResponse,
        projectResponse,
        materialResponse,
        uomResponse,
      ] = await Promise.all([
        axios.get("/api/location-master"),
        axios.get("/api/project-master"),
        axios.get("/api/material-master"),
        axios.get("/api/uom-master"),
      ]);


      // Format options for dropdowns
      const formattedLocations = (
        locationResponse.data?.responseData || []
      ).map((location) => ({
        label: location.locationName,
        value: location.locationCode,
      }));


      const formattedProjects = (projectResponse.data?.responseData || []).map(
        (project) => ({
          label: project.projectNameDescription,
          value: project.projectCode,
          budgetType: project.budgetType, // Store budgetType
        })
      );


      const formattedMaterials = (
        materialResponse.data?.responseData || []
      ).map((material) => ({
        label: material.materialName,
        value: material.materialCode,
      }));


      const uomData = uomResponse.data?.responseData || [];
      const formattedUOMs = uomData.map(uom => ({
        value: uom.uomCode,
        label: uom.uomName
      }));

      // Set options in state
      setLocations(formattedLocations);
      setProjects(formattedProjects);
      setMaterialOptions(formattedMaterials);
      setUomOptions(formattedUOMs);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      message.error(
        error?.response?.data?.responseStatus?.message ||
          "Failed to fetch dropdown data."
      );
    }
  };


  // --- handleChange Function ---
  const handleChange = async (fieldName, value) => {
    if (typeof fieldName === "string") {
      // Handle Material Code selection
      if (fieldName === "materialCode") {
        try {
          const { data } = await axios.get(`/api/material-master/${value}`);
          setFormData((prev) => ({
            ...prev,
            materialCode: value,
            materialDesc: data?.responseData?.materialDescription,
            uom: data?.responseData?.uom,
            unitPrice: data?.responseData?.unitPrice,
          }));
        } catch (error) {
          console.error("Error fetching material details:", error);
          message.error(
            error?.response?.data?.responseStatus?.message ||
              "Failed to fetch material details."
          );
        }
        return;
      }


      // Handle Project selection
      if (fieldName === "projectName") {
        const selectedProject = projects.find((p) => p.value === value);
        const budgetType = selectedProject ? selectedProject.budgetType : "";


        setFormData((prev) => ({
          ...prev,
          projectName: value,
          budgetCode: budgetType, // Set budgetCode here
        }));
        return;
      }


      // For other fields, update formData directly
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    } else {
      // Handle nested fields in materialDtlList
      setFormData((prev) => {
        const prevMaterialDtlList = prev.materialDtlList;
        prevMaterialDtlList[fieldName[1]][fieldName[2]] = value;
        return { ...prev, materialDtlList: prevMaterialDtlList };
      });
    }
  };

  


  // --- onFinish Function ---
  const onFinish = async () => {
    const payload = { ...formData, locationId, createdBy: userId };


    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post("/api/indents", payload);


      setFormData({
        ...formData,
        indentId: data?.responseData?.processNo,
      });


      localStorage.removeItem("indentDraft");
      setModalOpen(true);
    } catch (error) {
      message.error(
        error?.response?.data?.responseStatus?.message ||
          "Failed to save Indent."
      );
      console.log("Error: ", error?.response?.data?.responseStatus?.message);
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
        error?.response?.data?.responseStatus?.message ||
          "Error fetching data."
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
          if (field.name === "consigneeLocation")
            return { ...field, options: locations };
          if (field.name === "projectName") return { ...field, options: projects };
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
          if (child.name === "uom") 
            return { ...child, options: uomOptions || [] }; // Add fallback empty array
          return child;
        }),
      };
    }
    return section;
  });

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Indent Form" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(
          hydratedIndentDetails,
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
          draftDataName="indentDraft"
          submitBtnLoading={submitBtnLoading}
          submitBtnEnabled
          printBtnEnabled
          draftBtnEnabled
          handlePrint={handlePrint}
        />
      </CustomForm>
      <CustomModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Indent"
        processNo={formData?.indentId}
      />
    </Card>
  );
};


export default Indent;
