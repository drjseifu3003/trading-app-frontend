"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetMarketDetailQuery } from "../store/api/marketApi"
import OptionsModal from "../components/OptionModal"

const MarketDetailScreen: React.FC = () => {
  const navigate = useNavigate()
  const { symbol } = useParams<{ symbol: string }>()
  const [timeInterval, setTimeInterval] = useState("1h")
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)

  const { data: marketData, isLoading, error } = useGetMarketDetailQuery(symbol || "")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-red-400 mb-4">Error loading market data</p>
        <button onClick={() => navigate(-1)} className="bg-amber-500 text-black px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    )
  }

  // Fallback data if API fails
  const fallbackData = {
    symbol: symbol || "ETH",
    price: "2,594.34",
    priceUsd: "$2,594.34",
    changePercent: "+4.19%",
    high: "2,738.49",
    low: "2,416.04",
    volume24h: "235,942.98",
  }

  // Use API data or fallback
  const displayData = marketData || fallbackData

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="text-xl font-bold">{displayData.symbol}</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Price and Stats */}
      <div className="px-4 pb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-green-400">{displayData.price}</span>
          <span className="ml-4 text-green-400">{displayData.changePercent}</span>
        </div>
        <div className="text-gray-400 text-sm">≈{displayData.priceUsd}</div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-gray-400 text-sm">High</div>
            <div className="text-green-400">{displayData.high}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Low</div>
            <div className="text-green-400">{displayData.low}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">24Hrs</div>
            <div className="text-green-400">{displayData.volume24h}</div>
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

      {/* Chart */}
      <div className="flex-1 relative">
        {/* Technical Indicators */}
        <div className="absolute top-2 left-2 text-xs">
          <span className="text-gray-400 mr-2">MA5(10,20)</span>
          <span className="text-amber-500 mr-2">MA5: 2,598.6360</span>
          <span className="text-purple-400 mr-2">MA10: 2,598.2460</span>
          <span className="text-blue-400 mr-2">MA30: 2,591.3673</span>
          <span className="text-red-400">MA60: 2,584.6317</span>
        </div>

        {/* Candlestick Chart - This would normally be a chart library component */}
        <div className="w-full h-2/3 mt-6 px-2">
          <CandlestickChart />
        </div>

        {/* Volume Chart */}
        <div className="w-full h-1/3 px-2">
          <VolumeChart />
        </div>

        {/* Time Labels */}
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

      {/* Options Modal */}
      <OptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        symbol={displayData.symbol}
        price="102,997.32"
        changePercent="-1.1%"
      />
    </div>
  )
}

// Placeholder component for the candlestick chart
// In a real app, you would use a chart library like recharts, chart.js, or trading-vue-js
const CandlestickChart: React.FC = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1="0" x2="500" y2="0" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="40" x2="500" y2="40" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="80" x2="500" y2="80" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="120" x2="500" y2="120" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="160" x2="500" y2="160" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="200" x2="500" y2="200" stroke="#333" strokeWidth="1" />

      <line x1="0" y1="0" x2="0" y2="200" stroke="#333" strokeWidth="1" />
      <line x1="100" y1="0" x2="100" y2="200" stroke="#333" strokeWidth="1" />
      <line x1="200" y1="0" x2="200" y2="200" stroke="#333" strokeWidth="1" />
      <line x1="300" y1="0" x2="300" y2="200" stroke="#333" strokeWidth="1" />
      <line x1="400" y1="0" x2="400" y2="200" stroke="#333" strokeWidth="1" />
      <line x1="500" y1="0" x2="500" y2="200" stroke="#333" strokeWidth="1" />

      {/* Moving averages */}
      <path
        d="M0,180 C50,170 100,160 150,140 S200,120 250,100 S300,80 350,70 S400,60 500,50"
        fill="none"
        stroke="#ff0000"
        strokeWidth="1"
      />
      <path
        d="M0,160 C50,150 100,140 150,120 S200,100 250,80 S300,60 350,50 S400,40 500,30"
        fill="none"
        stroke="#0088ff"
        strokeWidth="1"
      />
      <path
        d="M0,140 C50,130 100,120 150,100 S200,80 250,60 S300,40 350,30 S400,20 500,10"
        fill="none"
        stroke="#ffaa00"
        strokeWidth="1"
      />

      {/* Candlesticks */}
      {/* Green candles (price up) */}
      <rect x="20" y="120" width="10" height="30" fill="#00e676" />
      <line x1="25" y1="110" x2="25" y2="120" stroke="#00e676" strokeWidth="2" />
      <line x1="25" y1="150" x2="25" y2="160" stroke="#00e676" strokeWidth="2" />

      <rect x="50" y="110" width="10" height="20" fill="#00e676" />
      <line x1="55" y1="100" x2="55" y2="110" stroke="#00e676" strokeWidth="2" />
      <line x1="55" y1="130" x2="55" y2="140" stroke="#00e676" strokeWidth="2" />

      <rect x="140" y="90" width="10" height="40" fill="#00e676" />
      <line x1="145" y1="80" x2="145" y2="90" stroke="#00e676" strokeWidth="2" />
      <line x1="145" y1="130" x2="145" y2="140" stroke="#00e676" strokeWidth="2" />

      <rect x="200" y="70" width="10" height="30" fill="#00e676" />
      <line x1="205" y1="60" x2="205" y2="70" stroke="#00e676" strokeWidth="2" />
      <line x1="205" y1="100" x2="205" y2="110" stroke="#00e676" strokeWidth="2" />

      <rect x="320" y="40" width="10" height="50" fill="#00e676" />
      <line x1="325" y1="30" x2="325" y2="40" stroke="#00e676" strokeWidth="2" />
      <line x1="325" y1="90" x2="325" y2="100" stroke="#00e676" strokeWidth="2" />

      <rect x="380" y="60" width="10" height="20" fill="#00e676" />
      <line x1="385" y1="50" x2="385" y2="60" stroke="#00e676" strokeWidth="2" />
      <line x1="385" y1="80" x2="385" y2="90" stroke="#00e676" strokeWidth="2" />

      <rect x="440" y="50" width="10" height="30" fill="#00e676" />
      <line x1="445" y1="40" x2="445" y2="50" stroke="#00e676" strokeWidth="2" />
      <line x1="445" y1="80" x2="445" y2="90" stroke="#00e676" strokeWidth="2" />

      {/* Red candles (price down) */}
      <rect x="80" y="100" width="10" height="40" fill="#ff3d00" />
      <line x1="85" y1="90" x2="85" y2="100" stroke="#ff3d00" strokeWidth="2" />
      <line x1="85" y1="140" x2="85" y2="150" stroke="#ff3d00" strokeWidth="2" />

      <rect x="170" y="80" width="10" height="60" fill="#ff3d00" />
      <line x1="175" y1="70" x2="175" y2="80" stroke="#ff3d00" strokeWidth="2" />
      <line x1="175" y1="140" x2="175" y2="150" stroke="#ff3d00" strokeWidth="2" />

      <rect x="230" y="90" width="10" height="50" fill="#ff3d00" />
      <line x1="235" y1="80" x2="235" y2="90" stroke="#ff3d00" strokeWidth="2" />
      <line x1="235" y1="140" x2="235" y2="150" stroke="#ff3d00" strokeWidth="2" />

      <rect x="260" y="110" width="10" height="30" fill="#ff3d00" />
      <line x1="265" y1="100" x2="265" y2="110" stroke="#ff3d00" strokeWidth="2" />
      <line x1="265" y1="140" x2="265" y2="150" stroke="#ff3d00" strokeWidth="2" />

      <rect x="350" y="70" width="10" height="20" fill="#ff3d00" />
      <line x1="355" y1="60" x2="355" y2="70" stroke="#ff3d00" strokeWidth="2" />
      <line x1="355" y1="90" x2="355" y2="100" stroke="#ff3d00" strokeWidth="2" />

      <rect x="410" y="60" width="10" height="30" fill="#ff3d00" />
      <line x1="415" y1="50" x2="415" y2="60" stroke="#ff3d00" strokeWidth="2" />
      <line x1="415" y1="90" x2="415" y2="100" stroke="#ff3d00" strokeWidth="2" />

      <rect x="470" y="50" width="10" height="20" fill="#ff3d00" />
      <line x1="475" y1="40" x2="475" y2="50" stroke="#ff3d00" strokeWidth="2" />
      <line x1="475" y1="70" x2="475" y2="80" stroke="#ff3d00" strokeWidth="2" />
    </svg>
  )
}

// Placeholder component for the volume chart
const VolumeChart: React.FC = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 100" preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1="0" x2="500" y2="0" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="25" x2="500" y2="25" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="50" x2="500" y2="50" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="75" x2="500" y2="75" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="100" x2="500" y2="100" stroke="#333" strokeWidth="1" />

      {/* Volume bars */}
      <rect x="20" y="70" width="6" height="30" fill="#00e676" />
      <rect x="35" y="80" width="6" height="20" fill="#ff3d00" />
      <rect x="50" y="75" width="6" height="25" fill="#00e676" />
      <rect x="65" y="85" width="6" height="15" fill="#ff3d00" />
      <rect x="80" y="60" width="6" height="40" fill="#ff3d00" />
      <rect x="95" y="80" width="6" height="20" fill="#00e676" />
      <rect x="110" y="85" width="6" height="15" fill="#ff3d00" />
      <rect x="125" y="75" width="6" height="25" fill="#00e676" />
      <rect x="140" y="65" width="6" height="35" fill="#00e676" />
      <rect x="155" y="70" width="6" height="30" fill="#ff3d00" />
      <rect x="170" y="50" width="6" height="50" fill="#ff3d00" />
      <rect x="185" y="60" width="6" height="40" fill="#00e676" />
      <rect x="200" y="55" width="6" height="45" fill="#00e676" />
      <rect x="215" y="40" width="6" height="60" fill="#ff3d00" />
      <rect x="230" y="45" width="6" height="55" fill="#ff3d00" />
      <rect x="245" y="75" width="6" height="25" fill="#ff3d00" />
      <rect x="260" y="80" width="6" height="20" fill="#ff3d00" />
      <rect x="275" y="85" width="6" height="15" fill="#ff3d00" />
      <rect x="290" y="80" width="6" height="20" fill="#ff3d00" />
      <rect x="305" y="75" width="6" height="25" fill="#ff3d00" />
      <rect x="320" y="30" width="6" height="70" fill="#00e676" />
      <rect x="335" y="70" width="6" height="30" fill="#ff3d00" />
      <rect x="350" y="75" width="6" height="25" fill="#ff3d00" />
      <rect x="365" y="65" width="6" height="35" fill="#ff3d00" />
      <rect x="380" y="70" width="6" height="30" fill="#00e676" />
      <rect x="395" y="60" width="6" height="40" fill="#ff3d00" />
      <rect x="410" y="65" width="6" height="35" fill="#ff3d00" />
      <rect x="425" y="70" width="6" height="30" fill="#00e676" />
      <rect x="440" y="75" width="6" height="25" fill="#00e676" />
      <rect x="455" y="80" width="6" height="20" fill="#ff3d00" />
      <rect x="470" y="75" width="6" height="25" fill="#00e676" />

      {/* Moving averages for volume */}
      <path
        d="M0,70 C50,65 100,60 150,50 S200,40 250,60 S300,50 350,55 S400,60 500,65"
        fill="none"
        stroke="#ffaa00"
        strokeWidth="1"
      />
      <path
        d="M0,75 C50,70 100,65 150,55 S200,45 250,65 S300,55 350,60 S400,65 500,70"
        fill="none"
        stroke="#0088ff"
        strokeWidth="1"
      />
    </svg>
  )
}

export default MarketDetailScreen
