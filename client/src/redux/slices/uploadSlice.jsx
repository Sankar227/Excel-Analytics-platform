import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    data: [],
    history: [],
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      state.history.unshift({
        timestamp: new Date().toISOString(),
        preview: action.payload.slice(0, 5),
      });
    },
  },
});

export const { setData } = uploadSlice.actions;
export default uploadSlice.reducer;
