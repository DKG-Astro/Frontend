import React, { useEffect, useState } from "react";
import { Form, Button,Select, message, Modal } from "antd";
import { ReloadOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import FormContainer from "../../components/DKG_FormContainer";
import FormInputItem from "../../components/DKG_FormInputItem";
import Heading from "../../components/DKG_Heading";

const EmployeeMaster = () => {
  const { employeeId } = useParams(); 
  const auth = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);

  // 🔹 Detect Edit Mode & fetch details
  useEffect(() => {
    if (employeeId) {
      setIsEditMode(true);
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);
  const [employeeList, setEmployeeList] = useState([]);

const searchEmployees = async (searchText) => {
  if (!searchText || searchText.trim().length < 2) {
    return [];
  }

  try {
    const response = await axios.get(`/api/employee-department-master/employeeSearch?keyword=${searchText}`);
    const data = response.data;

    if (Array.isArray(data?.responseData)) {
      return data.responseData.map((item) => ({
        label: `${item.employeeId} - ${item.employeeName} (${item.departmentName})`,
        value: item.employeeId,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Employee search error:", error);
    return [];
  }
};


  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`/api/employee-department-master/${id}`);
      const res = response.data?.responseData;
      if (res) {
        form.setFieldsValue({
          employeeId: res.employeeId,
          employeeName: res.employeeName,
          departmentName: res.departmentName,
          location: res.location,
          designation: res.designation,
          contactDetails: res.contactDetails,
        });
      }
    } catch (error) {
      message.error("Failed to load employee details");
      console.error(error);
    }
  };

  const onFinish = async (values) => {
  setLoading(true);
  try {
    const payload = {
      employeeName: values.employeeName,
      departmentName: values.departmentName,
      location: values.location,
      designation: values.designation,
      contactDetails: values.contactDetails,
      createdBy: auth.userId,
      updatedBy: String(auth.userId),
    };

    const currentEmployeeId = values.employeeId || employeeId;

    let response;
    if (currentEmployeeId) {
      // 🔹 Update existing employee
      response = await axios.put(`/api/employee-department-master/${currentEmployeeId}`, payload);
    } else {
      // 🔹 Create new employee
      response = await axios.post("/api/employee-department-master", payload);
    }

    const data = response.data?.responseData;
    if (data) {
      setCreatedEmployee(data);
     message.success(isEditMode ? "Employee updated successfully!" : "Employee created successfully!");
     setShowPopup(true);
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    const errMsg = error.response?.data?.responseStatus?.message || error.message;
    message.error(`Failed to ${values.employeeId ? "update" : "create"} employee: ${errMsg}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Heading title={isEditMode ? "Edit Employee Master" : "Create Employee Master"} />

        <div className="form-section">
             <Form.Item label="Search Employee">
      <Select
        showSearch
        placeholder="Type to search employee..."
        filterOption={false}
        onSearch={async (value) => {
          const results = await searchEmployees(value);
          setEmployeeList(Array.isArray(results) ? results : []);
        }}
        options={Array.isArray(employeeList) ? employeeList : []}
        onChange={async (selectedId) => {
            setIsEditMode(true);
          try {
            const response = await axios.get(`/api/employee-department-master/${selectedId}`);
            const data = response.data?.responseData;
            if (data) {
              form.setFieldsValue({
                employeeId: data.employeeId,
                employeeName: data.employeeName,
                departmentName: data.departmentName,
                location: data.location,
                designation: data.designation,
                contactDetails: data.contactDetails,
              });
              message.success("Employee details loaded successfully!");
            }
          } catch (error) {
            console.error("Error fetching employee details:", error);
            message.error("Failed to load employee details");
          }
        }}
        style={{ width: "100%" }}
      />
    </Form.Item>
          <FormInputItem
            label="Employee ID"
            name="employeeId"
            placeholder={isEditMode ? employeeId : "Auto-generated"}
            disabled
          />
          <FormInputItem
            label="Employee Name"
            name="employeeName"
            required
            placeholder="Enter employee name"
          />
          <FormInputItem
            label="Department"
            name="departmentName"
            required
            placeholder="Enter department name"
          />
        </div>

        <div className="form-section">
          <FormInputItem
            label="Designation"
            name="designation"
            required
            placeholder="Enter designation"
          />
          <FormInputItem
            label="Location"
            name="location"
            required
            placeholder="Enter location"
          />
          <FormInputItem
            label="Contact Details"
            name="contactDetails"
            required
            placeholder="Enter contact details"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Button htmlType="reset" icon={<ReloadOutlined />}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
            {isEditMode ? "Update" : "Submit"}
          </Button>
          <Button icon={<SaveOutlined />}>Save Draft</Button>
        </div>
      </Form>

      <Modal
  title={isEditMode ? "Employee Updated" : "Employee Created Successfully"}
  open={showPopup}
  onOk={() => setShowPopup(false)}
  onCancel={() => setShowPopup(false)}
  okText="OK"
>
  {createdEmployee && (
    <p>
      {isEditMode
        ? `Employee "${createdEmployee.employeeName}" (ID: ${createdEmployee.employeeId}) was updated successfully.`
        : `Employee "${createdEmployee.employeeName}" (ID: ${createdEmployee.employeeId}) was created successfully.`}
    </p>
  )}
</Modal>

    </FormContainer>
  );
};

export default EmployeeMaster;
