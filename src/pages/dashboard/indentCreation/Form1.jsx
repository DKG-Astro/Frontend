// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   Upload,
//   DatePicker,
//   Checkbox,
//   Space,
//   Row,
//   Col,
//   message,
// } from "antd";
// import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
// import TextArea from "antd/es/input/TextArea";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import { useSelector } from "react-redux";
// import LineItem from "../LineItem";
// dayjs.extend(customParseFormat);

// const { Option } = Select;

// const Form1 = () => {
//   const auth = useSelector((state) => state.auth);
//   const actionPerformer = auth.userId;
//   const [form] = Form.useForm();
//   const [preBidRequired, setPreBidRequired] = useState(false);
//   const [rateContractIndent, setRateContractIndent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [materialList, setMaterialList] = useState([]);
//   const [materialDetailsMap, setMaterialDetailsMap] = useState({});
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           "http://103.181.158.220:8081/astro-service/api/project-master"
//         );
//         const data = await response.json();

//         if (
//           data.responseStatus.statusCode === 0 &&
//           Array.isArray(data.responseData)
//         ) {
//           setProjects(data.responseData);
//         } else {
//           message.error("Failed to project data");
//         }
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         message.error("Failed to fetch project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleSearch = async () => {
//     const indentorId = form.getFieldValue("indentId");
//     if (!indentorId) {
//       message.error("Please enter an Indent ID");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://103.181.158.220:8081/astro-service/api/indents/${indentorId}`
//       );

//       if (!response.ok)
//         throw new Error(`Failed to fetch data: ${response.statusText}`);

//       const data = await response.json();

//       console.log("API Response:", data); // Debugging log

//       if (!data.responseData) {
//         throw new Error("Invalid API response: responseData is missing");
//       }

//       const responseData = data.responseData;

//       // Ensure file upload fields are always an array
//       const getFileList = (fileName) =>
//         fileName ? [{ uid: "-1", name: fileName, status: "done" }] : [];

//       const formData = {
//         indentId: responseData.indentId || "",
//         indentorName: responseData.indentorName || "",
//         indentorMobileNo: responseData.indentorMobileNo || "",
//         indentorEmail: responseData.indentorEmailAddress || "",
//         consigneeLocation: responseData.consignesLocation || "",
//         projectName: responseData.projectName || "",
//         preBidMeetingRequired: responseData.isPreBidMeetingRequired || false,
//         preBidMeetingDetails: responseData.preBidMeetingDate
//           ? dayjs(responseData.preBidMeetingDate, "DD/MM/YYYY")
//           : null,
//         preBidMeetingLocation: responseData.preBidMeetingVenue || "",
//         rateContractIndent: responseData.isItARateContractIndent || false,
//         estimatedRate: parseFloat(responseData.estimatedRate) || 0,
//         periodOfRateContract: parseFloat(responseData.periodOfContract) || 0,
//         singleOrMultipleJob: responseData.singleAndMultipleJob || "",

//         // ✅ Fix file uploads - Ensure they are arrays
//         uploadingPriorApprovals: getFileList(
//           responseData.uploadingPriorApprovalsFileName
//         ),
//         uploadTenderDocuments: getFileList(
//           responseData.uploadTenderDocumentsFileName
//         ),
//         uploadGOIOrRFP: getFileList(responseData.uploadGOIOrRFPFileName),
//         uploadPACOrBrandPAC: getFileList(
//           responseData.uploadPACOrBrandPACFileName
//         ),

//         // ✅ Ensure material details is an array
//         lineItems: Array.isArray(responseData.materialDetails)
//           ? responseData.materialDetails.map((item) => ({
//               materialCode: item.materialCode || "",
//               materialDescription: item.materialDescription || "",
//               quantity: parseFloat(item.quantity) || 0,
//               unitPrice: parseFloat(item.unitPrice) || 0,
//               uom: item.uom || "",
//               totalPrice: parseFloat(item.totalPrize) || 0,
//               budgetCode: item.budgetCode || "",
//               modeOfProcurement: item.modeOfProcurement || "",
//               materialCategory: item.materialCategory || "",
//               materialSubcategory: item.materialSubCategory || "",
//               materialOrJobCodeUsedByDept: item.materialAndJob || "",
//             }))
//           : [],
//       };

//       console.log("Final Form Data:", formData); // Debugging log

//       // ✅ Update form fields safely
//       form.setFieldsValue(formData);
//       setPreBidRequired(formData.preBidMeetingRequired);
//       setRateContractIndent(formData.rateContractIndent);
//       message.success("Form data fetched successfully");
//     } catch (error) {
//       message.error(`Failed to fetch form data: ${error.message}`);
//       console.error("Error fetching data:", error);
//     }
//   };

//   const normFile = (e) => {
//     // When uploading, an array of file objects is expected.
//     // If e is already an array, return it. Otherwise, return e.fileList.
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e && e.fileList;
//   };

//   const uploadFileToServer = async (file, fieldName) => {
//     try {
//       if (!file) return "";
//       if (file.size > 5 * 1024 * 1024) {
//         throw new Error(`${fieldName} file is too large. Maximum 5MB allowed.`);
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch(
//         "http://103.181.158.220:8081/astro-service/file/upload?fileType=Indent",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${auth.token}`, // Add authentication if needed
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.responseStatus?.message || "File upload failed"
//         );
//       }

//       const data = await response.json();
//       return data.responseData.fileName;
//     } catch (error) {
//       console.error(`File upload error (${fieldName}):`, error);
//       throw new Error(`Failed to upload ${fieldName}: ${error.message}`);
//     }
//   };

//   const {userName, email, mobileNumber} = useSelector(state => state.auth)


//   // Update the handleSubmit function with these changes
//   // Add this function to check if any material has Brand PAC mode of procurement
//   const hasBrandPACMaterial = () => {
//     const lineItems = form.getFieldValue("lineItems") || [];
//     return lineItems.some(item => item && item.modeOfProcurement === "Brand PAC");
//   };

//   // Update the handleSubmit function to include the validation
//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       // Check if Brand PAC validation is needed
//       if (hasBrandPACMaterial() && (!values.uploadPACOrBrandPAC || values.uploadPACOrBrandPAC.length === 0)) {
//         throw new Error("PAC/Brand PAC document is required when mode of procurement is Brand PAC");
//       }

//       // Upload all files in parallel with better error handling
//       const uploadFiles = async (fileList, fieldName) => {
//         if (!fileList || fileList.length === 0) return "";
//         return uploadFileToServer(fileList[0].originFileObj, fieldName);
//       };
      
//       const [
//         priorApprovalsFile,
//         tenderDocumentsFile,
//         goiOrRfpFile,
//         pacOrBrandFile,
//       ] = await Promise.all([
//         uploadFiles(values.uploadingPriorApprovals, "Prior Approvals"),
//         uploadFiles(values.uploadTenderDocuments, "Tender Documents"),
//         uploadFiles(values.uploadGOIOrRFP, "GOI/RFP"),
//         uploadFiles(values.uploadPACOrBrandPAC, "PAC/Brand PAC"),
//       ]);

//       // Process material details with enhanced validation
//       const materialDetails = (values.lineItems || []).map((item) => {
//         const quantity = Number(item.quantity) || 0;
//         const unitPrice = Number(item.unitPrice) || 0;
//         const totalPrice = quantity * unitPrice;

//         if (isNaN(quantity) || quantity <= 0) {
//           throw new Error(`Invalid quantity for material ${item.materialCode}`);
//         }

//         return {
//           materialCode: String(item.materialCode) || null,
//           materialDescription: String(item.materialDescription) || null,
//           quantity: quantity,
//           unitPrice: unitPrice,
//           uom: String(item.uom) || null,
//           totalPrize: totalPrice,
//           budgetCode: String(item.budgetCode) || null,
//           materialCategory: String(item.materialCategory) || null,
//           materialSubCategory: String(item.materialSubcategory) || null,
//           materialAndJob: String(item.materialOrJobCodeUsedByDept) || null,
//           modeOfProcurement: String(item.modeOfProcurement) || null
//         };
//       });

//       // Build payload with proper type conversions
//       const payload = {
//         consignesLocation: values.consigneeLocation
//           ? String(values.consigneeLocation)
//           : "Bangalore",
//         createdBy: Number(actionPerformer) || 0,
//         estimatedRate: Number(values.estimatedRate) || 0,
//         fileType: "Indent",
//         indentId: String(values.indentId) || null,
//         indentorEmailAddress: String(values.indentorEmail) || null,
//         indentorMobileNo: String(values.indentorMobileNo) || null,
//         indentorName: String(values.indentorName) || null,
//         isItARateContractIndent: Boolean(values.rateContractIndent),
//         isPreBidMeetingRequired: Boolean(values.preBidMeetingRequired),
//         materialDetails: materialDetails,
//         periodOfContract: Number(values.periodOfRateContract) || 0,
//         preBidMeetingDate: values.preBidMeetingDetails?.isValid()
//           ? values.preBidMeetingDetails.format("DD/MM/YYYY")
//           : null,
//         preBidMeetingVenue: String(values.preBidMeetingLocation) || null,
//         projectName: values.projectName || null,
//         singleAndMultipleJob: String(values.singleOrMultipleJob) || null,
//         updatedBy: null,
//         uploadGOIOrRFPFileName: String(goiOrRfpFile) || null,
//         uploadPACOrBrandPACFileName: String(pacOrBrandFile) || null,
//         uploadTenderDocumentsFileName: String(tenderDocumentsFile) || null,
//         uploadingPriorApprovalsFileName: String(priorApprovalsFile) || null,
//       };

//       console.log("Final Payload:", JSON.stringify(payload, null, 2));

//       // Submit request with authentication headers
//       const response = await fetch(
//         "http://103.181.158.220:8081/astro-service/api/indents",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${auth.token}`, // Add authentication if needed
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const responseData = await response.json();

//       if (!response.ok || responseData.responseStatus.statusCode !== 0) {
//         throw new Error(
//           responseData.responseStatus?.message || "Submission failed"
//         );
//       }

//       message.success("Indent submitted successfully!");
//       form.resetFields();
//     } catch (error) {
//       message.error(`Submission Error: ${error.message}`);
//       console.error("Detailed Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotalPrice = (record) => {
//     const quantity = parseFloat(record.quantity) || 0;
//     const unitPrice = parseFloat(record.unitPrice) || 0;
//     return quantity * unitPrice;
//   };

//   const handlePriceCalculation = (index, field, value) => {
//     const lineItems = form.getFieldValue("lineItems");
//     if (lineItems[index]) {
//       const totalPrice = calculateTotalPrice({
//         ...lineItems[index],
//         [field]: value,
//       });

//       const updatedItems = [...lineItems];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         totalPrice: totalPrice,
//       };

//       form.setFieldsValue({ lineItems: updatedItems });
//     }
//   };

//   const handleCheckboxChange = (e) => {
//     setPreBidRequired(e.target.checked);
//   };

//   const handleCheckboxChange2 = (e) => {
//     setRateContractIndent(e.target.checked);
//   };

//   // Add these state declarations at the top with other state variables
//   const [locationMaster, setLocationMaster] = useState([]);
//   const [filteredMaterialList, setFilteredMaterialList] = useState([]);

//   // Fix the populateData function
//   const populateData = async () => {
//     setLoading(true);
//     try {
//       const [materialsResponse, projectsResponse, locationsResponse] = await Promise.all([
//         fetch("http://103.181.158.220:8081/astro-service/api/material-master"),
//         fetch("http://103.181.158.220:8081/astro-service/api/project-master"),
//         fetch("http://103.181.158.220:8081/astro-service/api/location-master")
//       ]);
  
//       const [materialsData, projectsData, locationsData] = await Promise.all([
//         materialsResponse.json(),
//         projectsResponse.json(),
//         locationsResponse.json()
//       ]);
  
//       // Handle materials data
//       if (materialsData.responseData) {
//         const materialMap = materialsData.responseData.reduce(
//           (acc, material) => ({
//             ...acc,
//             [material.materialCode]: {
//               ...material,
//               materialDescription: material.description,
//               materialCategory: material.category,
//               materialSubCategory: material.subCategory,
//               modeOfProcurement: material.modeOfProcurement
//             },
//           }),
//           {}
//         );
//         setMaterialDetailsMap(materialMap);
//         setMaterialList(Object.keys(materialMap));
//         setFilteredMaterialList(Object.keys(materialMap)); // Initialize with all materials
//       } else {
//         throw new Error("Invalid material data");
//       }
  
//       // Handle projects data
//       if (projectsData.responseStatus.statusCode === 0 && Array.isArray(projectsData.responseData)) {
//         setProjects(projectsData.responseData);
//       } else {
//         throw new Error("Invalid project data");
//       }
  
//       // Handle locations data
//       if (Array.isArray(locationsData.responseData)) {
//         const formattedLocations = locationsData.responseData.map(location => ({
//           label: location.locationName,
//           value: location.locationName
//         }));
//         setLocationMaster(formattedLocations);
//       } else {
//         throw new Error("Invalid location data");
//       }
  
//     } catch (error) {
//       console.error("Data fetch error:", error);
//       message.error("Failed to load required data");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Define handleMaterialSelect as a separate function
//   const handleMaterialSelect = (index, materialCode) => {
//     const materialData = materialDetailsMap[materialCode] || {};
//     const lineItems = form.getFieldValue("lineItems") || [];
//     const updatedItems = [...lineItems];
  
//     updatedItems[index] = {
//       ...updatedItems[index],
//       materialCode: materialCode,
//       materialDescription: materialData.description || "",
//       materialCategory: materialData.category || "",
//       materialSubcategory: materialData.subCategory || "",
//       modeOfProcurement: materialData.modeOfProcurement || "",
//       uom: materialData.uom || "",
//     };
  
//     form.setFieldsValue({ lineItems: updatedItems });
  
//     // Filter materials based on first selected item
//     const nonEmptyItems = updatedItems.filter(item => item.materialCode);
//     if (nonEmptyItems.length > 0) {
//       const firstItem = nonEmptyItems[0];
//       const filteredMaterials = Object.keys(materialDetailsMap).filter(code => {
//         const material = materialDetailsMap[code];
//         return material.category === firstItem.materialCategory && 
//                material.modeOfProcurement === firstItem.modeOfProcurement;
//       });
//       setFilteredMaterialList(filteredMaterials);
//     } else {
//       // If no items selected, show all materials
//       setFilteredMaterialList(Object.keys(materialDetailsMap));
//     }
//   };
  
//   useEffect(() => {
//     populateData();
//   }, []);

//   // Pass filteredMaterialList to LineItem component instead of materialList
//   return (
//     <Form form={form} layout="vertical" onFinish={handleSubmit}>
//       <LineItem
//         form={form}
//         materialList={filteredMaterialList}
//         projects={projects}
//         materialDetailsMap={materialDetailsMap}
//         calculateTotalPrice={calculateTotalPrice}
//         handleMaterialSelect={handleMaterialSelect}
//         handlePriceCalculation={handlePriceCalculation}
//       />
  
//       <div className="form-section">
//         <Form.Item name="projectName" label="Project Name">
//           <Select placeholder="Select project" loading={loading} allowClear>
//             {projects.map((project) => (
//               <Option
//                 key={project.projectNameDescription}
//                 value={project.projectNameDescription}
//               >
//                 {project.projectNameDescription}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         {/* Rest of your form items */}
//       </div>
  
//       {/* Rest of your form sections */}
      
//       <Form.Item>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <Button type="default" htmlType="reset">
//             Reset
//           </Button>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Submit
//           </Button>
//           <Button type="dashed" htmlType="button">
//             Save Draft
//           </Button>
//         </div>
//       </Form.Item>
//       <Form.Item
//           label="Upload PAC/Brand PAC"
//           name="uploadPACOrBrandPAC"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//           rules={[
//             {
//               required: hasBrandPACMaterial(),
//               message: "PAC/Brand PAC document is required when mode of procurement is Brand PAC",
//             },
//           ]}
//         >
//           <Upload beforeUpload={() => false} maxCount={1}>
//             <Button icon={<UploadOutlined />}>Upload PAC/Brand PAC</Button>
//           </Upload>
//         </Form.Item>
//     </Form>
//   );
// };

// export default Form1;

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  DatePicker,
  Checkbox,
  Space,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSelector } from "react-redux";
import LineItem from "../LineItem";
dayjs.extend(customParseFormat);

const { Option } = Select;

const Form1 = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const [preBidRequired, setPreBidRequired] = useState(false);
  const [rateContractIndent, setRateContractIndent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [materialDetailsMap, setMaterialDetailsMap] = useState({});
  const [projects, setProjects] = useState([]);

  const {userName, email, mobileNumber} = useSelector(state => state.auth)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://103.181.158.220:8081/astro-service/api/project-master");
        const data = await response.json();

        if (
          data.responseStatus.statusCode === 0 &&
          Array.isArray(data.responseData)
        ) {
          setProjects(data.responseData);
        } else {
          message.error("Failed to project data");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSearch = async () => {
    const indentorId = form.getFieldValue("indentId");
    if (!indentorId) {
      message.error("Please enter an Indent ID");
      return;
    }

    try {
      const response = await fetch(`http://103.181.158.220:8081/astro-service/api/indents/${indentorId}`);

      if (!response.ok)
        throw new Error(`Failed to fetch data: ${response.statusText}`);

      const data = await response.json();

      console.log("API Response:", data); // Debugging log

      if (!data.responseData) {
        throw new Error("Invalid API response: responseData is missing");
      }

      const responseData = data.responseData;

      // Ensure file upload fields are always an array
      const getFileList = (fileName) =>
        fileName ? [{ uid: "-1", name: fileName, status: "done" }] : [];

      const formData = {
        indentId: responseData.indentId || "",
        indentorName: responseData.indentorName || "",
        indentorMobileNo: responseData.indentorMobileNo || "",
        indentorEmail: responseData.indentorEmailAddress || "",
        consigneeLocation: responseData.consignesLocation || "",
        projectName: responseData.projectName || "",
        preBidMeetingRequired: responseData.isPreBidMeetingRequired || false,
        preBidMeetingDetails: responseData.preBidMeetingDate
          ? dayjs(responseData.preBidMeetingDate, "DD/MM/YYYY")
          : null,
        preBidMeetingLocation: responseData.preBidMeetingVenue || "",
        rateContractIndent: responseData.isItARateContractIndent || false,
        estimatedRate: parseFloat(responseData.estimatedRate) || 0,
        periodOfRateContract: parseFloat(responseData.periodOfContract) || 0,
        singleOrMultipleJob: responseData.singleAndMultipleJob || "",

        // ✅ Fix file uploads - Ensure they are arrays
        uploadingPriorApprovals: getFileList(
          responseData.uploadingPriorApprovalsFileName
        ),
        uploadTenderDocuments: getFileList(
          responseData.uploadTenderDocumentsFileName
        ),
        uploadGOIOrRFP: getFileList(responseData.uploadGOIOrRFPFileName),
        uploadPACOrBrandPAC: getFileList(
          responseData.uploadPACOrBrandPACFileName
        ),

        // ✅ Ensure material details is an array
        lineItems: Array.isArray(responseData.materialDetails)
          ? responseData.materialDetails.map((item) => ({
              materialCode: item.materialCode || "",
              materialDescription: item.materialDescription || "",
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseFloat(item.unitPrice) || 0,
              uom: item.uom || "",
              totalPrice: parseFloat(item.totalPrize) || 0,
              budgetCode: item.budgetCode || "",
              materialCategory: item.materialCategory || "",
              materialSubcategory: item.materialSubCategory || "",
              materialOrJobCodeUsedByDept: item.materialAndJob || "",
            }))
          : [],
      };

      console.log("Final Form Data:", formData); // Debugging log

      // ✅ Update form fields safely
      form.setFieldsValue(formData);
      setPreBidRequired(formData.preBidMeetingRequired);
      setRateContractIndent(formData.rateContractIndent);
      message.success("Form data fetched successfully");
    } catch (error) {
      message.error(`Failed to fetch form data: ${error.message}`);
      console.error("Error fetching data:", error);
    }
  };

  const normFile = (e) => {
    // When uploading, an array of file objects is expected.
    // If e is already an array, return it. Otherwise, return e.fileList.
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadFileToServer = async (file, fieldName) => {
    try {
      if (!file) return "";
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${fieldName} file is too large. Maximum 5MB allowed.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/file/upload?fileType=Indent",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add authentication if needed
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.responseStatus?.message || "File upload failed"
        );
      }

      const data = await response.json();
      return data.responseData.fileName;
    } catch (error) {
      console.error(`File upload error (${fieldName}):`, error);
      throw new Error(`Failed to upload ${fieldName}: ${error.message}`);
    }
  };

  // Update the handleSubmit function with these changes
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Upload all files in parallel with better error handling
      const uploadFiles = async (fileList, fieldName) => {
        if (!fileList || fileList.length === 0) return "";
        return uploadFileToServer(fileList[0].originFileObj, fieldName);
      };

      const [
        priorApprovalsFile,
        tenderDocumentsFile,
        goiOrRfpFile,
        pacOrBrandFile,
      ] = await Promise.all([
        uploadFiles(values.uploadingPriorApprovals, "Prior Approvals"),
        uploadFiles(values.uploadTenderDocuments, "Tender Documents"),
        uploadFiles(values.uploadGOIOrRFP, "GOI/RFP"),
        uploadFiles(values.uploadPACOrBrandPAC, "PAC/Brand PAC"),
      ]);

      // Process material details with enhanced validation
      const materialDetails = (values.lineItems || []).map((item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const totalPrice = quantity * unitPrice;

        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for material ${item.materialCode}`);
        }

        return {
          materialCode: String(item.materialCode) || null,
          materialDescription: String(item.materialDescription) || null,
          quantity: quantity,
          unitPrice: unitPrice,
          uom: String(item.uom) || null,
          totalPrize: totalPrice,
          budgetCode: String(item.budgetCode) || null,
          materialCategory: String(item.materialCategory) || null,
          materialSubCategory: String(item.materialSubcategory) || null,
          materialAndJob: String(item.materialOrJobCodeUsedByDept) || null,
        };
      });

      // Build payload with proper type conversions
      const payload = {
        consignesLocation: String(values.consigneeLocation) || "Bangalore",
        createdBy: Number(actionPerformer) || 0,
        estimatedRate: Number(values.estimatedRate) || 0,
        fileType: "Indent",
        indentId: String(values.indentId) || null,
        indentorEmailAddress: String(values.indentorEmail) || null,
        indentorMobileNo: String(values.indentorMobileNo) || null,
        indentorName: String(values.indentorName) || null,
        isItARateContractIndent: Boolean(values.rateContractIndent),
        isPreBidMeetingRequired: Boolean(values.preBidMeetingRequired),
        materialDetails: materialDetails,
        periodOfContract: Number(values.periodOfRateContract) || 0,
        preBidMeetingDate: values.preBidMeetingDetails?.isValid()
          ? values.preBidMeetingDetails.format("DD/MM/YYYY")
          : null,
        preBidMeetingVenue: String(values.preBidMeetingLocation) || null,
        projectName: values.projectName || null,
        singleAndMultipleJob: String(values.singleOrMultipleJob) || null,
        updatedBy: null,
        uploadGOIOrRFPFileName: String(goiOrRfpFile) || null,
        uploadPACOrBrandPACFileName: String(pacOrBrandFile) || null,
        uploadTenderDocumentsFileName: String(tenderDocumentsFile) || null,
        uploadingPriorApprovalsFileName: String(priorApprovalsFile) || null,
      };

      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      // Submit request with authentication headers
      const response = await fetch("http://103.181.158.220:8081/astro-service/api/indents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${auth.token}`, // Add authentication if needed
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.responseStatus.statusCode !== 0) {
        throw new Error(
          responseData.responseStatus?.message || "Submission failed"
        );
      }

      message.success("Indent submitted successfully!");
      form.resetFields();
    } catch (error) {
      message.error(`Submission Error: ${error.message}`);
      console.error("Detailed Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (record) => {
    const quantity = parseFloat(record.quantity) || 0;
    const unitPrice = parseFloat(record.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handlePriceCalculation = (index, field, value) => {
    const lineItems = form.getFieldValue("lineItems");
    if (lineItems[index]) {
      const totalPrice = calculateTotalPrice({
        ...lineItems[index],
        [field]: value,
      });

      const updatedItems = [...lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        totalPrice: totalPrice,
      };

      form.setFieldsValue({ lineItems: updatedItems });
    }
  };

  const handleCheckboxChange = (e) => {
    setPreBidRequired(e.target.checked);
  };

  const handleCheckboxChange2 = (e) => {
    setRateContractIndent(e.target.checked);
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("http://103.181.158.220:8081/astro-service/api/material-master");
        const data = await response.json();

        if (!data.responseData) throw new Error("Invalid material data");

        // Create a proper material map
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

        setMaterialDetailsMap(materialMap);
        setMaterialList(Object.keys(materialMap));
      } catch (error) {
        message.error("Failed to load materials");
        console.error("Material fetch error:", error);
      }
    };

    fetchMaterials();
  }, []);

  // ✅ When a material is selected, auto-fill the other fields
  const handleMaterialSelect = (index, materialCode) => {
    const materialData = materialDetailsMap[materialCode] || {};
    const lineItems = form.getFieldValue("lineItems") || [];
    const updatedItems = [...lineItems];

    updatedItems[index] = {
      ...updatedItems[index],
      materialCode: materialCode,
      materialDescription: materialData.description || "", // Match API field
      materialCategory: materialData.category || "", // Match API field
      materialSubcategory: materialData.subCategory || "", // Match API field
      uom: materialData.uom || "",
    };

    form.setFieldsValue({ lineItems: updatedItems });

    // Category validation
    const categories = updatedItems
      .map((item) => item?.materialCategory)
      .filter(Boolean);

    if (categories.length === 0) return;

    const firstCategory = categories[0];
    const allSame = categories.every((cat) => cat === firstCategory);

    if (!allSame) {
      message.error("All materials must be of the same category.");
      updatedItems[index] = {
        ...updatedItems[index],
        materialCode: "", // Fixed syntax error
        materialDescription: "",
        materialCategory: "",
        materialSubcategory: "",
        uom: "",
      };

      form.setFieldsValue({ lineItems: updatedItems });
      form.setFields([
        {
          name: ["lineItems", index, "materialCode"],
          errors: ["Category must match first material"],
        },
      ]);
    }
  };

  // Add this handler in Form1
const handleMaterialDescriptionSelect = (index, materialCode) => {
    handleMaterialSelect(index, materialCode); // Reuse the same handler
  };

  return (
    <div className="form-container">
      <h2>Indent Creation</h2>
      <Row justify="end">
        <Col>
          <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Indent ID"
              name="indentId"
              rules={[{ required: true, message: "Indentor ID is required" }]}
            >
              <Space>
                <Input placeholder="Enter Indent ID" />
                <Button type="primary" onClick={handleSearch}>
                  <SearchOutlined />
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.error("Validation Failed:", errorInfo);
          message.error("Please fill all required fields");
        }}
        initialValues={{
          // Provide default values to prevent undefined issues
          lineItems: [{}],
          preBidMeetingRequired: false,
          rateContractIndent: false,
        }}
      >
        <div className="form-section">
          <Form.Item
            label="Indentor Name"
            name="indentorName"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>

          <Form.Item
            label="Indentor Mobile No."
            name="indentorMobileNo"
            rules={[
              { required: true, message: "Indentor mobile number is required" },
            ]}
          >
            <Input value="Auto-populated" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Indentor Email"
            name="indentorEmail"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>

          <Form.Item
            label="Consignee Location"
            name="consigneeLocation"
            // rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <TextArea rows={1} defaultValue="Bangalore" />
          </Form.Item>

          <Form.Item
            label="Upload Prior Approvals"
            name="uploadingPriorApprovals"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Prior approvals are required" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Prior Approvals</Button>
            </Upload>
          </Form.Item>
        </div>

        <LineItem
          form={form}
          materialList={materialList}
          projects={projects}
          materialDetailsMap={materialDetailsMap}
          calculateTotalPrice={calculateTotalPrice}
          handleMaterialSelect={handleMaterialSelect}
          handlePriceCalculation={handlePriceCalculation}
          handleMaterialDescriptionSelect={handleMaterialDescriptionSelect}
        />

        <div className="form-section">
          <Form.Item name="projectName" label="Project Name">
            <Select placeholder="Select project" loading={loading} allowClear>
              {projects.map((project) => (
                <Option
                  key={project.projectNameDescription}
                  value={project.projectNameDescription}
                >
                  {project.projectNameDescription}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Upload Tender Documents"
            name="uploadTenderDocuments"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Tender documents are required" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Tender Documents</Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item name="preBidMeetingRequired" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange}>
            Pre-bid Meeting Required
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {preBidRequired && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="preBidMeetingDetails"
                  label="Meeting Date"
                  rules={[
                    {
                      required: preBidRequired,
                      message: "Meeting date is required",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || value.isValid()) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Invalid date format");
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Meeting Location"
                  name="preBidMeetingLocation"
                  rules={[
                    {
                      required: true,
                      message: "Pre Bid Meeting Location is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>

        <Form.Item name="rateContractIndent" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange2}>
            Is it a rate contract indent
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {rateContractIndent && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="estimatedRate"
                  label="Estimated Rate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter estimated rate!",
                    },
                  ]}
                >
                  <Input type="number" placeholder="Enter Estimated Rate" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="periodOfRateContract"
                  label="Period of Rate Contract"
                  rules={[
                    {
                      required: true,
                      message: "Enter Period of Contract!",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="singleOrMultipleJob"
                  label="Single or Multiple Job"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select Material Code">
                    <Option value="Single">Single</Option>
                    <Option value="Multiple">Multiple</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <div className="form-section">
          <Form.Item
            label="Upload GOI or RFP"
            name="uploadGOIOrRFP"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "GOI or RFP is required" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload GOI or RFP</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Upload PAC or Brand PAC"
            name="uploadPACOrBrandPAC"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "PAC or Brand PAC is required" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload PAC or Brand</Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button type="dashed" htmlType="button">
              Save Draft
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form1;
