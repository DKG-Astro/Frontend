import React from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const LineItem = ({
  form,
  materialList,
  projects,
  materialDetailsMap,
  calculateTotalPrice,
  handleMaterialSelect,
  handlePriceCalculation,
  showAndRemove = true
}) => {
  return (
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
                  paddingBottom: "5px",
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                {showAndRemove &&(
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
                        <Select placeholder="Select Material Description">
                          <Option value="Description 1">Description 1</Option>
                          <Option value="Description 2">Description 2</Option>
                          <Option value="Description 3">Description 3</Option>
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
                        <Select placeholder="Select UOM">
                          <Option value="Kg">Kg</Option>
                          <Option value="Litre">Litre</Option>
                          <Option value="Unit">Unit</Option>
                        </Select>
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
                        name={[name, "totalPrice"]}
                        label="Total Price"
                        shouldUpdate
                      >
                        <Input placeholder="Auto-calculated" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "materialOrJobCodeUsedByDept"]}
                        label="Material/Job Code Used By Dept"
                        style={{ width: "100%" }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                </Space>
              </div>
            ))}
            {showAndRemove && (
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
            )}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default LineItem;
