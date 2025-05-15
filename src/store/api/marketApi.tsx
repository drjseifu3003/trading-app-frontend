import type React from "react"
import { api } from "./apiSlice"

export interface MarketData {
  symbol: string
  price: string
  priceUsd: string
  changePercent: string
  high: string
  low: string
  volume24h: string
}

export interface CryptoItem {
  name: string
  price: string
  change: string
  isPositive: boolean
  icon?: React.ReactNode
}

export const marketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMarkets: builder.query<CryptoItem[], void>({
      query: () => "/markets",
      transformResponse: (response: any) => {
        // Transform the response to match our CryptoItem interface
        return response.map((item: any) => ({
          name: item.symbol,
          price: item.price,
          change: item.change_percent.startsWith("+")
            ? item.change_percent
            : item.change_percent.startsWith("-")
              ? item.change_percent
              : `+${item.change_percent}`,
          isPositive: !item.change_percent.startsWith("-"),
        }))
      },
      providesTags: ["Market"],
    }),

    getMarketDetail: builder.query<MarketData, string>({
      query: (symbol) => `/markets/${symbol}`,
      providesTags: (result, error, symbol) => [{ type: "Market", id: symbol }],
    }),

    getForexMarkets: builder.query<CryptoItem[], void>({
      query: () => "/forex",
      transformResponse: (response: any) => {
        return response.map((item: any) => ({
          name: item.symbol,
          price: item.price,
          change: item.change_percent.startsWith("+")
            ? item.change_percent
            : item.change_percent.startsWith("-")
              ? item.change_percent
              : `+${item.change_percent}`,
          isPositive: !item.change_percent.startsWith("-"),
        }))
      },
      providesTags: ["Market"],
    }),
  }),
})

export const { useGetMarketsQuery, useGetMarketDetailQuery, useGetForexMarketsQuery } = marketApi
