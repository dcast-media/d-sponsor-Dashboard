import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/contexts/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
