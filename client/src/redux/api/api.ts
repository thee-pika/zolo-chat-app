import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export default api;
export const { useMyChatsQuery } = api;


