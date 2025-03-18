import React, { useState } from 'react';
import Btn from '../../components/DKG_Btn';
import MyLogo from "../../assets/images/iia-logo.png";
import FormBody from '../../components/DKG_FormBody';
import FormInputItem from '../../components/DKG_FormInputItem';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/DKG_FormContainer';
import { fetchMasters } from '../../store/slice/masterSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const handleFormValueChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Removed e.preventDefault() since no event is passed
  const handleFormSubmit = async () => {
    try {
        const userData = await dispatch(login(formData)).unwrap();

        dispatch(fetchMasters());

        navigate('/'); // Navigate after successful login
    } catch (error) {
        console.error('Login failed:', error);
    }
};


  return (
    <>
      <header className='bg-darkBlue text-offWhite p-4 fixed top-0 w-full z-30'>
        <h1>Log In</h1>
      </header>
      <FormContainer className='mt-20 main-content border-none !shadow-none'>
        <main className='w-full p-4 flex flex-col h-fit justify-center items-center gap-8 bg-white relative z-20 rounded-md'>
          <img src={MyLogo} width={200} height={150} alt="Logo" />
          <FormBody onFinish={handleFormSubmit} initialValues={formData}>
            <FormInputItem 
              label="Employee ID" 
              placeholder="123456" 
              name='userId' 
              onChange={handleFormValueChange} 
              required 
            />
            <FormInputItem 
              type='password' 
              label="Password" 
              placeholder="*****" 
              name='password' 
              onChange={handleFormValueChange} 
              required 
            />
            <div className='custom-btn'>
              <Btn htmlType="submit" text="Submit"/>
            </div>
          </FormBody>
          <h2 className='text-gray-500'>
            Account credentials unavailable?<br /> Request Admin for your credentials.
          </h2>
        </main>
      </FormContainer>
    </>
  );
};

export default Login;
