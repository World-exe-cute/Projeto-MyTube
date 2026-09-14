import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"; //authSlicer é renomeado para authReducer aqui?

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
