import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobile: false,
  isMobileMenuFriend: false,
  isDeleteChat: false,
  isSearch: false,
  isFileMenu: false,
  isSelectedDeleteChat: false,
  uploadingLoader: false,
  selectedChat: {
    chatId: "",
    groupChat: false,
  },
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobileMenuFriend: (state, action) => {
      state.isMobileMenuFriend = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    SetIsSelectedDeleteChat: (state, action) => {
      state.isSelectedDeleteChat = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isSelectedDeleteChat = action.payload;
    },
    setIsuploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setIsselectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export default miscSlice;
export const {
  setIsNewGroup,
  setIsDeleteMenu,
  setIsAddMember,
  setIsNotification,
  setIsMobile,
  setIsMobileMenuFriend,
  setIsSearch,
  setIsFileMenu,
  SetIsSelectedDeleteChat,
  setIsuploadingLoader,
  setIsselectedChat,
} = miscSlice.actions;
