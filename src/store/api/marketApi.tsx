import type React from "react"
import { api } from "./apiSlice"
import { HistoryItem } from "@/src/components/HistoryModal"

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

    getTrades: builder.query<HistoryItem[], void>({
      query: () => (
        {
          url: "/trade.php",
          method: "GET",
        }
      ),
      providesTags: ["Market"],
    }),

    addTrade: builder.mutation<{message: string}, { symbol: string, time: string; currency_pair: number, expected_profit_loss: number, final_profit_loss: number }>({
      query: (data) => ({
        url: "/trade.php",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Market"],
    })
  }),
})

export const { useGetMarketsQuery, useGetMarketDetailQuery, useGetTradesQuery, useAddTradeMutation } = marketApi