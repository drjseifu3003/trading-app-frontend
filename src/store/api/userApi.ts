import { api } from "./apiSlice"

export interface UserProfile {
  email: string
  uid: string
  creditLevel: number
  level: number
  balance: string
  assets: string
}

export interface TransactionHistory {
  id: string
  type: "deposit" | "withdrawal" | "trade"
  amount: string
  status: "completed" | "pending" | "failed"
  date: string
  currency: string
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),

    getTransactionHistory: builder.query<TransactionHistory[], void>({
      query: () => "/user/transactions",
      providesTags: ["Transaction"],
    }),

    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    withdrawFunds: builder.mutation<{ success: boolean }, { amount: string; address: string }>({
      query: (data) => ({
        url: "/user/withdraw",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Transaction"],
    }),

    depositFunds: builder.mutation<{ address: string }, { amount: string; currency: string }>({
      query: (data) => ({
        url: "/user/deposit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useGetTransactionHistoryQuery,
  useUpdateUserProfileMutation,
  useWithdrawFundsMutation,
  useDepositFundsMutation,
} = userApi
