import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
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
  }),
});

export const {
  useUploadExcelMutation,
  useGetProgressQuery,
  useGetUploadHistoryQuery,
} = api;
