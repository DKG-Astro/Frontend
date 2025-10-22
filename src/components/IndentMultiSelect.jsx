import React from "react";
import { Select, message } from "antd";

const IndentMultiSelect = ({ value = [], approvedIndents = [], onChange }) => {
  const handleChange = (selectedIds) => {
    const selectedIndents = approvedIndents.filter(indent => selectedIds.includes(indent.value));
    const projectNames = [...new Set(selectedIndents.map(i => i.projectName))];

    if (projectNames.length > 1) {
      message.error("All selected indents must belong to the same project");
      return;
    }

    onChange(selectedIds, projectNames[0]);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select Indent IDs"
      showSearch
      value={value}
      optionFilterProp="label"
      onChange={handleChange}
      options={approvedIndents.map(indent => ({
        label: `${indent.value} - ${indent.projectName}`,
        value: indent.value,
      }))}
    />
  );
};

export default IndentMultiSelect;
