import { Button, Popover, Table, Input, Checkbox } from 'antd';
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

 const [selectedSerials, setSelectedSerials] = useState({});

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
        item.assetCode?.toLowerCase().includes(lowerSearch)  ||
        item.aseetDescription.toLowerCase().includes(lowerSearch);
      return matchesCustodian && matchesSearch;
    });
    setFilteredData(filtered);
  }, [assetsArray, searchText, custodianId]);


  function getSerialUniqueKey(record, sn) {
  return `${record.assetId}_${record.locatorId}_${record.custodianId}_${sn}`;
}
console.log("filterdata",filteredData);
// Flatten filteredData so each serial number becomes its own row
const flattenedData = (filteredData || []).flatMap((item) =>
  item.serialNumbers && item.serialNumbers.length > 0
    ? item.serialNumbers.map((sn) => ({
        ...item,
        serialNumber: sn, // store the serial
      }))
    : [item]
);


const handleSerialSelect = (e, record, sn) => {
  const assetKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
  const lineKey = getSerialUniqueKey(record, sn);
  const isChecked = e.target.checked;

  setSelectedSerials(prev => {
    const current = prev[assetKey] || [];
    const updated = isChecked
      ? [...current, sn]
      : current.filter(s => s !== sn);
    return { ...prev, [assetKey]: updated };
  });

  setFormData(prev => {
    const updatedList = [...(prev.materialDtlList || [])];
    if (isChecked) {
      const newAsset = {
        ...record,
         assetCode: record.assetCode, 
        selectedSerial: sn,
        quantity: 1,
        uniqueKey: lineKey,
      };
      updatedList.push(newAsset);
    } else {
      const index = updatedList.findIndex(it => it.uniqueKey === lineKey);
      if (index > -1) updatedList.splice(index, 1);
    }
    return { ...prev, materialDtlList: updatedList };
  });
};


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
  { title: "Asset Code", dataIndex: "assetCode", key: "assetCode" }, // ✅ Added
  { title: "Description", dataIndex: "aseetDescription", key: "aseetDescription" },
  { title: "Locator", dataIndex: "locatorId", key: "locatorId", render: val => locatorMasterObj[val] || val },
  { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  { title: "Custodian", dataIndex: "custodianId", key: "custodianId", render: val => val || "Unassigned" },
 {
  title: "Serial Number",
  dataIndex: "serialNumber",
  key: "serialNumber",
  render: (sn, record) => {
    const assetKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
    const checked = selectedSerials[assetKey]?.includes(sn);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => handleSerialSelect(e, record, sn)}
      >
        {sn}
      </Checkbox>
    );
  },
},

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
      dataSource={flattenedData}
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
