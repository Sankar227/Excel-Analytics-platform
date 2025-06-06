import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    uploads: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUploads: (state, action) => {
      state.uploads = action.payload;
    },
    removeUpload: (state, action) => {
      state.uploads = state.uploads.filter(
        (upload) => upload._id !== action.payload
      );
    },
  },
});

export const { setUsers, setUploads, removeUpload } = adminSlice.actions;
export default adminSlice.reducer;
