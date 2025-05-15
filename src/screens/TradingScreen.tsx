"use client"

import type React from "react"
import { useState } from "react"
import TabGroup from "../components/TabGroup"
import TradingModal from "../components/TradingModal"

const TradingScreen: React.FC = () => {
  const [tradingTab, setTradingTab] = useState("Contract")
  const [positionsTab, setPositionsTab] = useState("Positions")
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div className="bg-amber-500 p-4">
        <TabGroup
          tabs={["Contract"]}
          activeTab={tradingTab}
          onTabChange={setTradingTab}
        />
      </div>

      <div className="bg-white p-4">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">Balance</div>
            <div className="text-xl font-bold">0.00</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Assets</div>
            <div className="text-xl font-bold">0.00</div>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <div className="text-sm text-gray-500">Daily Profit</div>
            <div className="text-green-600">+0.00</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Profit</div>
            <div className="text-green-600">+0.00</div>
          </div>
        </div>

        <button
          className="w-full bg-amber-500 text-white py-3 rounded mt-6 font-medium"
          onClick={() => setIsModalOpen(true)}
        >
          Trading Now
        </button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <div
            className={`flex-1 text-center py-3 ${positionsTab === "Positions" ? "border-b-2 border-amber-500 font-medium" : ""}`}
            onClick={() => setPositionsTab("Positions")}
          >
            Positions
          </div>
          <div
            className={`flex-1 text-center py-3 ${positionsTab === "Historical Order" ? "border-b-2 border-amber-500 font-medium" : ""}`}
            onClick={() => setPositionsTab("Historical Order")}
          >
            Historical Order
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div className="text-gray-400">Empty</div>
      </div>

      <TradingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default TradingScreen
