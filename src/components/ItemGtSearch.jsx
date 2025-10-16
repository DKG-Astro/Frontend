import { Button, Popover, Table, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertToCurrency, handleSearch, updateFormData } from '../utils/CommonFunctions';
import dayjs from 'dayjs';

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
  

  const { locatorMaster } = useSelector(state => state.masters);

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

    const isSelected = selectedItems.some(item => item.ohqId === record.ohqId);

    if (!isSelected) {
      setSelectedItems(prev => [...prev, record]);

      const newItem = {
        ohqId: record.ohqId,
        assetId: record.assetId,
        assetDesc: record.assetDesc,
        locatorId: record.locatorId,
        senderLocatorId: record.locatorId,
        custodianId: record.custodianId,
        quantity: record.quantity,
        unitPrice: record.unitPrice,
        bookValue: record.bookValue,
        depriciationRate: record.depriciationRate,
        poId: record?.poId,
        modelNo: record?.modelNo,
        serialNo:record?.serialNo,
        gprnDate: record?.gprnDate,
      };

      updateFormData(newItem, setFormData);
    } else {
      setSelectedItems(prev => prev.filter(it => it.ohqId !== record.ohqId));
    }
  };

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
  ];

  const actionCol = {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, record) => {
      const isSelected = selectedItems?.some(item => item.ohqId === record.ohqId);
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

  const columns = customCols ? [...customCols, actionCol] : [...baseColumns, actionCol];

  const content = (
    <Table
      pagination={{ pageSize: 5 }}
      dataSource={filteredData}
      columns={columns}
      scroll={{ x: 'max-content' }}
      rowKey="ohqId"
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
