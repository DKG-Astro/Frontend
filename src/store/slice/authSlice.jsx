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
  error: null
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
          readPermission,
          writePermission
        } = action.payload;
        state.userRoleId = userRoleId;
        state.roleId = roleId;
        state.role = role;
        state.userId = userId;
        state.readPermission = readPermission;
        state.writePermission = writePermission;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
