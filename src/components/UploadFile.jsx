import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadFile = ({ fileType, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    try {
      const response = await axios.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const result = response.data;
      if (
        result.responseStatus &&
        result.responseStatus.statusCode === 0 &&
        result.responseData &&
        result.responseData.fileName
      ) {
        message.success("File uploaded successfully!");
        const newFileNames = [...fileNames, result.responseData.fileName];
        setFileNames(newFileNames);
        // Call onUploadSuccess with comma-separated file names
        if (onUploadSuccess) {
          onUploadSuccess(newFileNames.join(", "));
        }
        onSuccess(result, file);
      } else {
        message.error("File upload failed.");
        onError(new Error("Upload failed"));
      }
    } catch (error) {
      message.error("File upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Upload
      customRequest={customRequest}
      showUploadList={true}
      accept="*"
      multiple={true}
      disabled={uploading}
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        Upload File(s)
      </Button>
    </Upload>
  );
};

export default UploadFile;