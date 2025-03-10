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
    const [formData, setFormData] = useState(null);
    const [fileNameMapping, setFileNameMapping] = useState([]);  // Add this state


    console.log("Uploaded docs: ", uploadedDocs)

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

        // Second API: Tender Evaluation
        const tenderEvaluationBody = {
            tenderId: tenderId,
            uploadQualifiedVendorsFileName: serverFileNames.vendorUploadSingle,
            uploadTechnicallyQualifiedVendorsFileName: serverFileNames.vendorUploadTechnical,
            uploadCommeriallyQualifiedVendorsFileName: serverFileNames.vendorUploadCommercial,
            fileType: "Tender",
            createdBy: userId,
            updatedBy: userId
        };

        const evaluationResponse = await axios.post(
          '/api/tender-evaluation',
          tenderEvaluationBody,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
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
            {
        bidType === "Single" && (
          <FileUpload
            documentName="Upload Qualified Vendors"
            fileType="image"
            value={getDocData("vendorUploadSingle")}
            onChange={(fileData) => handleDocChange("vendorUploadSingle", fileData)}
            fileName="uploadQualifiedVendorsFileName"
          />
        )
      }
      {bidType === "Double" && (
        <>
          <FileUpload
            documentName="Upload Technically Qualified Vendors"
            fileType="image"
            value={getDocData("vendorUploadTechnical")}
            onChange={(fileData) => handleDocChange("vendorUploadTechnical", fileData)}
            fileName="uploadTechnicallyQualifiedVendorsFileName"
          />
          
          {/* Check formData existence before accessing properties */}
          {formData?.responseForTechnicallyQualifiedVendorsFileName && (
            <FileUpload
              documentName="Upload Commercially Qualified Vendors"
              fileType="image"
              value={getDocData("vendorUploadCommercial")}
              onChange={(fileData) => handleDocChange("vendorUploadCommercial", fileData)}
              fileName="uploadCommeriallyQualifiedVendorsFileName"
            />
          )}
        </>
      )}
    </div>

      <div className="custom-btn" style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={handleSubmit} loading={isUploading}>Upload All Documents And Approve</Btn>
      </div>
    </FormContainer>
  )
}

export default TenderEvaluator
