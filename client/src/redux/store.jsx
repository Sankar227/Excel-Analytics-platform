import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    admin: adminReducer,
  },
});

export default store;
