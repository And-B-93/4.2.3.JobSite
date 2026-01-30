import { combineReducers, configureStore } from "@reduxjs/toolkit";
import fetchReduser from "../reducers/fetchSlice";

const rootReducer = combineReducers({
  fetch: fetchReduser,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
