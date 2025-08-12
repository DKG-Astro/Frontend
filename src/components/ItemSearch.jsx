import { Button, Popover, Table, Input } from 'antd';
import React, { useState } from 'react'
import { convertToCurrency, handleSearch, updateFormData } from '../utils/CommonFunctions';
import { useSelector } from 'react-redux';

const { Search } = Input;

const ItemSearch = ({itemArray, setFormData}) => {
    const [selectedItems, setSelectedItems] = useState([]); // State to hold selected item data
    const [filteredData, setFilteredData] = useState(null)
    const [tableOpen, setTableOpen] = useState(false)
    const [searchText, setSearchText] = useState("")

    const {locatorMaster} = useSelector(state => state.masters)

    // clgp

    const locatorMasterObj = locatorMaster?.reduce((acc, obj) => {
      const { value, label } = obj;
      acc[value] = label;
      return acc;
    }, {});


    const handleSelectItem = (record, subRecord) => {
        setTableOpen(false);
        console.log("Handle select item called");
    
        const recordCopy = record; // delete qtyList array from record
    
        // Check if the item is already selected
        const index = selectedItems.findIndex(
          (item) => item.id === record.id && item.locatorId === subRecord.locatorId
        );
        if (index === -1) {
          setSelectedItems((prevItems) => [
            ...prevItems,
            { ...recordCopy, locatorId: subRecord.locatorId },
          ]); // Update selected items state
            const newItem = {
              assetId: record.assetId,
              assetDesc: record.assetDesc,
              itemDesc: record.itemMasterDesc,
              uomId: record.uomId,
              quantity: subRecord.quantity,
              poId: record.poId,
              // noOfDays: 1,
              // conditionOfGoods: "",
              // budgetHeadProcurement: "",
              locatorId: subRecord.locatorId,
              locatorDesc: locatorMasterObj[parseInt(subRecord.locatorId)],
              // remarks: "",
              // totalValue: record.unitPrice || 0
            };
        updateFormData(newItem, setFormData)
        } else {
          // If item is already selected, deselect it
          const updatedItems = [...selectedItems];
          updatedItems.splice(index, 1);
          setSelectedItems(updatedItems);
        }
      };

    const renderLocatorISN = (obj, rowRecord) => {
        return (
          <Table
            dataSource={obj}
            pagination={false}
            columns={[
              {
                title: "LOCATOR DESCRIPTION",
                dataIndex: "locatorId",
                key: "locatorId",
                render: (id) => locatorMasterObj[parseInt(id)]
              },
              {
                title: "QUANTITY",
                dataIndex: "quantity",
                key: "quantity",
              },
              // {
              //   title: "Total Value",
              //   dataIndex: "totalValues",
              //   key: "totalValues",
              //   render: (value) => convertToCurrency(value)
              // },
              {
                title: "ACTION",
                fixed: "right",
                render: (_, record) => (
                  <Button
                    onClick={() => handleSelectItem(rowRecord, record)}
                    type={
                      selectedItems?.some(
                        (item) =>
                          item.locatorId === record.locatorId &&
                          item.id === rowRecord.id
                      )
                        ? "default"
                        : "primary"
                    }
                  >
                    {selectedItems?.some(
                      (item) =>
                        item.locatorId === record.locatorId &&
                        item.id === rowRecord.id
                    )
                      ? "Deselect"
                      : "Select"}
                  </Button>
                ),
              },
            ]}
          />
        );
      };

    const tableColumns = [
        { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
        {
          title: "Asset Description",
          dataIndex: "assetDesc",
          key: "itemMasterDesc",
          fixed: "left",
        },
        {
          title: "Asset ID",
          dataIndex: "assetId",
          key: "assetId",
        },
        {
          title: "UOM DESCRIPTION",
          dataIndex: "uomId",
        },
    
        { title: "UNIT PRICE", dataIndex: "unitPrice", key: "price", render: (value) => convertToCurrency(value) || "---" },
        { title: "PO ID", dataIndex: "poId", key: "poId" },

        {
          title: "LOCATOR QUANTITY DETAILS",
          dataIndex: "qtyList",
          key: "qtyList",
          render: (locatorQuantity, rowRecord) =>
            renderLocatorISN(locatorQuantity, rowRecord),
        },
      ];

      const content = (
        // <Table dataSource={filteredData} columns={tableColumns} />
        <Table pagination={{ pageSize: 1 }}
                        dataSource={filteredData}
                        columns={tableColumns}
                        scroll={{ x: "max-content" }}
                        style={{
                          // width: "inherit",
                          display: tableOpen ? "block" : "none",
                          // height: "inherit"
                        }} />
      )

  return (
    <div>
      <Popover
        content={content}
        title="Search Results"
        trigger="click"
        open={tableOpen}
        onOpenChange={(v) => setTableOpen(v)}
        // style={{ width: "100px !important", height:"5rem" }}
              placement="right"
      >
        <Search
          placeholder="Search items"
        //   onSearch={handleSearch}
        //   onChange={(e) => handleSearch(e.target.value)}
          onChange={(e) =>
                            handleSearch(
                              e.target?.value || "",
                              itemArray,
                              setFilteredData,
                              setSearchText
                            )
                          }
          value={searchText}
          style={{ width: 200 }}
        />
      </Popover>
    </div>
  )
}

export default ItemSearch
