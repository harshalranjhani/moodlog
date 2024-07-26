import { createSlice } from "@reduxjs/toolkit";

export const moodSlice = createSlice({
  name: "mood",
  initialState: {
    mood: {
      icon: "happy-outline",
      mood: "Happy",
      subtitle: "Always keep a smile on your face!",
    },
    suggestion: "",
  },
  reducers: {
    setMood(state, action) {
      state.mood = action.payload;
    },
    setSuggestion(state, action) {
      state.suggestion = action.payload;
    },
  },
});

export const { setMood, setSuggestion } = moodSlice.actions;
export default moodSlice.reducer;
