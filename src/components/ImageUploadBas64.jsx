import React, { useState } from 'react';
import { Upload, Button, Form } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const ImageUploadBase64 = ({ value, onChange, required, label, name, multiple = false }) => {
  const [previewData, setPreviewData] = useState(multiple ? (value || []) : (value || ''));
  const [fileNames, setFileNames] = useState(multiple ? [] : '');

  const handleFileChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj;
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        if (multiple) {
          const newPreviewData = [...previewData, base64String];
          const newFileNames = [...fileNames, file.name];
          setPreviewData(newPreviewData);
          setFileNames(newFileNames);
          onChange(name, newPreviewData);
        } else {
          setPreviewData(base64String);
          setFileNames(file.name);
          onChange(name, base64String);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (index) => {
    if (multiple) {
      const newPreviewData = previewData.filter((_, i) => i !== index);
      const newFileNames = fileNames.filter((_, i) => i !== index);
      setPreviewData(newPreviewData);
      setFileNames(newFileNames);
      onChange(name, newPreviewData);
    } else {
      setPreviewData('');
      setFileNames('');
      onChange(name, '');
    }
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
          accept="image/*,.pdf"
          multiple={multiple}
          showUploadList={false}
          beforeUpload={(file) => {
            handleFileChange({ file: { originFileObj: file } });
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>
            {multiple ? 'Add Files' : (previewData ? 'Change File' : 'Upload File')}
          </Button>
        </Upload>

        <div className="grid grid-cols-2 gap-4">
          {multiple ? (
            previewData.map((preview, index) => (
              <div key={index} className="relative mt-2">
                {fileNames[index]?.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={preview}
                    title={`PDF Preview ${index + 1}`}
                    className="w-[200px] h-[200px] border rounded"
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="max-w-[200px] max-h-[200px] object-contain border rounded"
                  />
                )}
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2"
                />
                {fileNames[index] && (
                  <div className="text-sm text-gray-600 mt-1">{fileNames[index]}</div>
                )}
              </div>
            ))
          ) : (
            previewData && (
              <div className="relative mt-2">
                {fileNames?.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={previewData}
                    title="PDF Preview"
                    className="w-[200px] h-[200px] border rounded"
                  />
                ) : (
                  <img
                    src={previewData}
                    alt="Preview"
                    className="max-w-[200px] max-h-[200px] object-contain border rounded"
                  />
                )}
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDelete()}
                  className="absolute top-2 right-2"
                />
                {fileNames && (
                  <div className="text-sm text-gray-600 mt-1">{fileNames}</div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </Form.Item>
  );
};

export default ImageUploadBase64;
