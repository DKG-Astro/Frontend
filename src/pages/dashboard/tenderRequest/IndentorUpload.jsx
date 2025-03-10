import React, { useEffect, useState } from 'react';
import { Spin, Empty, Card, Typography, Row, Col, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { apiCall } from '../../../utils/CommonFunctions';
import { useNavigate } from 'react-router-dom';
import Btn from '../../../components/DKG_Btn';

const { Title, Text } = Typography;

const IndentorUpload = ({ requestId }) => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({});
  const [error, setError] = useState(null);
  const [bidType, setBidType] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [formData, setFormData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({}); // Store uploaded files

  const [showDocs, setShowDocs] = useState({});

  const [docFileType, setDocFileType] = useState([])

  const fileDisplayNames = {
    uploadQualifiedVendorsFileName: "Qualified Vendors",
    uploadTechnicallyQualifiedVendorsFileName: "Technically Qualified Vendors",
    uploadCommeriallyQualifiedVendorsFileName: "Commercially Qualified Vendors",
    formationOfTechnoCommerialComitee: "Techno-Commercial Committee",
    responseFileName: "Response",
    responseForTechnicallyQualifiedVendorsFileName: "Response for Technically Qualified Vendors",
    responseForCommeriallyQualifiedVendorsFileName: "Response for Commercially Qualified Vendors",
    // uploadTechnicallyQualifiedVendorsFileName: "Technically Qualified Vendors",
//   uploadCommeriallyQualifiedVendorsFileName: "Commercially Qualified Vendors",
//   responseForTechnicallyQualifiedVendorsFileName: "Response for Technical Evaluation",
//   responseForCommeriallyQualifiedVendorsFileName: "Response for Commercial Evaluation"
  };

  useEffect(() => {
    const populateData = async () => {
      try {
        setLoading(true);

        const response = await apiCall(
          "GET",
          `/api/tender-evaluation/${requestId}`,
          localStorage.getItem("token")
        );

        const responseData = response.data.responseData;
        setBidType(responseData.bidType);
        setTotalValue(parseInt(responseData.totalValueOfTender));
        setFormData(responseData);

        if (responseData.bidType === "Single" && parseInt(responseData.totalValueOfTender || 0) < 1000000) {
          console.log("IF CASE")
          setShowDocs({
            uploadQualifiedVendorsFileName: true,
            responseFileName: true
          })
          setDocFileType({
            uploadQualifiedVendorsFileName: "Tender",
            responseFileName: "Indent"
          })
        }
        else if (responseData.bidType === "Single" && parseInt(responseData.totalValueOfTender || 0) > 1000000) {

          console.log("ELSE CASE:")
          setShowDocs({

            uploadQualifiedVendorsFileName: true,
            responseFileName: true,

          })

          setDocFileType({
            uploadQualifiedVendorsFileName: "Tender",
            responseFileName: "Indent"
          })
        }

        if (responseData.bidType === "Double") {
            const showDocsConfig = {
              uploadTechnicallyQualifiedVendorsFileName: true,
              responseForTechnicallyQualifiedVendorsFileName: true,
            };
      
            if (responseData.uploadCommeriallyQualifiedVendorsFileName) {
              showDocsConfig.uploadCommeriallyQualifiedVendorsFileName = true;
              showDocsConfig.responseForCommeriallyQualifiedVendorsFileName = true;
            }
      
            setShowDocs(showDocsConfig);
            setDocFileType({
              uploadTechnicallyQualifiedVendorsFileName: "Tender",
              responseForTechnicallyQualifiedVendorsFileName: "Indent",
              uploadCommeriallyQualifiedVendorsFileName: "Tender",
              responseForCommeriallyQualifiedVendorsFileName: "Indent"
            });
          }



        const fileKeys = Object.keys(fileDisplayNames);

        const filePromises = fileKeys.map(async (key) => {
          console.log("KEY: ", key, docFileType[key])
          if (responseData[key]) {
            try {
              const fileResponse = await axios.get(
                `/file/download/${"Tender"}/${responseData[key]}`,
                {
                  responseType: 'blob',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                }
              );

              const fileUrl = URL.createObjectURL(fileResponse.data);
              return { key, url: fileUrl, fileName: responseData[key] };
            } catch (err) {
              console.error(`Error fetching file ${key}:`, err);
              return { key, error: true };
            }
          } else {
            return { key, url: null, fileName: null };
          }
        });

        const results = await Promise.all(filePromises);

        const documentsObj = results.reduce((acc, item) => {
          acc[item.key] = item;
          return acc;
        }, {});

        setDocuments(documentsObj);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      populateData();
    }
  }, [requestId]);

  const handleFileChange = (fileKey, file) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fileKey]: file
    }));
  };

  const navigate = useNavigate();

  const uploadAllFiles = async () => {
    try {
      const updatedFormData = { ...formData };

      for (const [fileKey, file] of Object.entries(uploadedFiles)) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileType', 'Indent'); // Add fileType to the form data

          const uploadResponse = await axios.post('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          const uploadedFileName = uploadResponse.data.responseData.fileName;
          updatedFormData[fileKey] = uploadedFileName;
        }
      }

      // Call PUT API with updated formData
      await axios.put(
        `/api/tender-evaluation/${requestId}`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      message.success('All files uploaded and tender updated successfully.');
      navigate("/queue")
    } catch (err) {
      console.error("Error uploading files:", err);
      message.error('Failed to upload files. Please try again.');
    }
  };

  const renderDocumentPreview = (fileKey, fileData) => {
    if (!fileData || fileData.error || !fileData.url) {
      return (
        <Upload
          beforeUpload={(file) => {
            handleFileChange(fileKey, file);
            return false; // Prevent automatic upload
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      );
    }

    const fileExtension = fileData.fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileData.url} alt={fileDisplayNames[fileKey]} style={{ maxWidth: '100%' }} />;
    } else if (fileExtension === 'pdf') {
      return (
        <iframe
          src={fileData.url}
          title={fileDisplayNames[fileKey]}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
        />
      );
    } else {
      return (
        <div className="text-center p-4">
          <Text>File preview not available</Text>
          <div className="mt-2">
            <a
              href={fileData.url}
              download={fileData.fileName}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download File
            </a>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading documents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  const documentKeys = Object.keys(fileDisplayNames);

  return (
    <div className="p-4">
      <Btn onClick={() => navigate("/queue")} className="mb-4">Back</Btn>
      <Title level={3} className="mb-6">Tender Documents</Title>

      <Row gutter={[16, 16]}>
        {documentKeys.map((key) => (
          <Col xs={24} md={12} key={key} className={showDocs[key] ? 'block' : 'hidden'}>
            <Card
              title={fileDisplayNames[key]}
              className="h-full"
              extra={
                documents[key]?.url && (
                  <a
                    href={documents[key].url}
                    download={documents[key].fileName}
                    className="text-blue-500"
                  >
                    Download
                  </a>
                )
              }
            >
              <div className="document-preview" style={{ minHeight: '300px' }}>
                {renderDocumentPreview(key, documents[key])}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-8">
        <Button type="primary" onClick={uploadAllFiles}>
          Upload All
        </Button>
      </div>
    </div>
  );
};

export default IndentorUpload;
