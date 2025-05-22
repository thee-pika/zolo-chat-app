import { configureStore } from "@reduxjs/toolkit";
import authslice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";

const store = configureStore({
  reducer: {
    [authslice.name]: authslice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
