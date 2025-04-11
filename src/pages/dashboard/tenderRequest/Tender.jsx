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

  // Redux selectors
  const { userName, email, mobileNumber, token, userId } = useSelector(
    (state) => state.auth
  );

  // Form data state
  const [formData, setFormData] = useState({});

  // Fetch consignee addresses
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  useEffect(() => {
    const fetchConsigneeAddresses = async () => {
      try {
        const res = await axios.get("api/location-master");
        if (res.data.responseData) {
          setConsigneeOptions(
            res.data.responseData.map(loc => ({
              value: loc.locationName,
              label: loc.locationName
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchConsigneeAddresses();
  }, []);

  // Handle form field changes
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Search functionality
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

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Form submission
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
      
      {/* Search Section */}
      <div className="search-section">
        {/* <Input
          placeholder="Enter Tender ID"
          value={searchTenderId}
          onChange={e => setSearchTenderId(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        /> */}
      </div>

      <CustomForm
        formData={formData}
        onFinish={onFinish}
        onFinishFailed={() => message.error("Please check required fields")}
      >
        {renderFormFields(
          TenderDetails,
          (fieldName, value) => handleChange(fieldName, value),
          formData,
          "",
          { consigneeOptions }, // Pass dynamic options
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