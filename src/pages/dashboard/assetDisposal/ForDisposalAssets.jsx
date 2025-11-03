import { Table, message, Spin, Form } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../components/DKG_Heading";
import CustomForm from "../../../components/DKG_CustomForm";
import { renderFormFields } from "../../../utils/CommonFunctions";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from "axios";
import FormContainer from "../../../components/DKG_FormContainer";
import Btn from "../../../components/DKG_Btn";
import CustomModal from "../../../components/CustomModal";

const ForDisposalAssets = () => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disposalList, setDisposalList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected IDs
  const [modalOpen, setModalOpen] = useState(false);
const [processId, setProcessId] = useState(null);
  const [formData, setFormData] = useState({
    auctionId: "",
    auctionDate: null,
    reservePrice: "",
    auctionPrice: "",
    vendorName: "",
  });

  const { userId, locationId } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  const fetchDisposalList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/reports/ApprovedAssetDisposals");
      setDisposalList(data?.responseData || []);
    } catch {
      message.error("Failed to fetch disposal assets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisposalList();
  }, [fetchDisposalList]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const rowSelection = {
  selectedRowKeys,
  onChange: setSelectedRowKeys,
};

 
const handleRemoveDisposal = async (disposalId) => {
  try {
    // Find the selected disposal object from your state
    const selectedDisposal = disposalList.find(d => d.disposalId === disposalId);

    if (!selectedDisposal) {
      message.error("Disposal not found");
      return;
    }

    // Call the update API to remove the disposal
    const { data } = await axios.put(
      "/api/process-controller/updateAssetDisposal",
      { 
        ...selectedDisposal,
        status: "Removal of Disposal"
      }
    );

    message.success("Disposal removed successfully.");

    // Update your state with the returned object if needed
    const updatedDisposal = data?.responseData;
    setDisposalList(prev =>
      prev.map(d => d.disposalId === disposalId ? updatedDisposal : d)
    );

  } catch (error) {
    message.error(
      error?.response?.data?.responseStatus?.message ||
      "Failed to remove disposal."
    );
  }
};

  const columns = [
    { title: "Disposal ID", dataIndex: "disposalId", key: "disposalId", render: (id) => `INV/${id}` },
    { title: "Location", dataIndex: "locationId", key: "locationId" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Custodian ID", dataIndex: "custodianId", key: "custodianId" },
    {
      title: "Material Details",
      dataIndex: "materialDtlList",
      key: "materialDtlList",
      render: (materials) => (
        <Table
          dataSource={materials}
          pagination={false}
          size="small"
          bordered
          rowKey="assetId"
          columns={[
            { title: "Asset ID", dataIndex: "assetId", key: "assetId" },
            { title: "Asset Code", dataIndex: "assetCode", key: "assetCode" },
            { title: "Asset Desc", dataIndex: "assetDesc", key: "assetDesc" },
            { title: "Quantity", dataIndex: "quantity", key: "quantity" },
             { title: "Serial No", dataIndex: "serialNo", key: "serialNo" },
          ]}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Btn
          onClick={() => handleRemoveDisposal(record.disposalId)}
          size="small"
          type="danger"
        >
          Remove Disposal
        </Btn>
      ),
    },
  ];

  const inputFields = [
    {
      heading: "Auction Details",
      colCnt: 4,
      fieldList: [
        { name: "auctionId", label: "Auction ID", type: "text" },
        { name: "vendorName", label: "Vendor Name", type: "text" },
        { name: "auctionDate", label: "Auction Date", type: "date" },
        { name: "reservePrice", label: "Reserve Price", type: "text" },
        { name: "auctionPrice", label: "Auction Price", type: "text" },
      ],
    },
  ];
  const onFinish = async () => {
  if (selectedRowKeys.length === 0) {
    message.warning("Please select at least one asset for disposal.");
    return;
  }

  const payload = {
    disposalIds: selectedRowKeys, // array of selected disposal IDs
    auctionCode: formData.auctionId, 
    auctionDate: formData.auctionDate,
    reservePrice: formData.reservePrice || null,
    auctionPrice: formData.auctionPrice || null,
    vendorName: formData.vendorName || null,
    updatedBy: userId,
    locationId: locationId,
  };

  try {
    setSubmitBtnLoading(true);
  const { data } =  await axios.put("/api/process-controller/MultipleAssetsDisposal", payload);
    setProcessId(data?.responseData?.processNo || null);
    setModalOpen(true); 
    message.success("Selected assets moved to Disposed successfully.");
    setSelectedRowKeys([]);
    setFormData({
      auctionId: "",
      auctionDate: null,
      reservePrice: "",
      auctionPrice: "",
      vendorName: "",
    });
    fetchDisposalList();
  } catch (error) {
    message.error(
      error?.response?.data?.responseStatus?.message ||
      "Failed to dispose assets."
    );
  } finally {
    setSubmitBtnLoading(false);
  }
};


  return (
    <FormContainer>
      <Heading title="For Disposal Assets" />
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          rowSelection={rowSelection}
          dataSource={disposalList}
          columns={columns}
          rowKey="disposalId"
          pagination={false}
          className="mt-4"
        />
      )}

      {/* Auction fields and Submit button always visible below */}
      <CustomForm
        form={form}
        formData={formData}
        onFinish={onFinish}
        onFinishFailed={() => message.error("Please check required fields")}
      >
        {renderFormFields(inputFields, handleChange, formData)}
        <div className="custom-btn" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
  <Btn
    htmlType="submit"          
    loading={submitBtnLoading}
  >
    Submit
  </Btn>
</div>

      </CustomForm>
         <CustomModal
              isOpen={modalOpen}
              setIsOpen={setModalOpen}
              title="Asset Disposal"
              processNo={processId}
            />
    </FormContainer>
  );
};

export default ForDisposalAssets;
