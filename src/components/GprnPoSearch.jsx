import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Input, Tag } from "antd";
import axios from "axios";

const { Search } = Input;

// Debounce only for backend API call
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const GprnPoSearch = ({ poArray = [], setFormData, handleSearch }) => {
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(poArray || []);
  const [searchText, setSearchText] = useState("");
  const [modalSearchText, setModalSearchText] = useState(""); 
  const [selectedPoId, setSelectedPoId] = useState(null);

  useEffect(() => {
    setFilteredData(poArray || []);
  }, [poArray]);

  const searchBackend = async (keyword) => {
    try {
      const { data } = await axios.get(
        `/api/process-controller/getPendingAllPoDataForGprn/search?keyword=${keyword}`
      );

      let backendList = data?.responseData?.pendingGprnList || [];

      // Sort Chronologically (Oldest → Newest)
      backendList.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));

      setFilteredData(backendList);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const debouncedSearch = debounce(searchBackend, 400);

  const handleSearchInput = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };


  const getModalFilteredData = () => {
    const q = modalSearchText.toLowerCase();

    return (filteredData || []).filter((po) => {
      const poText = `${po.poId} ${po.vendorName ?? ""}`.toLowerCase();

      const indentText = (po.indentIds || []).join(" ").toLowerCase();

      const materialText = (po.materials || [])
        .map(
          (m) =>
            `${m.materialCode ?? ""} ${m.materialDesc ?? ""} ${m.orderQty ?? ""} ${m.receivedQty ?? ""} ${m.pendingQty ?? ""}`
        )
        .join(" ")
        .toLowerCase();

      return (
        poText.includes(q) ||
        indentText.includes(q) ||
        materialText.includes(q)
      );
    });
  };

  const columns = [
    {
      title: "PO ID",
      dataIndex: "poId",
      key: "poId",
      width: 120,
      fixed: "left",
    },
    {
      title: "Indent IDs",
      dataIndex: "indentIds",
      width: 200,
      render: (ids) =>
        ids?.length ? ids.map((id) => <Tag key={id}>{id}</Tag>) : "—",
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      width: 200,
    },
    {
      title: "Materials",
      dataIndex: "materials",
      width: 600,
      render: (materials = []) => (
        <Table
          dataSource={materials}
          rowKey={(row, i) => row.materialCode + i}
          pagination={false}
          size="small"
          columns={[
            { title: "Code", dataIndex: "materialCode", width: 120 },
            { title: "Description", dataIndex: "materialDesc", width: 250 },
            { title: "Qty", dataIndex: "orderQty", width: 80 },
            { title: "Received", dataIndex: "receivedQty", width: 80 },
            { title: "Pending", dataIndex: "pendingQty", width: 80 },
          ]}
        />
      ),
    },
    {
      title: "Action",
      width: 150,
      render: (_, record) => {
        const disabled = selectedPoId && selectedPoId !== record.poId;
        return selectedPoId === record.poId ? (
          <Button danger onClick={handleDeselect}>Deselect</Button>
        ) : (
          <Button
            type="primary"
            disabled={disabled}
            onClick={() => handleSelect(record)}
          >
            Select
          </Button>
        );
      },
    },
  ];

  const handleSelect = (record) => {
    setSelectedPoId(record.poId);
    setFormData((prev) => ({ ...prev, poId: record.poId }));
    handleSearch(record.poId);
    setOpen(false);
  };

  const handleDeselect = () => {
    setSelectedPoId(null);
    setFormData((prev) => ({
      ...prev,
      poId: "",
      vendorId: "",
      vendorName: "",
      vendorEmail: "",
      vendorContactNo: "",
      project: "",
      indentorName: "",
      indentId: "",
      consigneeDetail: "",
      fieldStation: "",
      materialDtlList: [],
      totalQuantity: "",
      gprnNo: "",
    }));
  };

  return (
    <>
      <Search
        placeholder="Search PO, Material, Indent…"
        value={searchText}
        onChange={(e) => handleSearchInput(e.target.value)}
        onClick={() => setOpen(true)}
        onSearch={() => setOpen(true)}
        allowClear
        style={{ width: 280 }}
      />

      <Modal
        open={open}
        title="Search Purchase Orders"
        footer={null}
        onCancel={() => setOpen(false)}
        width={1300}
      >
       
        <Input
          placeholder="Type here to narrow results..."
          value={modalSearchText}
          onChange={(e) => setModalSearchText(e.target.value)}
          style={{ marginBottom: 10, width: 300 }}
          allowClear
        />

        <Table
          dataSource={getModalFilteredData()}  
          columns={columns}
          rowKey="poId"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
        />
      </Modal>
    </>
  );
};

export default GprnPoSearch;