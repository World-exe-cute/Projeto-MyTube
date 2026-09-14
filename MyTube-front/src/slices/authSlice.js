import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const initialState = {
  error: false,
  success: false,
  loading: false,
};

export const authThunk = createAsyncThunk(
  "auth/action",
  async ({ formData, infoData }, thunkAPI) => {
    const data = await authService.fetchUser(formData, infoData);

    if (!data) {
      return thunkAPI.rejectWithValue(data.msg);
    }
    return data;
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authThunk.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(authThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(authThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
