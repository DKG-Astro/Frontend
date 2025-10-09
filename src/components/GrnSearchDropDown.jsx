import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const GrnSearchDropdown = ({ label, value, onChange, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending GRNs
  useEffect(() => {
    const fetchPendingGrns = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "/api/process-controller/getPendingGrns"
        );
        setOptions(data.responseData || []);
        setFilteredOptions(data.responseData || []);
      } catch (err) {
        console.error(err);
        setOptions([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingGrns();
  }, []);

  const handleSearch = (input) => {
    if (!input) {
      setFilteredOptions(options);
      return;
    }
    const lowerInput = input.toLowerCase();
    const filtered = options.filter(
      (item) =>
        item.giNo.toLowerCase().includes(lowerInput) ||
        item.poId.toLowerCase().includes(lowerInput) ||
        item.vendorId.toLowerCase().includes(lowerInput) ||
        item.materialDescriptions.some((desc) =>
          desc.toLowerCase().includes(lowerInput)
        )
    );
    setFilteredOptions(filtered);
  };

  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 4 }}>{label}</label>}
    <Select
  showSearch
  placeholder="Select GRN No"
  value={value}
  onChange={(val, option) => {
    // option here is the React element, so we need to extract item from it
    const selectedItem = filteredOptions.find(o => o.giNo === val);
    onSelect(selectedItem); // pass the full object
    onChange(val);          // pass value for controlled Select
  }}
  onSearch={handleSearch}
  loading={loading}
  filterOption={false}
  allowClear
  style={{ width: "100%" }}
>
  {filteredOptions.map((item) => (
    <Option key={item.giSubProcessId} value={item.giNo}>
      {item.giNo}
    </Option>
  ))}
</Select>

    </div>
  );
};

export default GrnSearchDropdown;
