import { createSlice } from "@reduxjs/toolkit";

export const moodSlice = createSlice({
  name: "mood",
  initialState: {
    mood: {
      icon: "happy-outline",
      mood: "Happy",
      subtitle: "Always keep a smile on your face!",
    },
  },
  reducers: {
    setMood(state, action) {
      state.mood = action.payload.mood;
    },
  },
});

export const { setMood } = moodSlice.actions;
export default moodSlice.reducer;
