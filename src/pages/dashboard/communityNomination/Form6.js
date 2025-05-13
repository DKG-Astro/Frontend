import React from 'react';
import { Form, Input, Select, Button } from 'antd';

// const { Option } = Select;

const Form6 = () => {
  const onFinish = (values) => {
    ;
  };

  return (
    <div className='form-container'>
        <h2>Committee Formation</h2>
        <Form onFinish={onFinish} layout="vertical">
        <div className='form-section'>
            <Form.Item name="indentValue" label="Indent Value" rules={[{ required: true, message: 'Please enter the indent value' }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="committeeMembers" label="Committee Members" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select committee members">
                {/* Dynamic member options */}
                </Select>
            </Form.Item>
            <Form.Item name="chairperson" label="Chairperson" rules={[{ required: true }]}>
                <Select placeholder="Select chairperson">
                {/* Dynamic chairperson options */}
                </Select>
            </Form.Item>
        </div>
        <Form.Item name="roleAssignment" label="Role Assignment" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Assign roles to members" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
        </Form>
    </div>
  );
};

export default Form6;
