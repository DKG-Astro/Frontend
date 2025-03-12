import React, { useEffect, useState } from 'react'
import axios from 'axios';
import FileUpload from '../../../components/DKG_FileUpload';
import FormContainer from '../../../components/DKG_FormContainer';
import FormBody from '../../../components/DKG_FormBody';
import Heading from '../../../components/DKG_Heading';
import Btn from '../../../components/DKG_Btn';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TenderEvaluator = ({bidType, tenderId}) => {
    const {userId} = useSelector(state => state.auth)

    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    // Add the missing formData state
    const [formData, setFormData] = useState(null);
    
    // Add mapping for different bid types
    const bidTypeDocMapping = {
      "Single": {
        docName: "vendorUploadSingle",
        fileName: "uploadQualifiedVendorsFileName",
        displayName: "Upload Qualified Vendors"
      },
      "Double": {
        docName: "vendorUploadTwo",
        fileName: "uploadTechnicallyQualifiedVendorsFileName",
        displayName: "Upload Technically Qualified Vendors"
      },
      "Three": {
        docName: "vendorUploadThree",
        fileName: "uploadCommeriallyQualifiedVendorsFileName",
        displayName: "Upload Commercially Qualified Vendors"
      }
    };

    const handleDocChange = (docName, fileData) => {
      if (fileData === null) {
        setUploadedDocs(prev => prev.filter(doc => doc.name !== docName));
      } else {
        // Just store the file locally without uploading
        setUploadedDocs(prev => {
          const existingDocIndex = prev.findIndex(doc => doc.name === docName);
          const newDoc = {
            name: docName,
            file: {
              ...fileData.file,
              originFileObj: fileData.file.originFileObj,
              preview: fileData.file.preview
            },
            fileType: fileData.fileType
          };
          
          if (existingDocIndex >= 0) {
            const newDocs = [...prev];
            newDocs[existingDocIndex] = newDoc;
            return newDocs;
          } else {
            return [...prev, newDoc];
          }
        });
      }
    };

    useEffect(() => {
        const fetchTenderData = async () => {
          try {
            const response = await axios.get(`/api/tender-evaluation/${tenderId}`);
            setFormData(response.data.responseData);
          } catch (error) {
            console.error('Error fetching tender data:', error);
          }
        };
        
        if (tenderId) {
          fetchTenderData();
        }
      }, [tenderId]);

    // Get document data
    const getDocData = (docName) => {
      return uploadedDocs.find(doc => doc.name === docName) || null;
    };
    
    // Handle form submission - upload all files
    const handleSubmit = async () => {
      if (uploadedDocs.length === 0) {
        message.warning('Please upload at least one document');
        return;
      }
      
      setIsUploading(true);
      
      try {
        // First API: Upload files
        const uploadPromises = uploadedDocs
          .filter(doc => doc.file?.originFileObj)
          .map(doc => {
            const formData = new FormData();
            formData.append('file', doc.file.originFileObj);
            
            return axios.post(
              '/file/upload?fileType=Tender',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Accept': 'application/json'
                }
              }
            ).then(response => ({
              docName: doc.name,
              response: response.data,
              originalFileName: doc.file.name
            }));
          });
        
        const results = await Promise.all(uploadPromises);
        
        // Get server file names
        const serverFileNames = {};
        results.forEach(result => {
          serverFileNames[result.docName] = result.response.responseData.fileName;
        });

        let evaluationResponse;
        
        // Check if we're updating an existing evaluation with commercial qualification
        if (bidType === "Double" && formData && formData.responseForTechnicallyQualifiedVendorsFileName) {
          // Use PUT to update with commercial qualification
          const updateBody = {
            ...formData,
            uploadCommeriallyQualifiedVendorsFileName: serverFileNames.vendorUploadThree,
            updatedBy: userId
          };
          
          evaluationResponse = await axios.put(
            `/api/tender-evaluation/${tenderId}`,
            updateBody,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        } else {
          // Original POST for new evaluation
          const tenderEvaluationBody = {
            tenderId: tenderId,
            fileType: "Tender",
            createdBy: userId,
            updatedBy: userId
          };
          
          // Add the appropriate file name based on bid type
          if (bidType === "Single") {
            tenderEvaluationBody.uploadQualifiedVendorsFileName = serverFileNames.vendorUploadSingle;
          } else if (bidType === "Double") {
            tenderEvaluationBody.uploadTechnicallyQualifiedVendorsFileName = serverFileNames.vendorUploadTwo;
          }

          evaluationResponse = await axios.post(
            '/api/tender-evaluation',
            tenderEvaluationBody,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }
        
        setFormData(evaluationResponse.data.responseData);

        if (evaluationResponse.data.responseStatus.statusCode === 0) {
          message.success('Documents uploaded and evaluation submitted successfully');
          navigate("/queue");
        } else {
          throw new Error('Tender evaluation submission failed');
        }
        
      } catch (error) {
        console.error('Error during submission:', error);
        message.error('Failed to complete the process');
      } finally {
        setIsUploading(false);
      }
    };

    const navigate = useNavigate();
    
  return (
    <FormContainer>
      <Btn onClick={() => navigate("/queue")} className="mb-4">Back</Btn>
      <Heading title={`Tender Evaluation for Tender ID: ${tenderId} and Bid Type: ${bidType}`} />
      
      <div>
        {/* For Single bid type */}
        {bidType === "Single" && (
          <FileUpload
            documentName={bidTypeDocMapping[bidType].displayName}
            fileType="image"
            value={getDocData(bidTypeDocMapping[bidType].docName)}
            onChange={(fileData) => handleDocChange(bidTypeDocMapping[bidType].docName, fileData)}
            fileName={bidTypeDocMapping[bidType].fileName}
          />
        )}
        
        {/* For Double bid type - Technical evaluation */}
        {bidType === "Double" && (!formData || !formData.responseForTechnicallyQualifiedVendorsFileName) && (
          <FileUpload
            documentName={bidTypeDocMapping[bidType].displayName}
            fileType="image"
            value={getDocData(bidTypeDocMapping[bidType].docName)}
            onChange={(fileData) => handleDocChange(bidTypeDocMapping[bidType].docName, fileData)}
            fileName={bidTypeDocMapping[bidType].fileName}
          />
        )}
        
        {/* For Double bid type - Commercial evaluation (when technical is already done) */}
        {bidType === "Double" && formData && formData.responseForTechnicallyQualifiedVendorsFileName && (
          <FileUpload
            documentName="Upload Commercially Qualified Vendors"
            fileType="image"
            value={getDocData("vendorUploadThree")}
            onChange={(fileData) => handleDocChange("vendorUploadThree", fileData)}
            fileName="uploadCommeriallyQualifiedVendorsFileName"
          />
        )}
      </div>

      <div className="custom-btn" style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={handleSubmit} loading={isUploading}>Upload All Documents And Approve</Btn>
      </div>
    </FormContainer>
  )
}

export default TenderEvaluator
