import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Form, message } from "antd";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import ButtonContainer from "../../../components/ButtonContainer";
import CustomModal from "../../../components/CustomModal";
import { SoDetails } from "./InputFields";

const SO = () => {
  const printRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [generatedSOId, setGeneratedSOId] = useState("");

  // Redux selectors
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;

  // Data states
  const [vendors, setVendors] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    materialDtlList: [],
    consignesAddress: "Bangalore",
    billingAddress: "Koramangala, Bangalore - 560034",
  });

  // Fetch initial data
  const populateDropdowns = async () => {
    try {
      const [vendorResponse, approvedTendersResponse] = await Promise.all([
        axios.get("/api/vendor-master"),
        axios.get("/getApprovedTenderIdForPOAndSO"),
      ]);

      // Format options
      const formattedVendors = (vendorResponse.data?.responseData || []).map(
        (vendor) => ({
          label: vendor.vendorName,
          value: vendor.vendorName,
          id: vendor.vendorId,
          address: vendor.address,
          accountNumber: vendor.accountNo,
          ifscCode: vendor.ifscCode,
          accountName: vendor.vendorName,
        })
      );
      setVendors(formattedVendors);

      // Get approved tender IDs
      const approvedTenderIds =
        approvedTendersResponse.data?.responseData || [];

      const tendersForDropdown = approvedTenderIds.map((tenderId) => ({
        label: tenderId,
        value: tenderId,
      }));
      setTenders(tendersForDropdown);
    } catch (error) {
      message.error("Failed to load dropdown data");
    }
  };

  const handleTenderSelect = async (tenderId) => {
    try {
      ;

      // 1. Fetch the full tender DTO by tenderId using axios and relative path
      const tenderRes = await axios.get(`/api/tender-requests/${tenderId}`);
      const tenderDto = tenderRes.data.responseData;
      ;

      // 2. Extract all material details from indentResponseDTO
      const allMaterials = (tenderDto.indentResponseDTO || []).flatMap(
        (indent) =>
          (indent.materialDetails || []).map((material) => ({
            materialCode: material.materialCode,
            materialDescription: material.materialDescription,
            budgetCode: material.budgetCode,
            quantity: material.quantity,
            rate: material.unitPrice,
            uom: material.uom,
            currency: material.currency || "INR",
            gst: material.gst || "",
            duties: material.duties || "",
            // Add other fields as needed
          }))
      );

      // 3. Update state and form
      setMaterials(allMaterials);

      setFormData((prev) => ({
        ...prev,
        tenderId,
        materialDtlList: allMaterials,
        incoTerms: tenderDto.incoTerms,
        paymentTerms: tenderDto.paymentTerms,
      }));
    } catch (error) {
      console.error("Tender selection error:", error);
      message.error("Failed to load tender details");
    }
  };

  // Hydrate form configuration
  const hydratedSoDetails = SoDetails.map((section) => {
    if (section.fieldList) {
      return {
        ...section,
        fieldList: section.fieldList.map((field) => {
          if (field.name === "vendorName")
            return { ...field, options: vendors };
          if (field.name === "tenderId")
            return {
              ...field,
              options: tenders,
              props: {
                onChange: (value) => {
                  handleTenderSelect(value);
                },
                showSearch: true,
              },
            };
          if (field.name === "vendorId")
            return {
              ...field,
              options: vendors.map((v) => ({
                label: v.id,
                value: v.id,
              })),
            };
          return field;
        }),
      };
    }
    if (section.name === "materialDtlList") {
      return {
        ...section,
        children: section.children.map((child) => ({
          ...child,
          options: child.name === "materialCode" ? materials : child.options,
        })),
      };
    }
    return section;
  });

  // Handle form changes
  const handleChange = (name, value) => {
    if (name === "vendorName") {
      const selectedVendor = vendors.find((v) => v.value === value);
      setFormData((prev) => ({
        ...prev,
        vendorName: value,
        vendorId: selectedVendor?.id || "",
        vendorAddress: selectedVendor?.address || "",
        vendorsAccountNo: selectedVendor?.accountNumber || "",
        vendorsZRSCCode: selectedVendor?.ifscCode || "",
        vendorsAccountName: selectedVendor?.accountName || "",
      }));
      return;
    }
    if (name === "vendorId") {
        const selectedVendor = vendors.find((v) => v.id === value);
        setFormData((prev) => ({
          ...prev,
          vendorId: value,
          vendorName: selectedVendor?.value || "",
          vendorAddress: selectedVendor?.address || "",
          vendorsAccountNo: selectedVendor?.accountNumber || "",
          vendorsZRSCCode: selectedVendor?.ifscCode || "",
          vendorsAccountName: selectedVendor?.accountName || "",
        }));
        return;
      }
    if (Array.isArray(name)) {
      const [section, index, field] = name;
      if (section === "materialDtlList") {
        setFormData((prev) => {
          const updated = [...(prev.materialDtlList || [])];
          updated[index] = { ...updated[index], [field]: value };
          return { ...prev, materialDtlList: updated };
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Form submission
  const onFinish = async () => {
    try {
      if (!formData.tenderId) {
        message.error("Please select a Tender ID before submitting.");
        return;
      }
      setSubmitBtnLoading(true);
      const payload = {
        ...formData,
        createdBy: actionPerformer,
        materials: (formData.materialDtlList || []).map((m) => ({
          budgetCode: m.budgetCode || "",
          currency: m.currency || "",
          duties: Number(m.duties) || 0,
          exchangeRate: Number(m.exchangeRate) || 0,
          gst: Number(m.gst) || 0,
          materialCode: m.materialCode || "",
          materialDescription: m.materialDescription || "",
          budgetCode: m.budgetCode || "",
          quantity: Number(m.quantity) || 0,
          rate: Number(m.rate) || 0,
        })),
        applicablePBGToBeSubmitted: formData.applicablePBGToBeSubmitted || "",
      };

      const { data } = await axios.post("/api/service-orders", payload);
      setGeneratedSOId(data.responseData.soId);
      setModalOpen(true);
    } catch (error) {
      message.error("Failed to create service order");
    } finally {
      setSubmitBtnLoading(false);
    }
  };

  const handleSearch = async (value) => {
    try {
      const { data } = await axios.get(
        `/api/service-orders/${value ? value : formData.soId}`
      );
      const responseData = data?.responseData || {};

      setFormData({
        ...responseData,
        materialDtlList: responseData?.materials || [],
      });
    } catch (error) {
      ;
      message.error(
        error?.response?.data?.responseStatus?.message || "Error fetching data."
      );
    }
  };

  // Load initial data
  useEffect(() => {
    populateDropdowns();
  }, []);

  useEffect(() => {
    const soDraft = localStorage.getItem("soDraft");
    if (soDraft) {
      setFormData(JSON.parse(soDraft));
      message.success("Form loaded from draft.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("soDraft", JSON.stringify(formData));
  }, [formData]);

  // --- Printing Function ---
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Card className="a4-container" ref={printRef}>
      <Heading title="Service Order Creation" />
      <CustomForm formData={formData} onFinish={onFinish}>
        {renderFormFields(
          hydratedSoDetails,
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
          draftDataName="soDraft"
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
        title="Service Order"
        processNo={generatedSOId}
      />
    </Card>
  );
};

export default SO;
