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

  // --- Data Fetching Functions ---

  // Fetch Locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "api/location-master"
        );
        if (
          res.data.responseStatus.statusCode === 0 &&
          Array.isArray(res.data.responseData)
        ) {
          setLocations(res.data.responseData);
        } else {
          message.error("Failed to load locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        message.error("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "api/project-master"
        );
        if (
          res.data.responseStatus.statusCode === 0 &&
          Array.isArray(res.data.responseData)
        ) {
          setProjects(res.data.responseData);
        } else {
          message.error("Failed to load projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  // Fetch Materials & build material lookup map
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          "api/material-master"
        );
        if (res.data.responseData) {
          const materials = res.data.responseData;
          const materialMap = materials.reduce((acc, material) => {
            acc[material.materialCode] = {
              description: material.description,
              unitPrice: material.unitPrice,
              uom: material.uom,
              vendorNames: material.vendorNames,
              materialCategory: material.category,
              materialSubCategory: material.subCategory,
            };
            return acc;
          }, {});
          setMaterialDetailsMap(materialMap);
          setMaterialList(Object.keys(materialMap));
        } else {
          message.error("Failed to load materials");
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        message.error("Failed to fetch materials");
      }
    };
    fetchMaterials();
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
      const res = await axios.get(
        `api/indents/${searchIndentId}`
      );
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

  // --- Handlers for Form Data Updates ---
  const handleChange = (fieldName, value) => {
    if (Array.isArray(fieldName)) {
      const [listName, index, field] = fieldName;
      setFormData((prev) => {
        const list = prev[listName] || [];
        const updatedItem = { ...list[index], [field]: value };
        // Auto-calculate totalPrice if quantity or unitPrice change
        if (field === "quantity" || field === "unitPrice") {
          const quantity = Number(updatedItem.quantity) || 0;
          const unitPrice = Number(updatedItem.unitPrice) || 0;
          updatedItem.totalPrice = quantity * unitPrice;
        }
        const updatedList = list.map((item, i) =>
          i === index ? updatedItem : item
        );
        return { ...prev, [listName]: updatedList };
      });
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  // When a material is selected, auto-fill its details
  const handleMaterialSelect = (index, selectedMaterialCode) => {
    const materialData = materialDetailsMap[selectedMaterialCode];
    if (materialData) {
      setFormData((prev) => {
        const list = prev.materialDtlList || [];
        const updatedItem = {
          ...list[index],
          materialCode: selectedMaterialCode,
          materialDesc: materialData.description,
          unitPrice: materialData.unitPrice,
          uom: materialData.uom,
          materialCategory: materialData.materialCategory,
          materialSubCategory: materialData.materialSubCategory,
          vendorName: Array.isArray(materialData.vendorNames)
            ? materialData.vendorNames.join(", ")
            : materialData.vendorNames,
        };
        const quantity = Number(updatedItem.quantity) || 0;
        updatedItem.totalPrice = quantity * Number(updatedItem.unitPrice || 0);
        const updatedList = [...list];
        updatedList[index] = updatedItem;
        return { ...prev, materialDtlList: updatedList };
      });
    }
  };

  // --- Print Functionality ---
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // --- Form Submission ---
  const onFinish = async () => {
    // Build payload using current formData along with auth details.
    const payload = {
      ...formData,
      indentorName: userName,
      indentorEmail: email,
      indentorMobileNo: mobileNumber,
      materialDetails: formData.materialDtlList,
      locationId,
      createdBy: userId,
    };

    try {
      setSubmitBtnLoading(true);
      const { data } = await axios.post("api/indents", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Instead of checking data.responseStatus, we check if data exists.
      if (data) {
        message.success("Indent created successfully!");
        // If the API returns an indent ID, update accordingly.
        // (Update 'indentId' property name if your API returns something different.)
        setFormData((prev) => ({
          ...prev,
          indentId: data?.responseData?.indentId,
        }));
        setGeneratedIndentId(data.indentId || "");
        setIsPrintEnabled(true);
        localStorage.removeItem("indentDraft");
        setModalOpen(true);
      } else {
        throw new Error("Submission failed");
      }
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
          { locations, projects },
          setFormData,
          () => {}
        )}
        {/* Dynamic Material Details Section */}
        <Form.List name="materialDtlList">
          {(fields, { add, remove }) => (
            <>
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
                  <Button
                    danger
                    type="link"
                    onClick={() => {
                      remove(name);
                      setFormData((prev) => {
                        const updatedList = prev.materialDtlList.filter(
                          (_, i) => i !== index
                        );
                        return { ...prev, materialDtlList: updatedList };
                      });
                    }}
                    icon={<DeleteOutlined />}
                    style={{ position: "absolute", right: 0, top: 0 }}
                  />
                </div>
              ))}
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
                style={{ marginTop: 16, width: "150px" }}
              >
                Add Material
              </Button>
            </>
          )}
        </Form.List>
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
