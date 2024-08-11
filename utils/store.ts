import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import moodReducer from "./mood-slice";
import musicReducer from "./music-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    mood: moodReducer,
    music: musicReducer,
  },
});