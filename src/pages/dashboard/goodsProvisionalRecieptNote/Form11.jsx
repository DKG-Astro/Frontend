import React, { useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Upload,
  Button,
  Col,
  Space,
  Row,
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
// import DKG_FormContainerzz from "../../../components/DKG_FormContainer";
// import React from "react";
import { useReactToPrint } from "react-to-print";
import FormContainer from "../../../components/DKG_FormContainer";
import FormBody from "../../../components/DKG_FormBody";
import FormInputItem from "../../../components/DKG_FormInputItem";
import InputDatePickerComb from "../../../components/DKG_InputDatepickerComb";
import CustomDatePicker from "../../../components/DKG_CustomTimePicker";
import Heading from "../../../components/DKG_Heading";
import DKG_FormNumberInputItem from "../../../components/DKG_FormInputNumberItem";
const { Option } = Select;

const Form11 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    ;
  };
//   const handlePrint = () => {
//     const printContent = document.getElementById("printable-form").innerHTML;
//     const originalContent = document.body.innerHTML;
  
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
//     window.location.reload(); // Reload to restore page after printing
//   };
const formRef = useRef();
const handlePrint = useReactToPrint({
    content: () => formRef.current,
  });
  

  return (
    <FormContainer ref={formRef} >
            <FormBody
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ UOM: "KG" }}
                >
                <Heading title="Goods Purchase Reciept Note" /> 
                <h6>General Details</h6>
                <div className="form-section">
                <FormInputItem label="GPRN No." name="GPRN" readOnly placeholder="Auto-generated" />

                <FormInputItem label="PO No." name="PO" placeholder="Enter PO Number" />

                <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                {/* <CustomDatePicker label="Date" name="date" required /> */}
                </div>

                <div className="form-section">
                {/* <Form.Item
                    label="Delivery Challan/Invoice No."
                    name="invoiceNo"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Invoice/Challan No." />
                </Form.Item> */}
                <FormInputItem label="Delivery Challan/Invoice No." name="invoiceNo" placeholder={"Enter Invoice no."} required />

                <Form.Item
                    label="Delivery Challan/Invoice Date"
                    name="invoiceDate"
                    rules={[{ required: true }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                {/* <Form.Item
                    label="Vendor ID"
                    name="vendorID"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Vendor ID" />
                </Form.Item> */}
                <FormInputItem label="Vendor ID" name="vendorID" placeholder="Enter Vendor ID" required />
                </div>

                <div className="form-section">
                {/* <Form.Item
                    label="Vendor Name"
                    name="vendorName"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Vendor Name" />
                </Form.Item> */}
                <FormInputItem label="Vendor Name" name="vendorName" placeholder="Enter Vendor Name" required />

                {/* <Form.Item
                    label="Vendor Email ID"
                    name="vendorEmail"
                    rules={[{ type: "email" }]}
                >
                    <Input placeholder="Enter Vendor Email" />
                </Form.Item> */}
                <FormInputItem label="Vendor Email ID" name="vendorEmail" placeholder="Enter Vendor Email" />

                {/* <Form.Item label="Vendor Contact No." name="vendorContact">
                    <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Contact Number"
                    />
                </Form.Item> */}
                <DKG_FormNumberInputItem label="Vendor Contact No." name="vendorContact" placeholder={"Enter Contact Number"}/>
                </div>
                <div className="form-section">
                <Form.Item
                    label="Field Station"
                    name="fieldStation"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Field Station" />
                </Form.Item>
                <Form.Item
                    label="Indentor Name"
                    name="indentorName"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Indentor Name" />
                </Form.Item>
                <Form.Item
                    label="Expected Date of Supply"
                    name="expectedDate"
                    rules={[{ required: true }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                </div>
                <div className="form-section">
                <Form.Item
                    label="Consignee Details"
                    name="consigneeDetails"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Consignee Details" />
                </Form.Item>
                <Form.Item label="Warranty Years" name="warrantyYears">
                    <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Contact Number"
                    />
                </Form.Item>
                <Form.Item label="Project" name="project">
                    <Input placeholder="Enter Project Associated" />
                </Form.Item>
                </div>
                <div className="form-section">
                <Form.Item label="Recieved Quantity" name="recievedQuantity">
                    <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Recieved Quantity"
                    />
                </Form.Item>
                <Form.Item label="Pending Quantity" name="pendingQuantity">
                    <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Pending Quantity"
                    />
                </Form.Item>
                <Form.Item label="Accepted Quantity" name="acceptedQuantity">
                    <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Accepted Quantity"
                    />
                </Form.Item>
                </div>
                <Form.Item
                label="Received By"
                name="receivedBy"
                rules={[{ required: true }]}
                style={{ width: "32%" }}
                >
                <Input />
                </Form.Item>
                <Form.Item label="Provisional Recipt Certificate" name="certificate">
                <Upload listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                </Form.Item>

                <h6>Material Details</h6>
                <div>
                <Form.List name="lineItems" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                        <div
                            key={key}
                            style={{
                            border: "1px solid #ccc",
                            padding: "20px",
                            marginBottom: "20px",
                            position: "relative",
                            }}
                        >
                            <DeleteOutlined
                            onClick={() => remove(name)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                            />
                            <Space
                            style={{
                                display: "flex",
                                marginBottom: 20,
                                flexWrap: "wrap",
                            }}
                            align="start"
                            >
                            <Row gutter={16}>
                                <Col span={8}>
                                <Form.Item
                                    label="Material Code"
                                    name="materialCode"
                                    rules={[{ required: true }]}
                                >
                                    <Input readOnly placeholder="Auto-generated" />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea
                                    placeholder="Enter Material Description"
                                    rows={1}
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item
                                    label="UOM"
                                    name="UOM"
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                    <Option value="KG">KG</Option>
                                    <Option value="Litre">Litre</Option>
                                    </Select>
                                </Form.Item>
                                </Col>

                                <Col span={8}>
                                <Form.Item
                                    label="Ordered Quantity"
                                    name="orderedQuantity"
                                    rules={[{ required: true }]}
                                >
                                    <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Enter Ordered Quantity"
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item
                                    label="Received Quantity"
                                    name="receivedQuantity"
                                    rules={[{ required: true }]}
                                >
                                    <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Enter Received Quantity"
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item
                                    label="Unit Price (Rs)"
                                    name="unitPrice"
                                    rules={[{ required: true }]}
                                >
                                    <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Enter Unit Price"
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Net Price (Rs)" name="netPrice">
                                    <InputNumber
                                    readOnly
                                    style={{ width: "100%" }}
                                    placeholder="Auto-calculated"
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Make No." name="makeNo">
                                    <Input placeholder="Manufacturer code or batch no." />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Model No." name="modelNo">
                                    <Input placeholder="Enter Model No." />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Serial No." name="serialNo">
                                    <Input placeholder="Enter Serial No." />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Warranty" name="warranty">
                                    <Input.TextArea
                                    rows={1}
                                    placeholder="Enter Warranty terms"
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={8}>
                                <Form.Item label="Notes" name="notes">
                                    <Input.TextArea
                                    rows={1}
                                    placeholder="Additional remarks"
                                    />
                                </Form.Item>
                                </Col>
                            </Row>
                            </Space>
                        </div>
                        ))}
                        <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                            style={{ width: "32%" }}
                        >
                            Add Item
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                </div>
                <Form.Item label="Attach Photograph" name="photograph">
                <Upload listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                </Form.Item>

                <Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type="default" htmlType="reset">
                    <ReloadOutlined />
                    Reset
                    </Button>
                    <Button type="primary" htmlType="submit">
                    <SendOutlined />
                    Submit
                    </Button>
                    <Button type="dashed" htmlType="button">
                    <SaveOutlined />
                    Save Draft
                    </Button>
                    <Button type="default" onClick={()=>handlePrint(formRef)}>
                    <PrinterOutlined />
                    Print
                    </Button>
                </div>
                </Form.Item>
            </FormBody>
    </FormContainer>
  );
};

export default Form11;
