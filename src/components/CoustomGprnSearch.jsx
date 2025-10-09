import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;
const { Search } = Input;

const CustomGprnSearch = ({
  label,
  name,
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  onSearch,
  required,
  readOnly
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      style={{ marginBottom: 16 }}
    >
      <div style={{ display: "flex", gap: "16px" }}>
  <Select
    value={searchType}
    onChange={setSearchType}
    style={{ width: "60%" }} // wider dropdown
  >
    <Option value="processId">Process ID</Option>
    <Option value="materialdescription">Material Description</Option>
    <Option value="indentorname">Po Id</Option>
    <Option value="vendorName">Vendor Name</Option>
  </Select>

  <Search
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    type={searchType === "submittedDate" ? "date" : "text"}
    onSearch={onSearch}
    enterButton
    style={{ width: "60%" }} // reduced to match new Select width
  />
</div>

    </Form.Item>
  );
};

export default CustomGprnSearch;
