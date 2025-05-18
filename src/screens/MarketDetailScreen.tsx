"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import OptionsModal from "../components/OptionModal"

const CandlestickChart: React.FC = () => (
  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-sm text-gray-400">
    Candlestick Chart Placeholder
  </div>
)

const VolumeChart: React.FC = () => (
  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-sm text-gray-400">
    Volume Chart Placeholder
  </div>
)

interface PageProps {
  slug: string
}

const MarketDetailScreen = ({slug}:PageProps) => {
  const router = useRouter()
  console.log("slug", slug)
  const symbol = (slug ?? "BTCUSDT").toUpperCase()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timeInterval, setTimeInterval] = useState("1h")
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        if (!response.ok) throw new Error("Failed to fetch market data")
        const json = await response.json()
        setData(json)
        setError(false)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-red-400 mb-4">Error loading market data</p>
        <button
          onClick={() => router.back()}
          className="bg-amber-500 text-black px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  const price = parseFloat(data.lastPrice).toFixed(2)
  const priceChangePercent = parseFloat(data.priceChangePercent).toFixed(2)
  const highPrice = parseFloat(data.highPrice).toFixed(2)
  const lowPrice = parseFloat(data.lowPrice).toFixed(2)
  const volume = parseFloat(data.volume).toFixed(2)
  const quoteVolume = parseFloat(data.quoteVolume).toFixed(2)

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="text-white">
          ←
        </button>
        <h1 className="text-xl font-bold">{symbol}</h1>
        <div className="w-6"></div>
      </div>

      {/* Price and Stats */}
      <div className="px-4 pb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-green-400">${price}</span>
          <span className={`ml-4 ${priceChangePercent.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
            {priceChangePercent}%
          </span>
        </div>
        <div className="text-gray-400 text-sm">≈ ${price}</div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-gray-400 text-sm">High</div>
            <div className="text-green-400">${highPrice}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Low</div>
            <div className="text-green-400">${lowPrice}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Volume (24H)</div>
            <div className="text-green-400">{volume}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Quote Vol (24H)</div>
            <div className="text-green-400">${quoteVolume}</div>
          </div>
        </div>
      </div>

      {/* Time Interval Tabs */}
      <div className="flex border-b border-gray-800">
        {["1m", "5m", "15m", "30m", "1h", "2h", "4h", "D", "W", "M"].map((interval) => (
          <button
            key={interval}
            className={`flex-1 py-2 text-center text-sm ${
              timeInterval === interval ? "text-amber-500 border-b border-amber-500" : "text-gray-400"
            }`}
            onClick={() => setTimeInterval(interval)}
          >
            {interval}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="flex-1 relative">
        <div className="absolute top-2 left-2 text-xs">
          <span className="text-gray-400">MA(10,20,30,60)</span>
        </div>

        <div className="w-full h-2/3 mt-6 px-2">
          <CandlestickChart />
        </div>

        <div className="w-full h-1/3 px-2">
          <VolumeChart />
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-gray-400">
          <span>20:45</span>
          <span>21:00</span>
          <span>21:15</span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <button className="bg-amber-500 text-black py-3 rounded font-medium">Contract</button>
        <button
          className="bg-amber-500 text-black py-3 rounded font-medium"
          onClick={() => setIsOptionsModalOpen(true)}
        >
          Option
        </button>
      </div>

      {/* Modal */}
      <OptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        symbol={symbol}
        price={price}
        changePercent={`${priceChangePercent}%`}
      />
    </div>
  )
}

export default MarketDetailScreen
