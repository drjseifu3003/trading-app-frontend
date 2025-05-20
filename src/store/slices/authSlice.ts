import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../index"
import { getToken, removeToken, setToken } from "@/lib/tokenStorage"
import { set } from "react-hook-form"

interface AuthState {
  user: {
    email: string | null
    uid: string | null
  } | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: getToken() || null,
  isAuthenticated: getToken() ? true : false,
  isLoading: false,
  error: null,
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: {
    email: string
    uid: string
  }
  token: string
}

export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch("https://onchainvip.etoure.com/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || "Login failed")
      }

      const data = await response.json()

      // Save token to localStorage
      // localStorage.setItem("token", data.token)
      setToken(data.token)

      return data
    } catch (error) {
      return rejectWithValue("Network error. Please try again.")
    }
  },
)

export const signup = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch("https://onchainvip.etoure.com/api/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || "Login failed")
      }

      const data = await response.json()

      // Save token to localStorage
      // localStorage.setItem("token", data.token)
      setToken(data.token)

      return data
    } catch (error) {
      return rejectWithValue("Network error. Please try again.")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  // Remove token from localStorage
  removeToken()
  // localStorage.removeItem("token")

  // In a real app, you might want to call an API to invalidate the token
  return true
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { clearError } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthError = (state: RootState) => state.auth.error
export const selectAuthLoading = (state: RootState) => state.auth.isLoading

export default authSlice.reducer