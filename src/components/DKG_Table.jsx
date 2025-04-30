import React, { useEffect, useState } from "react";
import { Table, Input, Button, Dropdown, Menu, Checkbox } from "antd";
import { DownOutlined, ExportOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Btn from "./DKG_Btn";

const TableComponent = ({
  columns,
  dataSource,
  hideExport,
  hideManageColumns,
}) => {
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [searchText, setSearchText] = useState({});
  const [filteredData, setFilteredData] = useState(dataSource);
  const [columnDropdownVisible, setColumnDropdownVisible] = useState(false);

  const [globalSearchText, setGlobalSearchText] = useState("");


  // Handle hiding columns
  const handleHideColumnChange = (columnKey) => {
    setHiddenColumns((prev) => {
      const updated = prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey];

      // Reset search/filter for hidden columns
      if (!prev.includes(columnKey)) {
        setSearchText((prevSearchText) => {
          const { [columnKey]: _, ...rest } = prevSearchText;
          return rest;
        });
        setFilteredData(dataSource); // Reset data
      }

      return updated;
    });
  };

  // Export filtered data and non-hidden columns to CSV
  const exportToCSV = () => {
    const filteredRows = filteredData.map((row) => {
      const filteredRow = {};
      columns
        .filter((col) => !hiddenColumns.includes(col.key))
        .forEach((col) => {
          filteredRow[col.dataIndex] = row[col.dataIndex];
        });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "export.csv");
  };

  // Add search and filter capability to columns
  const enhancedColumns = columns
    .map((column) => {
      // if (column.searchable) {
      //   return {
      //     ...column,
      //     filterDropdown: () => (
      //       <div style={{ padding: 8 }}>
      //         <Input
      //           placeholder={`Search ${column.title}`}
      //           value={searchText[column.key] || ""}
      //           onChange={(e) => {
      //             const value = e.target.value.toLowerCase();
      //             setSearchText((prev) => ({ ...prev, [column.key]: value }));
      //             setFilteredData(
      //               dataSource.filter((row) =>
      //                 row[column.dataIndex]
      //                   ?.toString()
      //                   ?.toLowerCase()
      //                   .includes(value)
      //               )
      //             );
      //           }}
      //           style={{ marginBottom: 8, display: "block" }}
      //         />
      //       </div>
      //     ),
      //     onFilter: (value, record) =>
      //       record[column.dataIndex]
      //         ?.toString()
      //         ?.toLowerCase()
      //         .includes(searchText[column.key] || ""),
      //   };
      // }

      if (column.searchable) {
        return {
          ...column,
          filterDropdown: () => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={`Search ${column.title}`}
                value={searchText[column.key] || ""}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setSearchText((prev) => ({ ...prev, [column.key]: value }));
                  setFilteredData(
                    dataSource.filter((row) =>
                      row[column.dataIndex]
                        ?.toString()
                        ?.toLowerCase()
                        .includes(value)
                    )
                  );
                }}
                style={{ marginBottom: 8, display: "block" }}
              />
            </div>
          ),
          onFilter: (value, record) =>
            record[column.dataIndex]
              ?.toString()
              ?.toLowerCase()
              .includes(searchText[column.key] || ""),
        };
      }
      if (column.filterable) {
        return {
          ...column,
          filters: [
            ...new Set(dataSource.map((item) => item[column.dataIndex])),
          ]
            .filter(Boolean)
            .map((value) => ({ text: value, value })),
          onFilter: (value, record) => record[column.dataIndex] === value,
        };
      }
      return column;
    })
    .filter((col) => !hiddenColumns.includes(col.key));

  // Dropdown to manage column visibility
  // Add these functions at the top with other state declarations
  const handleSelectAllColumns = () => {
    setHiddenColumns([]);
  };

  const handleDeselectAllColumns = () => {
    setHiddenColumns(columns.map(col => col.key));
  };

  // Update the columnOptions menu
  const columnOptions = (
   // <Menu>
   <Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="flex items-center gap-2 !bg-white">
      <Menu.Item key="selectAll">

        <Btn type="link" onClick={handleSelectAllColumns} className="!text-darkBlueHover !font-semibold " block>
          Select All
        </Btn>
      </Menu.Item>
      <Menu.Item key="deselectAll">
        <Button type="link" onClick={handleDeselectAllColumns} block className="border-darkBlue hover:border-darkBlueHover !text-darkBlue hover:text-darkBlueHover !font-semibold">
          Deselect All
        </Button>
      </Menu.Item>
        </div>
      <Menu.Divider />
      {columns.map((col) => (
        <Menu.Item key={col.key}>
          <Checkbox
            checked={!hiddenColumns.includes(col.key)}
            onChange={() => handleHideColumnChange(col.key)}
          >
            {col.title}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item>
        <Button
          type="primary"
          onClick={() => setColumnDropdownVisible(false)}
          block
        >
          OK
        </Button>
      </Menu.Item>
    </Menu>
  );

  // Add global search function
  const handleGlobalSearch = (value) => {
    setGlobalSearchText(value);
    if (!value) {
      setFilteredData(dataSource);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = dataSource.filter(record => {
      return Object.keys(record).some(key => {
        const cellValue = record[key];
        if (cellValue === null || cellValue === undefined) return false;
        
        // Handle different data types
        if (typeof cellValue === 'object') {
          // For nested objects or arrays, convert to string for searching
          return JSON.stringify(cellValue).toLowerCase().includes(searchValue);
        }
        return cellValue.toString().toLowerCase().includes(searchValue);
      });
    });
    
    setFilteredData(filtered);
  };

  // Update useEffect to reset filtered data when dataSource changes
  useEffect(() => {
    setFilteredData(dataSource);
    // Reset global search when data source changes
    setGlobalSearchText("");
  }, [dataSource]);

  return (
    <>
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Enter a keyword.."
            prefix={<SearchOutlined />}
            value={globalSearchText}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            allowClear
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
          {(!hideManageColumns || !hideExport) && (
            <div className="flex gap-4">
              {!hideManageColumns && (
                <Dropdown
                  overlay={columnOptions}
                  trigger={["click"]}
                  visible={columnDropdownVisible}
                  onVisibleChange={(visible) => setColumnDropdownVisible(visible)}
                >
                  <Button>
                    Manage Columns <DownOutlined />
                  </Button>
                </Dropdown>
              )}
              {!hideExport && (
                <Button onClick={exportToCSV} className="flex items-center gap-2">
                  <span><ExportOutlined /></span>
                  <span>Export to CSV</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Table
        dataSource={filteredData}
        columns={enhancedColumns}
        scroll={{ x: true }}
        pagination={true}
        rowKey={(record) => record.id || record.key || JSON.stringify(record)}
        bordered
      />
    </>
  );
};

export default TableComponent;
