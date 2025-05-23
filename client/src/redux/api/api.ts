import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("token token token ", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Chat", "User"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendRequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
        };
      },
      providesTags: ["Chat"],
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptRequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "user/notifications",
      }),
      keepUnusedDataFor: 0,
    }),
    chatDetails: builder.query({
      query: ({ chatId }) => ({
        url: `chat/details/${chatId}`,
      }),
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/${chatId}/message/page=${page}`,
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    myGroups: builder.query({
      query: () => ({
        url: `cnat/groups/my`,
      }),
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: (data) => ({
        url: "chat/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    renameGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `chat/group/rename/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    removeGroupMember: builder.mutation({
      query: (data) => ({
        url: "chat/group/member",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupMembers: builder.mutation({
      query: (data) => ({
        url: "chat/group/member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: ({ chatId }) => ({
        url: `chat/group/leave/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
} = api;
