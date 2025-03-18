import React, { useState } from 'react';
import { Upload, Button, Form } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const ImageUploadBase64 = ({ value, onChange, required, label, name }) => {
  const [preview, setPreview] = useState(value || '');

  const handleImageChange = (info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        onChange(name, base64String);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleDelete = () => {
    setPreview('');
    onChange('');
  };

  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      className="mb-0"
    >
      <div className="flex flex-col gap-2">
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            handleImageChange({ file: { originFileObj: file } });
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>
        </Upload>
        
        {preview && (
          <div className="relative mt-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-[200px] max-h-[200px] object-contain border rounded"
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleDelete}
              className="absolute top-2 right-2"
            />
          </div>
        )}
      </div>
    </Form.Item>
  );
};

export default ImageUploadBase64;