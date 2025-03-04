import { message } from "antd";
import axios from "axios";

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