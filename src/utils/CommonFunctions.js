import { Form, message, Select } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import FormItemInput from "antd/es/form/FormItemInput";
import axios from "axios";
import CustomDatePicker from "../components/DKG_CustomDatePicker";
import CustomInput from "../components/CustomInput";
import CustomSearch from "../components/CustomSearch";
import ImageUploadBase64 from "../components/ImageUploadBas64";
import InputDatePicker from "../components/DatePicker";

export const apiCall = async (method, url, token, payload = null) => {

  const header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    let response;

    if (method === "GET") {
      response = await axios.get(url);
    } else if (method === "POST") {
      response = await axios.post(url, payload);
    }

    // // Check response status code
    // if (response.data.responseStatus.statusCode === 1) {
    //   return response; // Return the data on success
    // } else {
    //   // Throw an error if the status code indicates failure
    //   throw new Error(response.data.responseStatus.message || "Request failed.");
    // }

    return response
  } catch (error) {
    // Display error alert
    message.error(error?.response?.data?.responseStatus?.message || "Some error occurred.");
    // Rethrow the error for the calling function to handle
    console.log("ERRORRR: ", error)
    throw error;
  }
};


  export const handleChange = (fieldName, value, setFormData) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  export const checkAndConvertToFLoat = (value) => {
    if (value === null || value.trim() === "" || !/^-?\d+(\.\d+)?$/.test(value)) {
      message.error("Invalid number.");
      return{number: null, isFloat: false};
    }

    return {number: parseFloat(value), isFloat: true}
  }

  const sanitizeText = (text) => {
    // return text
    return text.toString().toLowerCase().replace(/\s+/g, '');
  };

  const recursiveSearch = (object, searchText) => {
    for (let key in object) {
      const value = object[key];
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          for (let item of value) {
            if (recursiveSearch(item, searchText)) {
              return true;
            }
          }
        } else {
          if (recursiveSearch(value, searchText)) {
            return true;
          }
        }
      } else if (
        value &&
        sanitizeText(value).includes(searchText)
      ) {
        return true;
      }
    }
    return false;
  };
  
  export const handleSearch = (searchText, itemData, setHook, setSearch=null) => {
    if(searchText !== null){
        const sanitizedText = sanitizeText(searchText);
        if(setSearch)
          setSearch(searchText)
        const filtered = itemData?.filter((parentObject) =>
          recursiveSearch(parentObject, sanitizedText)
      );
      setHook([...filtered]);
    }
    else{
      setHook([...itemData])
    }
  };

  export const convertToCurrency = (amount) => {
    const formattedAmount = amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
    return formattedAmount
  }

  export const updateFormData = (newItem, setFormData) => {
    setFormData((prevValues) => {
      const updatedItems = [
        ...(prevValues.items || []),
        {
          ...newItem,
          noOfDays: prevValues.processType === "NIRP" ? "0" : (newItem.noOfDays ? newItem.noOfDays : "1"),
          srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
        },
      ];
      return { ...prevValues, items: updatedItems };
    });
  };

  
  export const itemHandleChange = (fieldName, value, index, setFormData) => {
    setFormData((prevValues) => {
      const updatedItems = [...(prevValues.items || [])];
      
      if (fieldName === "unitPrice" && /^\d*\.?\d*$/.test(value)) {
        updatedItems[index] = {
          ...updatedItems[index],
          [fieldName]: value === "" ? 0 : value,
        };
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [fieldName]: value,
        };
      }
  
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };
  
  export const removeItem = (index, setFormData) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);
  
      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key + 1 };
      });
  
      return { ...prevValues, items: updatedItems1 };
    });
  };  

  const conditonalRender = (field, handleChange, formData, handleSearch) => {
    if (!field || !field.type) {
      throw new Error("Provided field type is missing.");
    }
  
    const { type } = field;
  
    switch (type) {
      case "text":
        return (
          <CustomInput
            label={field?.label}
            name={field?.name}
            required={field?.required}
            disabled={field?.disabled}
            onChange={handleChange}
            className="w-full"
          />
        );
  
      case "date":
        return (
          <InputDatePicker
          required={field?.required}
            label={field?.label}
            name={field?.name}
            disabled={field?.disabled}
            onChange={handleChange}
            defaultValue={formData[field.name]}
          />
        );

        case "image":
        return (
          <ImageUploadBase64
            label={field?.label}
            name={field?.name}
            required={field?.required}
            disabled={field?.disabled}
            onChange={handleChange}
            value={formData[field.name]}
          />
        );

        case "search":
        return (
          <CustomSearch
            label={field?.label}
            name={field?.name}
            required={field?.required}
            disabled={field?.disabled}
            onChange={handleChange}
            onSearch={handleSearch}
            className="w-full"
          />
        );

        case "select":
          return (
            <Form.Item 
              name={field?.name}
              label={field?.label}
              required={field?.required}
            >
              <Select options={[]} disabled={field?.disabled} onChange={handleChange} />
            </Form.Item>
          )
  
      default:
        throw new Error("Provided field type doesn't exist.");
    }
  };

  const colClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
    9: "md:grid-cols-9",
    10: "md:grid-cols-10",
  };
 
export const renderFormFields = (detail, handleChange, formData, parentName = "", index = null, setFormData, handleSearch = null) => {
  const handleDeleteChild = (sectionName, childIndex) => {
    if (!setFormData) {
      console.error('setFormData is required for deletion');
      return;
    }
    
    setFormData(prev => {
      const updatedSection = [...prev[sectionName]];
      updatedSection.splice(childIndex, 1);
      
      return {
        ...prev,
        [sectionName]: updatedSection
      };
    });
  };

  return (
    <>
      {detail.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-4">
          <h1 className="font-semibold">{section?.heading}</h1>
          
          {section?.fieldList ? (
            <div className={`grid md:gap-x-4 md:gap-y-2 ${colClasses[section.colCnt] || "md:grid-cols-3"}`}>
              {section.fieldList.map((field, fieldIndex) => (
                <div key={fieldIndex} className={`col-span-${field?.span || 1}`}>
                  {conditonalRender(
                    {
                      ...field,
                      name: parentName && index !== null 
                        ? `${parentName}[${index}].${field.name}` 
                        : field.name,
                    }, 
                    handleChange, 
                    formData,
                    handleSearch
                  )}
                </div>
              ))}
            </div>
          ) : section?.children ? (
            // Recursively render children if present
            <div className="border-gray-200 my-2">
              {Array.isArray(formData[section.name]) ? 
                formData[section.name].map((childData, childIndex) => (
                  <div key={childIndex} className="mb-4 p-3 border border-black rounded relative">
                    <DeleteOutlined 
                      onClick={() => handleDeleteChild(section.name, childIndex)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700 cursor-pointer text-lg bg-gray-100 p-2"
                    />
                    <div className={`grid md:gap-x-4 md:gap-y-2 ${section.colCnt ? colClasses[section.colCnt] : "md:grid-cols-3"}`}>
                      {section.children.map((child, subIndex) => (
                        <div key={subIndex} className={`col-span-${child?.span || 1}`}>
                          {conditonalRender(
                            {
                              ...child,
                              name: [section.name, childIndex, child.name]
                            },
                            handleChange,
                            formData
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )) 
                : 
                <div className="text-gray-500">No items added yet</div>
              }
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};


                //   (
                //   <div key={childIndex} className="mb-4 p-3 border border-gray-200 rounded">
                //     <h3 className="text-sm font-medium mb-2">Item {childIndex + 1}</h3>
                //     {renderFormFields(
                //       [{ ...section, fieldList: section.children }],
                //       handleChange,
                //       childData,
                //       `${parentName ? `${parentName}[${index}]` : section.name}`,
                //       childIndex
                //     )}
                //   </div>
                // ))
