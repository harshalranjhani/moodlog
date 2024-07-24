import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: "",
  },
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload.token;
    },
  },
});

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;
