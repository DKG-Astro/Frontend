import React, { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;

const PendingRejectedGiDropdown = ({ value, onChange, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingGis = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "/api/process-controller/getPendingRejectedGis"
        );

        // Extract the array from responseData safely
        const list = Array.isArray(data?.responseData) ? data.responseData : [];
        setOptions(list);
        setFilteredOptions(list);
      } catch (err) {
        console.error(err);
        setOptions([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingGis();
  }, []);

  const handleSearch = (input) => {
    if (!input) {
      setFilteredOptions(options);
      return;
    }

    const lowerInput = input.toLowerCase();
    const filtered = (options || []).filter((item) => {
      const gprnNo = item?.gprnNo?.toLowerCase() || "";
      const poId = item?.poId?.toLowerCase() || "";
      const vendorId = item?.vendorId?.toLowerCase() || "";
      const materialDescriptions = Array.isArray(item?.materialDescriptions)
        ? item.materialDescriptions
        : [];

      return (
        gprnNo.includes(lowerInput) ||
        poId.includes(lowerInput) ||
        vendorId.includes(lowerInput) ||
        materialDescriptions.some((desc) => desc.toLowerCase().includes(lowerInput))
      );
    });

    setFilteredOptions(filtered);
  };

  return (
   <Select
  showSearch
  placeholder="Select Process No"
  value={value || undefined} // make sure undefined when empty
  onChange={(val) => {
    // Find the selected item in all options
    const selectedItem = (options || []).find((o) => o.gprnNo === val);

    // Call parent callbacks
    onChange && onChange(val);       // passes just value
    onSelect && onSelect(selectedItem); // passes full object
  }}
  onSearch={handleSearch}
  loading={loading}
  filterOption={false}
  allowClear
  style={{ width: "100%" }}
>
  {(filteredOptions || []).map((item) => (
    <Option key={item.subProcessId} value={item.gprnNo}>
      {item.gprnNo}
    </Option>
  ))}
</Select>

  );
};

export default PendingRejectedGiDropdown;
