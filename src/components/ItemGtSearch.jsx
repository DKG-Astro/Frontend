import { Button, Popover, Table, Input,Checkbox } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertToCurrency, handleSearch, updateFormData } from '../utils/CommonFunctions';
import dayjs from 'dayjs';
import { updateFormDataWithSerial } from '../utils/CommonFunctions';

const { Search } = Input;

/**
 * Props:
 *  - itemsArray: [{ ohqId, assetId, locatorId, bookValue, depriciationRate, unitPrice, quantity, custodianId }]
 *  - setFormData: function used by updateFormData
 *  - customCols?: optional array of columns to prepend/override
 */
const ItemGtSearch = ({ customCols, itemsArray = [], setFormData }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState(itemsArray);
  const [tableOpen, setTableOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  

  const [selectedSerials, setSelectedSerials] = useState({});

  const { locatorMaster } = useSelector(state => state.masters);


function getSerialUniqueKey(record, sn) {
  return `${record.assetId}_${record.locatorId}_${record.custodianId}_${sn}`;
}


  useEffect(() => {
    setFilteredData(itemsArray || []);
  }, [itemsArray]);

  const locatorMap = useMemo(() => {
    return (locatorMaster || []).reduce((acc, obj) => {
      const { value, label } = obj; // value = locatorId
      acc[String(value)] = label;
      return acc;
    }, {});
  }, [locatorMaster]);

   const handleSelectItem = (record) => {
    setTableOpen(false);
    const uniqueKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;

    const isSelected = selectedItems.some(item => item.uniqueKey === uniqueKey);

    if (!isSelected) {
      const newItem = {
        ...record,
        uniqueKey,
        senderLocatorId: record.locatorId,
        serialNumbers: selectedSerials[uniqueKey] || [], 
      };

      setSelectedItems(prev => [...prev, newItem]);
      updateFormData(newItem, setFormData);
  //   updateFormDataWithSerial(record, sn, setFormData);

    } else {
      setSelectedItems(prev => prev.filter(it => it.uniqueKey !== uniqueKey));
    }
  };
 
const handleSerialSelect = (e, record, sn) => {
  const assetKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
  const lineKey = getSerialUniqueKey(record, sn); // Use new key format
  const isChecked = e.target.checked;
console.log("selected sn:" + sn);
  setSelectedSerials(prev => {
    const current = prev[assetKey] || [];
    const updated = isChecked
      ? [...current, sn]
      : current.filter(s => s !== sn);

    // This only updates mapping; the items update is separate below
    return { ...prev, [assetKey]: updated };
  });

  setSelectedItems(prevItems => {
    let updatedItems = [...prevItems];
    if (isChecked) {
      // Line item per selected serial
      if (!updatedItems.some(it => it.uniqueKey === lineKey)) {
        updatedItems.push({
          ...record,
          assetCode: record.assetCode,
          senderLocatorId: record.locatorId,
          selectedSerial: sn,
          quantity: 1,
          uniqueKey: lineKey,
        });
      }
      updateFormDataWithSerial(record, sn, setFormData);
    } else {
      updatedItems = updatedItems.filter(it => it.uniqueKey !== lineKey);
    }
    return updatedItems;
  });
};





/*
  const baseColumns = [
    { title: 'OHQ ID', dataIndex: 'ohqId', key: 'ohqId', fixed: 'left' },
    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
    { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetId' },
    {
      title: 'Locator',
      dataIndex: 'locatorId',
      key: 'locatorId',
      render: (locatorId) => locatorMap[String(locatorId)] || locatorId || '—',
    },
    { title: 'Custodian', dataIndex: 'custodianId', key: 'custodianId' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (v) => convertToCurrency(v) || 'N/A',
    },
    {
      title: 'Book Value',
      dataIndex: 'bookValue',
      key: 'bookValue',
      render: (v) => convertToCurrency(v) || 'N/A',
    },
    {
      title: 'Depreciation Rate',
      dataIndex: 'depriciationRate',
      key: 'depriciationRate',
      render: (v) => (v ?? v === 0 ? `${v}%` : '—'),
    },
  ];*/
  const baseColumns = [
  { title: 'Asset Code', dataIndex: 'assetCode', key: 'assetCode', fixed: 'left' },
  { title: 'Custodian ID', dataIndex: 'custodianId', key: 'custodianId' },
  { title: 'Locator ID', dataIndex: 'locatorId', key: 'locatorId' },
  { title: 'Asset Description', dataIndex: 'assetDesc', key: 'assetDesc' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: v => convertToCurrency(v) || 'N/A' },
  { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue', render: v => convertToCurrency(v) || 'N/A' },
{
  title: 'Serial Numbers',
  dataIndex: 'serialNumbers',
  key: 'serialNumbers',
 // 🚩 REPLACE Render Section of 'Serial Numbers' Column
render: (serials, record) => {
  const assetKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
  if (serials?.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {serials.map(sn => {
          const checked = selectedSerials[assetKey]?.includes(sn);
          return (
            <div key={sn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{sn}</span>
              <Checkbox
                checked={checked}
                onChange={(e) => handleSerialSelect(e, record, sn)}
              >
                {checked ? 'Deselect' : 'Select'}
              </Checkbox>
            </div>
          );
        })}
      </div>
    );
  }
  return <span>No Serials</span>;
},

},


];
/*
const actionCol = {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, record) => {
      const uniqueKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
      const isSelected = selectedItems?.some(item => item.uniqueKey === uniqueKey);
      return (
        <Button
          onClick={() => handleSelectItem(record)}
          type={isSelected ? 'default' : 'primary'}
        >
          {isSelected ? 'Deselect' : 'Select'}
        </Button>
      );
    },
  };

  const columns = customCols ? [...customCols, actionCol] : [...baseColumns, actionCol];*/
  const columns = customCols ? [...customCols] : [...baseColumns];

 const content = (
    <Table
      pagination={{ pageSize: 5 }}
      dataSource={filteredData}
      columns={columns}
      scroll={{ x: 'max-content' }}
      rowKey={record => `${record.assetId}_${record.locatorId}_${record.custodianId}`}
    />
  );

  return (
    <div>
      <Popover
        content={content}
        title="Search Items"
        trigger="click"
        open={tableOpen}
        onOpenChange={v => setTableOpen(v)}
        placement="right"
      >
        <Search
          placeholder="Search items"
          onChange={(e) =>
            handleSearch(
              e.target?.value || '',
              itemsArray,
              setFilteredData,
              setSearchText
            )
          }
          value={searchText}
          style={{ width: 220 }}
        />
      </Popover>
    </div>
  );
};

export default ItemGtSearch;