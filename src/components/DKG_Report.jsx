import {Input, Button, Form, message } from 'antd'
import React, { useState,useEffect } from 'react'
import CustomDatePicker from './DKG_CustomDatePicker'
import { useSelector } from 'react-redux';
import { apiCall } from '../utils/CommonFunctions';
import { CloseCircleOutlined } from '@ant-design/icons';
import Btn from './DKG_Btn';
import TableComponent from './DKG_Table';
/*
const CustomReport = ({api, columns, title, showFilter}) => {
    const { token } = useSelector((state) => state.auth);
    const [form] = Form.useForm()
    const [filter, setFilter] = useState({
        startDate: null,
        endDate: null,
      });

      const [dataSource, setDataSource] = useState([]);

      const populateData = async () => {
        if(showFilter){
          if(!filter.startDate || !filter.endDate) {
            message.error("Please enter start date and end date both.")
            return;
          }
        }
        try {
          let newApi = api;
          if(showFilter){
            newApi = api + "?startDate=" + filter.startDate + "&endDate=" + filter.endDate;
          }
          const { data } = await apiCall(
            "GET",
            newApi,
            token,
            filter
          );
          setDataSource(data?.responseData);
        } catch (error) {}
      };

      const handleChange = (fieldName, value) => {
        setFilter((prev) => ({ ...prev, [fieldName]: value }));
      };
    
  return (
    <div>
        <h1 className="!text-lg font-semibold text-center mb-8">{title}</h1>

        <Form form={form} initialValues={filter} onFinish={populateData} className="grid md:grid-cols-4 grid-cols-2 gap-x-2 items-center px-2 pt-0 border !py-4 border-darkBlueHover mb-8">
          {
            showFilter && (
              <>
              <CustomDatePicker
                  className="no-margin"
                  defaultValue={filter.startDate}
                  placeholder="From date"
                  name="startDate"
                  onChange={handleChange}
                  required
                  />
              <CustomDatePicker
                className="no-margin"
                defaultValue={filter.endDate}
                placeholder="To date"
                name="endDate"
                onChange={handleChange}
                required
                />
                </>

            )
          }
            <Btn htmlType="submit" className="w-full">
              {" "}
              Search
              {" "}
            </Btn>
            <Button className="flex gap-2 items-center border-darkBlue text-darkBlue" onClick={() => window.location.reload()}>
              <span>
                <CloseCircleOutlined />
              </span>
              <span>Reset</span>
            </Button>
          </Form>

          <TableComponent dataSource={dataSource} columns={columns} />
      
    </div>
  )
}

export default CustomReport*/

const CustomReport = ({ api, columns, title, filterType = "date" ,onFetch, userId, roleName}) => {
  const { token } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const [textFilter, setTextFilter] = useState('');
  const [dataSource, setDataSource] = useState([]);


  const populateData = async () => {
    if (filterType === "date") {
      if (!filter.startDate || !filter.endDate) {
        message.error("Please enter start date and end date both.");
        return;
      }
    } else if (filterType === "text") {
      if (!textFilter) {
        message.error("Please enter a value.");
        return;
      }
    }

    try {
      let newApi = api;
      if (filterType === "date") {
        newApi = `${api}?startDate=${filter.startDate}&endDate=${filter.endDate}`;
      } else if (filterType === "text") {
        if (!textFilter) {
          message.error("Please enter a value.");
        return;
        }
        newApi = api.replace(/\{.*?\}/g, encodeURIComponent(textFilter));
      } else if (filterType === "none") {
      newApi = api; 
    }
    const separator = newApi.includes('?') ? '&' : '?';
    const params = [];
    if (userId) params.push(`userId=${userId}`);
    if (roleName) params.push(`roleName=${encodeURIComponent(roleName)}`);
    if (params.length > 0) newApi += separator + params.join('&');

    console.log("API URL:", newApi); 
      
      const { data } = await apiCall('GET', newApi, token);
       const fetchedData = data?.responseData || [];
      setDataSource(data?.responseData);

       if (onFetch) {
        if (filterType === "date") {
          onFetch(filter.startDate, filter.endDate, fetchedData);
        } else {
          onFetch(fetchedData);
        }
      }
    } catch (error) {
      message.error("Error fetching data.");
    }
  };

  const handleChange = (fieldName, value) => {
    setFilter((prev) => ({ ...prev, [fieldName]: value }));
  };
useEffect(() => {
  if (filterType === "none") {
    populateData(); 
  }
}, []);
  return (
    <div>
      <h1 className="!text-lg font-semibold text-center mb-8">{title}</h1>

      <Form
        form={form}
        onFinish={populateData}
        className="grid md:grid-cols-4 grid-cols-2 gap-x-2 items-center px-2 pt-0 border !py-4 border-darkBlueHover mb-8"
      >
        {filterType === "date" && (
          <>
            <CustomDatePicker
              className="no-margin"
              defaultValue={filter.startDate}
              placeholder="From date"
              name="startDate"
              onChange={handleChange}
              required
            />
            <CustomDatePicker
              className="no-margin"
              defaultValue={filter.endDate}
              placeholder="To date"
              name="endDate"
              onChange={handleChange}
              required
            />
          </>
        )}

        {filterType === "text" && (
           <Form.Item
              name="textFilter"
              className="w-full m-0"
              style={{ marginBottom: 0 }}
            >
            <Input
              className="w-full h-[40px]" 
              placeholder="Enter search text"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
            />
            </Form.Item>

        )}

        <Btn htmlType="submit" className="w-full">
          Search
        </Btn>

        <Button
          className="flex gap-2 items-center border-darkBlue text-darkBlue"
          onClick={() => window.location.reload()}
        >
          <CloseCircleOutlined />
          <span>Reset</span>
        </Button>
      </Form>

      <TableComponent dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default CustomReport;