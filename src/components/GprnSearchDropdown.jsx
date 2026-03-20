import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { Option } = Select;

const GprnSearchDropdown = ({ label, value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
const { userId } = useSelector(state => state.auth);
/*
  useEffect(() => {
    const fetchGprns = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/api/process-controller/pendingGprnsForGi"
        );
        setOptions(response.data.responseData || []);
        setFilteredOptions(response.data.responseData || []);
      } catch (error) {
        setOptions([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGprns();
  }, []);*/
  useEffect(() => {
  const fetchGprns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/process-controller/pendingGprnsForGi?userId=${userId}`
      );

      setOptions(response.data.responseData || []);
      setFilteredOptions(response.data.responseData || []);
    } catch (error) {
      setOptions([]);
      setFilteredOptions([]);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchGprns();
  }
}, [userId]);

  const handleSearch = (input) => {
    if (!input) {
      setFilteredOptions(options);
      return;
    }
    const lowerInput = input.toLowerCase();
    const filtered = options.filter(
      (item) =>
        item.gprnNo.toLowerCase().includes(lowerInput) ||
        item.poId.toLowerCase().includes(lowerInput) ||
        item.vendorId.toLowerCase().includes(lowerInput) ||
        item.materialDescriptions.some((desc) => desc.toLowerCase().includes(lowerInput))
    );
    setFilteredOptions(filtered);
  };

  return (
    <div>
     {label && <label style={{ display: "block", marginBottom: 4 }}>{label}</label>}
    <Select
      showSearch
      placeholder="Select GPRN No"
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
      loading={loading}
      filterOption={false} // disables default client-side filtering
      allowClear
      style={{ width: "100%" }}
    >
      {filteredOptions.map((item) => (
        <Option key={item.subProcessId} value={item.gprnNo}>
          {item.gprnNo} {/* Only show GPRN No in dropdown */}
        </Option>
      ))}
    </Select>
    </div>
  );
};

export default GprnSearchDropdown;
