import { Button, Popover, Table, Input, Checkbox } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { convertToCurrency } from '../utils/CommonFunctions';
import dayjs from 'dayjs';

const { Search } = Input;

const AssetDisposalSearch = ({ customCols, assetsArray = [], setFormData, custodianId }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSerials, setSelectedSerials] = useState({});
  const [selectedAssets, setSelectedAssets] = useState([]);

  const { locatorMaster, locationMaster } = useSelector(state => state.masters);

  // Map locator ID → Name
  const locatorMap = useMemo(() => {
    return (locatorMaster || []).reduce((acc, obj) => {
      acc[obj.value] = obj.label;
      return acc;
    }, {});
  }, [locatorMaster]);

  // Filter based on custodianId + search
  useEffect(() => {
    const lowerSearch = (searchText || '').toLowerCase();
    const filtered = (assetsArray || []).filter(item => {
      const matchesCustodian =
        item.custodianId === custodianId || item.custodianId === 'unassigned';
      const matchesSearch =
        !lowerSearch ||
        item.assetId?.toString().toLowerCase().includes(lowerSearch) ||
        item.assetCode?.toLowerCase().includes(lowerSearch) ||
        item.aseetDescription?.toLowerCase().includes(lowerSearch);
      return matchesCustodian && matchesSearch;
    });
    setFilteredData(filtered);
  }, [assetsArray, searchText, custodianId]);

  const getSerialUniqueKey = (record, sn) =>
    `${record.assetId}_${record.locatorId}_${record.custodianId}_${sn}`;

  // Handle serial checkbox selection
  const handleSerialSelect = (e, record, sn) => {
    const assetKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
    const isChecked = e.target.checked;

    setSelectedSerials(prev => {
      const current = prev[assetKey] || [];
      const updated = isChecked
        ? [...current, sn]
        : current.filter(s => s !== sn);
      return { ...prev, [assetKey]: updated };
    });

    // Update form data
    setFormData(prev => {
      const updatedList = [...(prev.materialDtlList || [])];
      const lineKey = getSerialUniqueKey(record, sn);

      if (isChecked) {
        const locator = locatorMaster?.find(l => l.value === record.locatorId);
        const locationCode = locator?.locationId;
        const location = locationMaster?.find(l => l.locationCode === locationCode);
        const locationName = location?.locationCode;

        updatedList.push({
          ...record,
          assetCode: record.assetCode,
          serialNo: sn,
          assetDesc: record.aseetDescription,
          quantity: 1,
          uniqueKey: lineKey,
          locationId: locationName,
          poDate: record?.gprnDate ? dayjs(record.gprnDate, 'DD/MM/YYYY') : null,
        });
      } else {
        const index = updatedList.findIndex(it => it.uniqueKey === lineKey);
        if (index > -1) updatedList.splice(index, 1);
      }
      return { ...prev, materialDtlList: updatedList };
    });
  };

  // Handle row select
  const handleSelectAsset = record => {
    const uniqueKey = `${record.assetId}_${record.locatorId}_${record.custodianId}`;
    const isSelected = selectedAssets.some(a => a.uniqueKey === uniqueKey);
    if (isSelected) {
      setSelectedAssets(prev => prev.filter(a => a.uniqueKey !== uniqueKey));
    } else {
      setSelectedAssets(prev => [...prev, { ...record, uniqueKey }]);
    }
  };

  // Columns (like ItemGtSearch)
  const baseColumns = [
    { title: 'Asset Code', dataIndex: 'assetCode', key: 'assetCode', fixed: 'left' },
    { title: 'Custodian ID', dataIndex: 'custodianId', key: 'custodianId' },
    {
      title: 'Locator',
      dataIndex: 'locatorId',
      key: 'locatorId',
      render: id => locatorMap[id] || id || '—',
    },
    { title: 'Asset Description', dataIndex: 'aseetDescription', key: 'aseetDescription' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: v => convertToCurrency(v) || 'N/A',
    },
    {
      title: 'Book Value',
      dataIndex: 'bookValue',
      key: 'bookValue',
      render: v => convertToCurrency(v) || 'N/A',
    },
    {
      title: 'Serial Numbers',
      dataIndex: 'serialNumbers',
      key: 'serialNumbers',
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
                      onChange={e => handleSerialSelect(e, record, sn)}
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

  const content = (
    <Table
      pagination={{ pageSize: 5 }}
      dataSource={filteredData}
      columns={ baseColumns}
      scroll={{ x: 'max-content' }}
      rowKey={record => `${record.assetId}_${record.locatorId}_${record.custodianId}`}
    />
  );

  return (
    <div>
      <Popover
        content={content}
        title="Search Assets"
        trigger="click"
        open={tableOpen}
        onOpenChange={setTableOpen}
        placement="right"
      >
        <Search
          placeholder="Search assets"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 220 }}
        />
      </Popover>
    </div>
  );
};

export default AssetDisposalSearch;
