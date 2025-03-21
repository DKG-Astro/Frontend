import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, Row, Col, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CustomSelect from "../../components/CustomSelect";
import { useSelector } from "react-redux";

const { Option } = Select;

const LineItem = ({
  form,
  materialList,
  projects,
  materialDetailsMap,
  calculateTotalPrice,
  handleMaterialSelect,
  handlePriceCalculation,
  handleMaterialDescriptionSelect,
  showAndRemove = true,
}) => {
  const [materialsList, setMaterialsList] = useState([]);
  const [materialDetailMap, setMaterialDetailMap] = useState({});
  const [materialCategories, setMaterialCategories] = useState([]);
  const [materialSubcategories, setMaterialSubcategories] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);

  const fetchInitialData = async () => {
    try {
      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/material-master"
      );
      const data = await response.json();

      if (!data.responseData) throw new Error("Invalid material data");

      // Extract unique categories and subcategories
      const categories = [
        ...new Set(data.responseData.map((item) => item.category)),
      ];
      const subCategories = [
        ...new Set(data.responseData.map((item) => item.subCategory)),
      ];

      setMaterialCategories(categories);
      setMaterialSubcategories(subCategories);

      // Create material map for other fields
      const materialMap = data.responseData.reduce(
        (acc, material) => ({
          ...acc,
          [material.materialCode]: {
            ...material,
            materialDescription: material.description,
            materialCategory: material.category,
            materialSubCategory: material.subCategory,
          },
        }),
        {}
      );

      setMaterialDetailMap(materialMap);
      setMaterialsList(Object.keys(materialMap));
      const uomResponse = await fetch(
        "http://103.181.158.220:8081/astro-service/api/uom-master"
      );
      const uomData = await uomResponse.json();

      if (!uomData.responseData) throw new Error("Invalid UOM data");

      // Process UOM data
      const processedUom = uomData.responseData.map((uom) => ({
        value: uom.uomCode,
        label: uom.uomName,
      }));
      setUomOptions(processedUom);
    } catch (error) {
      message.error("Failed to load materials");
      console.error("Material fetch error:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Add new state
  const [procurementMode, setProcurementMode] = useState("");
  const { vendorMaster } = useSelector((state) => state.masters);
  const vendorMasterMod = vendorMaster?.map((vendor) => ({
    label: vendor.vendorName,
    value: vendor.vendorName,
  }));
  return (
    <div>
      <Form.List name="lineItems" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              const modeOfProcurement = form.getFieldValue([
                "lineItems",
                name,
                "modeOfProcurement",
              ]);
              return (
                <div
                  key={key}
                  style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    paddingBottom: "5px",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                >
                  {showAndRemove && (
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
                  )}
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
                          name={[name, "materialCode"]}
                          label="Material Code"
                          rules={[
                            {
                              required: true,
                              message: "Please select a material code!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Material Code"
                            showSearch // Add this
                            optionFilterProp="children" // Add this
                            filterOption={(
                              input,
                              option // Add this filter
                            ) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            onChange={(value) =>
                              handleMaterialSelect(index, value)
                            }
                          >
                            {materialList.map((code) => (
                              <Option key={code} value={code}>
                                {code}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "materialDescription"]}
                          label="Material Description"
                          rules={[
                            {
                              required: true,
                              message: "Please select a material description!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Material Description"
                            showSearch
                            onChange={(value) =>
                              handleMaterialDescriptionSelect(index, value)
                            }
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {Object.values(materialDetailsMap).map(
                              (material) => (
                                <Option
                                  key={material.materialCode}
                                  value={material.materialCode}
                                >
                                  {material.description}
                                </Option>
                              )
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Quantity"
                          rules={[
                            {
                              required: true,
                              message: "Please enter quantity!",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter Quantity"
                            onChange={(e) =>
                              handlePriceCalculation(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "unitPrice"]}
                          label="Unit Price"
                          rules={[
                            {
                              required: true,
                              message: "Please enter unit price!",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter Unit Price"
                            onChange={(e) =>
                              handlePriceCalculation(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "uom"]}
                          label="UOM"
                          rules={[
                            { required: true, message: "Please select UOM!" },
                          ]}
                        >
                          <Input placeholder="Enter UOM" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "budgetCode"]}
                          label="Budget Code"
                          rules={[
                            {
                              required: true,
                              message: "Please select a budget code!",
                            },
                          ]}
                        >
                          <Select placeholder="Select Budget Code">
                            {projects.map((project) => (
                              <Option
                                key={project.projectCode}
                                value={project.projectCode}
                              >
                                {project.budgetType}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "materialCategory"]}
                          label="Material Category"
                          rules={[
                            {
                              required: true,
                              message: "Please enter material category!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Material Category" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "materialSubcategory"]}
                          label="Material Subcategory"
                          rules={[
                            {
                              required: true,
                              message: "Please enter material subcategory!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Material Subcategory" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "modeOfProcurement"]}
                          label="Mode of Procurement"
                        >
                          <Select
                            placeholder="Select Mode of Procurement"
                            onChange={() => {
                              // Clear vendor names when mode changes
                              form.setFieldValue(
                                ["lineItems", name, "vendorNames"],
                                undefined
                              );
                            }}
                          >
                            <Option value="GEM">GEM</Option>
                            <Option value="Brand PAC">Brand PAC</Option>
                            <Option value="Proprietary/Single Tender">
                              Proprietary/Single Tender
                            </Option>
                            <Option value="Limited Pre Approved Vendor Tender">
                              Limited Pre Approved Vendor Tender
                            </Option>
                            <Option value="Open Tender">Open Tender</Option>
                            <Option value="Global Tender">Global Tender</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {/* Vendor Selection */}
                      {/* <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "vendorNames"]}
                        label="Vendor Names"
                        rules={[
                          {
                            required: ["Proprietary/Single Tender", "Limited Pre Approved Vendor Tender"].includes(
                              modeOfProcurement
                            ),
                            message: "Vendor selection is required",
                          },
                        ]}
                      >
                        {modeOfProcurement === "Proprietary/Single Tender" ? (
                          <CustomSelect
                            options={vendorMasterMod}
                            placeholder="Select Vendor"
                          />
                        ) : modeOfProcurement ===
                          "Limited Pre Approved Vendor Tender" ? (
                          <CustomSelect
                            options={vendorMasterMod}
                            mode="multiple"
                            placeholder="Select Vendors"
                          />
                        ) :(
                            <Input placeholder="Vendors from material master" disabled />
                        )}
                      </Form.Item>
                    </Col> */}
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "totalPrice"]}
                          label="Total Price"
                          shouldUpdate
                        >
                          <Input placeholder="Auto-calculated" />
                        </Form.Item>
                      </Col>
                      {/* <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "materialOrJobCodeUsedByDept"]}
                        label="Material/Job Code Used By Dept"
                        style={{ width: "100%" }}
                      >
                        <Input />
                      </Form.Item>
                    </Col> */}
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "vendorNames"]}
                          label="Vendor Names"
                        >
                          <Input.TextArea
                            disabled
                            placeholder="Vendors from material master"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                  </Space>
                </div>
              );
            })}
            {showAndRemove && (
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: "32%" }}
                >
                  Add Material
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default LineItem;
