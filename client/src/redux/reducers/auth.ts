import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  publicId: string;
  bio: string;
}

const initialState = {
  user: null as User | null,
  isAdmin: false,
  loader: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
});

export const { userExists, userNotExists } = authSlice.actions;
export default authSlice;
