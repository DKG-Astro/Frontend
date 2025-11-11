import React, { useState, useEffect } from "react";
import { Form, Button, message, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import FormContainer from "../../components/DKG_FormContainer";
import FormInputItem from "../../components/DKG_FormInputItem";
import Heading from "../../components/DKG_Heading";
import CustomSelect from "../../components/CustomSelect";

const { Option } = Select;

const VendorMasterForm = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [vendorType, setVendorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [vendorStatus, setVendorStatus] = useState("");


  // Load all countries
  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  // Load vendor IDs + names
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "/api/vendor-master/vendorIdVendorName"
        );
        setVendorList(response.data?.responseData || []);
      } catch (err) {
        message.error("Failed to load vendors");
      }
    };
    fetchVendors();
  }, []);

  // Fetch vendor details by ID
  const handleVendorSelect = async (vendorId) => {
    try {
      const response = await axios.get(
        `/api/vendor-master/vendor/${vendorId}`
      );
      const vendor = response.data?.responseData;
      if (!vendor) return message.error("No vendor details found");

      // Autofill form fields
      form.setFieldsValue({
        ...vendor,
        city: vendor.place,
        status: vendor.statusOfVendorActiveOrDebar ,
        registeredPlatform: vendor.registeredPlatform ? true : false,
      });
      setVendorStatus(vendor.statusOfVendorActiveOrDebar);

      setVendorType(vendor.vendorType);

      if (vendor.country) {
        setSelectedCountry(vendor.country);
        setStateList(State.getStatesOfCountry(vendor.country));
      }
      if (vendor.state) {
        setSelectedState(vendor.state);
        setCityList(City.getCitiesOfState(vendor.country, vendor.state));
      }
    } catch (err) {
      message.error("Failed to fetch vendor details");
    }
  };

  // Handle country change
  const handleCountryChange = (val) => {
    setSelectedCountry(val);
    setSelectedState(undefined);
    setStateList(State.getStatesOfCountry(val));
    setCityList([]);
    form.setFieldsValue({ state: undefined, city: undefined });
  };

  // Handle state change
  const handleStateChange = (val) => {
    setSelectedState(val);
    setCityList(City.getCitiesOfState(selectedCountry, val));
    form.setFieldsValue({ city: undefined });
  };

  // UPDATE API integration
  const handleUpdate = async (values) => {
    console.log("roleName" + auth.role)
    if (auth.role !== "Purchase personnel") { 

    message.warning("You are not authorized to update vendor details.");
    return;
  }

    if (!values.vendorId) {
      return message.error("Please select a Vendor to update");
    }

    setLoading(true);
    try {
      const payload = {
        vendorName: values.vendorName,
        vendorType: values.vendorType,
        contactNo: values.contactNo,
        emailAddress: values.emailAddress,
        registeredPlatform: values.registeredPlatform,
        pfmsVendorCode: values.pfmsVendorCode,
        primaryBusiness: values.primaryBusiness,
        address: values.address,
        alternateEmailOrPhoneNumber: values.alternateEmailOrPhoneNumber,
        panNo: values.panNo,
        gstNo: values.gstNo,
        bankName: values.bankName,
        accountNo: values.accountNo,
        ifscCode: values.ifscCode,
        purchaseHistory: values.purchaseHistory,
        swiftCode: values.swiftCode,
        bicCode: values.bicCode,
        ibanAbaNumber: values.ibanAbaNumber,
        sortCode: values.sortCode,
        bankRoutingNumber: values.bankRoutingNumber,
        bankAddress: values.bankAddress,
        country: values.country,
        state: values.state,
        place: values.city,
        updatedBy: actionPerformer,
        status : values.status,
        reasonForDebar: values.reasonForDebar || null,

      };

      await axios.put(
        `/api/vendor-master/update/${values.vendorId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      message.success("Vendor updated successfully!");
    } catch (err) {
      message.error("Failed to update vendor: " + err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("vendorStaus"+ vendorStatus)
  return (
    <FormContainer>
      <Heading title="Vendor Master" />
      <Form
        layout="vertical"
        form={form}
        onFinish={handleUpdate}
        onFinishFailed={() => message.error("Please fill all required fields")}
      >
        <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Vendor ID Dropdown */}
      <Form.Item
  label="Vendor ID"
  name="vendorId"
  rules={[{ required: true }]}
>
  <Select
    showSearch
    placeholder="Select Vendor"
    onChange={handleVendorSelect}
    optionFilterProp="data-search"
    filterOption={(input, option) =>
      option?.props["data-search"]
        ?.toLowerCase()
        .includes(input.toLowerCase())
    }
  >
    {vendorList.map((v) => (
      <Option
        key={v.vendorId}
        value={v.vendorId}
        data-search={`${v.vendorId} ${v.vendorName} ${v.primaryBusiness}`} //searchable text
      >
        {`${v.vendorId} - ${v.vendorName}`} 
      </Option>
    ))}
  </Select>
</Form.Item>
<CustomSelect
  label="Status"
  name="status"
  options={[
    { label: "Active", value: "Active" },
    { label: "Debar", value: "Debar" },
  ]}
 onChange={(name, value) => setVendorStatus(value)}
  rules={[{ required: true }]}
/>





</div>
{vendorStatus === "Debar" && (
  <FormInputItem
    label="Reason for Debar"
    name="reasonForDebar"
    rules={[{ required: true, message: "Please provide a reason for debar" }]}
  />
)}

        {/* Vendor Basic Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInputItem label="Vendor Name" name="vendorName" rules={[{ required: true }]} />
          <CustomSelect
            label="Vendor Type"
            name="vendorType"
            value={vendorType}
            options={[
              { label: "Domestic", value: "Domestic" },
              { label: "International", value: "International" },
            ]}
            onChange={(v) => setVendorType(v)}
            rules={[{ required: true }]}
          />
          <FormInputItem label="Vendor Email" name="emailAddress" rules={[{ required: true }]} />
          <FormInputItem label="Contact Number" name="contactNo" rules={[{ required: true }]} />
          <Form.Item label="Registered in GeM/ CPP Portal" name="registeredPlatform">
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <FormInputItem label="PFMS Vendor Code" name="pfmsVendorCode" />
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CustomSelect
            label="Primary Business"
            name="primaryBusiness"
            options={[
              { label: "Chemicals", value: "Chemicals" },
              { label: "Computers & Peripherals", value: "Computers & Peripherals" },
              { label: "Electricals", value: "Electricals" },
              { label: "Electronics", value: "Electronics" },
              { label: "Optics", value: "Optics" },
              { label: "Fabrication", value: "Fabrication" },
              { label: "Furniture", value: "Furniture" },
              { label: "Hardware", value: "Hardware" },
              { label: "Instrument/ Equipment & Machinery", value: "Instrument/ Equipment & Machinery" },
              { label: "Software", value: "Software" },
              { label: "Vehicles", value: "Vehicles" },
              { label: "Stationary", value: "Stationary" },
              { label: "Miscellaneous", value: "Miscellaneous" },
              { label: "Services", value: "Services" },
            ]}
            rules={[{ required: true }]}
          />
          <FormInputItem label="Alternate Email / Phone Number" name="alternateEmailOrPhoneNumber" />
          <FormInputItem label="PAN Number" name="panNo" disabled={vendorType === "International"} />
          <FormInputItem label="GST Number" name="gstNo" disabled={vendorType === "International"} />
        </div>

        {/* Bank Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInputItem label="Bank Name" name="bankName" rules={[{ required: true }]} />
          <FormInputItem label="Account Number" name="accountNo" rules={[{ required: true }]} />
          <FormInputItem label="IFSC Code" name="ifscCode" disabled={vendorType === "International"} />

          {vendorType === "International" && (
            <>
              <FormInputItem label="SWIFT Code" name="swiftCode" />
              <FormInputItem label="BIC Code" name="bicCode" />
              <FormInputItem label="IBAN/ABA Number" name="ibanAbaNumber" />
              <FormInputItem label="Sort Code" name="sortCode" />
              <FormInputItem label="Bank Routing Number" name="bankRoutingNumber" />
              <FormInputItem label="Bank Address" name="bankAddress" />
            </>
          )}
        </div>

        {/* Address & Location */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInputItem label="Full Address" name="address" rules={[{ required: true }]} />

          <CustomSelect
            label="Country"
            name="country"
            value={selectedCountry}
            options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
            onChange={handleCountryChange}
            rules={[{ required: true }]}
          />

          <CustomSelect
            label="State"
            name="state"
            value={selectedState}
            options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
            onChange={handleStateChange}
            rules={[{ required: true }]}
          />

          <CustomSelect
            label="City"
            name="city"
            value={form.getFieldValue("city")}
            options={cityList.map((c) => ({ label: c.name, value: c.name }))}
            rules={[{ required: true }]}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button icon={<ReloadOutlined />} htmlType="reset">
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default VendorMasterForm;
