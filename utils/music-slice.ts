import { createSlice } from "@reduxjs/toolkit";

export const musicSlice = createSlice({
  name: "music",
  initialState: {
    musicData: [],
  },
  reducers: {
    setMusicRecs(state, action) {
      state.musicData = action.payload.musicData;
    },
  },
});

export const { setMusicRecs } = musicSlice.actions;
export default musicSlice.reducer;
