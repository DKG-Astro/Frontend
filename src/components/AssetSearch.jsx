import { Button, Popover, Table, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { convertToCurrency, updateFormData } from '../utils/CommonFunctions';
import dayjs from "dayjs";

const { Search } = Input;

const AssetSearch = ({ customCols, assetsArray, setFormData, custodianId }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { locatorMaster } = useSelector(state => state.masters);
 const { locationMaster } = useSelector(state => state.masters);
  const locatorMasterObj = locatorMaster?.reduce((acc, obj) => {
    const { value, label } = obj;
    acc[value] = label;
    return acc;
  }, {});

  // Update filteredData whenever assetsArray, searchText, or custodianId change
  useEffect(() => {
    const lowerSearch = (searchText || "").toLowerCase();
    const filtered = (assetsArray || []).filter(item => {
      const matchesCustodian =
        item.custodianId === custodianId || item.custodianId === "unassigned";
      const matchesSearch =
        !lowerSearch ||
        item.assetId.toString().toLowerCase().includes(lowerSearch) ||
        item.aseetDescription.toLowerCase().includes(lowerSearch);
      return matchesCustodian && matchesSearch;
    });
    setFilteredData(filtered);
  }, [assetsArray, searchText, custodianId]);

  const handleSelectAsset = (record) => {
    setTableOpen(false);

    const index = selectedAssets.findIndex(item => item.assetId === record.assetId);
    if (index === -1) {
      setSelectedAssets(prev => [...prev, record]);

       const locator = locatorMaster?.find(loc => loc.value === record.locatorId);
    const locationCode = locator?.locationId;

    // Find location name from locationMaster using locationCode
    const location = locationMaster?.find(loc => loc.locationCode === locationCode);
    const locationName = location?.locationCode;
      const newAsset = {
      /*  ohqId: record.ohqId,
        assetId: record.assetId,
        assetDesc: record.aseetDescription,
        locatorId: record.locatorId,
        quantity: record?.quantity || 0,
        unitPrice: record?.unitPrice || 0,
        bookValue: record?.bookValue || 0,
        depriciationRate: record?.depriciationRate || 0,
        custodianId: record?.custodianId || "unassigned",
        poValue: record?.poValue || 0,*/
         ohqId: record.ohqId,
  assetId: record.assetId,
  assetDesc: record.aseetDescription,
  locatorId: record.locatorId,
  disposalQuantity: 0,        // user can edit in parent form if needed
  // Extra fields only for backend
  quantity: record?.quantity || 0,
  unitPrice: record?.unitPrice || 0,
  bookValue: record?.bookValue || 0,
  depriciationRate: record?.depriciationRate || 0,
  custodianId: record?.custodianId || "unassigned",
  poValue: record?.poValue || 0,
   poId:  record?.poId,
      poDate: record?.gprnDate ? dayjs(record.gprnDate, "DD/MM/YYYY") : null,
        serialNo:  record?.serialNo,
        modelNo:  record?.modelNo,
        locationId: locationName,
      };
        setFormData(prev => ({
      ...prev,
      locationId: locationName,            // <-- Top-level field station
      materialDtlList: [...prev.materialDtlList, newAsset],
    }));

   //   updateFormData(newAsset, setFormData);
    } else {
      const updatedAssets = [...selectedAssets];
      updatedAssets.splice(index, 1);
      setSelectedAssets(updatedAssets);
    }
  };

  const tableColumns = [
    { title: "Asset ID", dataIndex: "assetId", key: "assetId", fixed: "left" },
    { title: "Description", dataIndex: "aseetDescription", key: "aseetDescription" },
    { title: "Locator", dataIndex: "locatorId", key: "locatorId", render: val => locatorMasterObj[val] || val },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", render: val => convertToCurrency(val) },
    { title: "Book Value", dataIndex: "bookValue", key: "bookValue", render: val => convertToCurrency(val) },
    { title: "Depreciation Rate", dataIndex: "depriciationRate", key: "depriciationRate", render: val => `${val}%` },
    { title: "Custodian", dataIndex: "custodianId", key: "custodianId", render: val => val || "Unassigned" },
  ];

  const actionCol = {
    title: "Action",
    key: "action",
    fixed: "right",
    render: (_, record) => (
      <Button
        type={selectedAssets.some(item => item.assetId === record.assetId) ? "default" : "primary"}
        onClick={() => handleSelectAsset(record)}
      >
        {selectedAssets.some(item => item.assetId === record.assetId) ? "Deselect" : "Select"}
      </Button>
    ),
  };

  const content = (
    <Table
      pagination={{ pageSize: 5 }}
      dataSource={filteredData}
      columns={customCols ? [...customCols, actionCol] : [...tableColumns, actionCol]}
      scroll={{ x: "max-content" }}
      rowKey="assetId"
    />
  );

  return (
    <div>
      <Popover
        content={content}
        title="Search Assets"
        trigger="click"
        open={tableOpen}
        onOpenChange={v => setTableOpen(v)}
        placement="right"
      >
        <Search
          placeholder="Search assets"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
      </Popover>
    </div>
  );
};

export default AssetSearch;
