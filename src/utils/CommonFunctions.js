import { message } from "antd";
import FormItemInput from "antd/es/form/FormItemInput";
import axios from "axios";
import CustomDatePicker from "../components/DKG_CustomDatePicker";
import FormInputItem from "../components/DKG_FormInputItem";

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

  const conditonalRender = (field, handleChange, formData) => {
    console.log("CONDITIONAL RENDER");
  
    if (!field || !field.type) {
      throw new Error("Provided field type is missing.");
    }
  
    const { type } = field;
  
    switch (type) {
      case "text":
        return (
          <FormInputItem
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
          <CustomDatePicker
          required={field?.required}
            label={field?.label}
            name={field?.name}
            disabled={field?.disabled}
            onChange={handleChange}
            defaultValue={formData[field.name]}
          />
        );
  
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
 
export const renderFormFields = (detail, handleChange, formData, parentName = "", index = null) => {
  return (
    <>
      {detail.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-4">
          <h1 className="font-semibold">{section?.heading}</h1>
          
          {section?.fieldList ? (
            <div className={`grid md:gap-x-4 ${colClasses[section.colCnt] || "md:grid-cols-3"}`}>
              {section.fieldList.map((field, fieldIndex) => (
                <div key={fieldIndex} className={`col-span-${field?.span || 1}`}>
                  {conditonalRender(
                    {
                      ...field,
                      name: parentName && index !== null 
                        ? `${parentName}[${index}].${field.name}` 
                        : field.name
                    }, 
                    handleChange, 
                    formData
                  )}
                </div>
              ))}
            </div>
          ) : section?.children ? (
            // Recursively render children if present
            <div className="pl-4 border-l-2 border-gray-200 my-2">
              {Array.isArray(formData[section.name]) ? 
                formData[section.name].map((childData, childIndex) => (
                  <div key={childIndex} className="mb-4 p-3 border border-gray-200 rounded">
                    <h3 className="text-sm font-medium mb-2">Item {childIndex + 1}</h3>
                    {renderFormFields(
                      [{ ...section, fieldList: section.children }],
                      handleChange,
                      childData,
                      section.name,
                      childIndex
                    )}
                  </div>
                )) : 
                <div className="text-gray-500">No items added yet</div>
              }
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};
