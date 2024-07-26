import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import moodReducer from "./mood-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    mood: moodReducer,
  },
});