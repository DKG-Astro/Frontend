import React, { useState } from "react";
import { Button, message, Form, Input } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
const DownloadFile = ({ fileName, fileLabel, onDownloadSuccess, value, onChange }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const url = `/documents/${fileName}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();

      message.success("File download started!");
      if (onDownloadSuccess) onDownloadSuccess(fileName);
      
      // Mark the field as "filled" so validation passes
      onChange(fileName); 
    } catch {
      message.error("Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden input to make form validation work */}
      <Input type="hidden" value={value} onChange={e => onChange(e.target.value)} />
      <Button
        icon={<DownloadOutlined />}
        loading={downloading}
        onClick={handleDownload}
      >
        {fileLabel || "Download File"}
      </Button>
    </>
  );
};

export default DownloadFile;
