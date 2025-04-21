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
        setApprovedIndents(filteredIndents);

        // 3. Fetch consignee addresses
        const locationsResponse = await axios.get("/api/location-master");
        setConsigneeOptions(
          (locationsResponse.data.responseData || []).map((location) => ({
            value: location.locationName,
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
