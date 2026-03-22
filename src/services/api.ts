import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Settings"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  endpoints: (builder) => ({
    uploadExcel: builder.mutation<{ jobId: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/stock/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    getProgress: builder.query<any, string>({
      query: (jobId) => `/progress/${jobId}`,
    }),
    getUploadHistory: builder.query({
      query: () => `/upload/get-history`,
    }),
    getSettings: builder.query({
      query: () => `/settings`,
      providesTags: ["Settings"],
    }),
    postSettings: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/settings`,
          method:"POST",
          body,
        };
      },
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useUploadExcelMutation,
  useGetProgressQuery,
  useGetUploadHistoryQuery,
  useGetSettingsQuery,
  usePostSettingsMutation,
} = api;
