import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userRoleId: null,
  roleId: null,
  role: null,
  userId: null,
  readPermission: false,
  writePermission: false,
  loading: false,
  error: null,
  locationId: null,
  userName: null,
  mobileNumber: null,
  email: null,
  employeeDepartment: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        '/login',
        formData
      );
      const data = response.data;
      
      // Check for successful status (assuming statusCode === 0 means success)
      if (data.responseStatus?.statusCode !== 0) {
        return thunkAPI.rejectWithValue(
          data.responseStatus?.message || 'Login failed'
        );
      }
      
      // Return the responseData that contains userRoleId, roleId, role, userId, etc.
      return data.responseData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      // Reset all authentication-related state fields
      state.userRoleId = null;
      state.roleId = null;
      state.role = null;
      state.userId = null;
      state.readPermission = false;
      state.writePermission = false;
      state.loading = false;
      state.error = null;
      state.userName = null;
      state.mobileNumber = null;
      state.email = null;
      state.locationId = null;
      state.employeeDepartment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const {
          userRoleId,
          roleId,
          role,
          userId,
          employeeDepartment,
          readPermission,
          writePermission
        } = action.payload;
        state.userRoleId = userRoleId;
        state.roleId = roleId;
        state.role = role;
        state.userId = userId;
        state.readPermission = readPermission;
        state.writePermission = writePermission;
        state.locationId = "BNG"
        state.userName = action?.payload?.userName;
        state.email = action?.payload?.email;
        state.mobileNumber = action?.payload?.mobileNumber;
        state.employeeDepartment = action?.payload?.employeeDepartment;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
