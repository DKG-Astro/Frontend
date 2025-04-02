import { Button, Form, message } from 'antd'
import React, { useState } from 'react'
import CustomDatePicker from './DKG_CustomDatePicker'
import { useSelector } from 'react-redux';
import { apiCall } from '../utils/CommonFunctions';
import { CloseCircleOutlined } from '@ant-design/icons';
import Btn from './DKG_Btn';
import TableComponent from './DKG_Table';

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
          console.log("DATA: ", data)
          setDataSource(data?.responseData);
        } catch (error) {console.log("Error: ", error)}
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
                  className="no-border"
                  defaultValue={filter.startDate}
                  placeholder="From date"
                  name="startDate"
                  onChange={handleChange}
                  required
                  />
              <CustomDatePicker
                className="no-border"
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

export default CustomReport
