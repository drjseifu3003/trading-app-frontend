import { api } from "./apiSlice"

export interface UserProfile {
  user_id: string
  full_name?: string
  phone?: string
  credit_score: number
  verification_level: number
  kyc_verified: boolean
  cash: number
  margin: number
  government_id?: string
  geneder?: string
  address?: string
}

interface SuccessUserBalance {
  user_id: number;
  balance: number;
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
      query: () => "/profile.php",
      providesTags: ["User"],
    }),

    getTransactionHistory: builder.query<TransactionHistory[], void>({
      query: () => "/user/transactions",
      providesTags: ["Transaction"],
    }),

    getUserBalance: builder.query<SuccessUserBalance, void>({
      query: () => "/get_balance.php",
      providesTags: ["Transaction"],
    }),

    updateUserProfile: builder.mutation<UserProfile, FormData>({
      query: (formData) => ({
        url: "/profile.php",
        method: "POST",
        body: formData,
        // Do NOT set 'Content-Type' header here, let browser handle it.
      }),
      invalidatesTags: ["User"],
    }),

    updatePassword: builder.mutation<{message: string}, {old_password:string, password:string}>({
      query: (formData) => ({
        url: "/change-password.php",
        method: "PUT",
        body: formData,
        // Do NOT set 'Content-Type' header here, let browser handle it.
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
  useUpdatePasswordMutation,
  useGetUserBalanceQuery
} = userApi
