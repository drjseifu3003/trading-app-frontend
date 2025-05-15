"use client"

import type React from "react"
import { useState } from "react"

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
}

const TradingModal: React.FC<TradingModalProps> = ({ isOpen, onClose }) => {
  const [purchaseType, setPurchaseType] = useState("Amount Purchase")
  const [amount, setAmount] = useState("")
  const [takeProfitStopLoss, setTakeProfitStopLoss] = useState(false)
  const [takeProfit, setTakeProfit] = useState("")
  const [stopLoss, setStopLoss] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-white">₿</span>
            </div>
            <span className="font-medium">BTC</span>
          </div>
          <button onClick={onClose} className="text-gray-500">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-green-500">103,013.00</span>
            <span className="ml-2 text-sm text-green-500">0.33%</span>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center ${
              purchaseType === "Amount Purchase" ? "bg-amber-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setPurchaseType("Amount Purchase")}
          >
            Amount Purchase
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              purchaseType === "Quantity Purchase" ? "bg-amber-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setPurchaseType("Quantity Purchase")}
          >
            Quantity Purchase
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-end mb-2">
            <span className="text-sm text-gray-600">Leverage</span>
          </div>

          <div className="flex mb-4">
            <div className="flex-1 bg-gray-100 rounded-l-md p-3">
              <input
                type="number"
                className="w-full bg-transparent outline-none"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="bg-gray-100 rounded-r-md p-3 flex items-center">
              <span className="text-gray-600 mr-2">USDT</span>
            </div>
            <div className="ml-2 bg-gray-100 rounded-md p-3 flex items-center">
              <span className="text-gray-800">10X</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-white">$</span>
            </div>
            <span className="text-sm">Balance: 0.00 USDT</span>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="takeProfitStopLoss"
              checked={takeProfitStopLoss}
              onChange={(e) => setTakeProfitStopLoss(e.target.checked)}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="takeProfitStopLoss" className="text-sm">
              Take Profit/Stop loss
            </label>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Take Profit</div>
              <input
                type="number"
                className={`w-full p-3 rounded-md ${
                  takeProfitStopLoss ? "bg-white border border-gray-300" : "bg-gray-100"
                }`}
                placeholder="0.00"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                disabled={!takeProfitStopLoss}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Stop loss</div>
              <input
                type="number"
                className={`w-full p-3 rounded-md ${
                  takeProfitStopLoss ? "bg-white border border-gray-300" : "bg-gray-100"
                }`}
                placeholder="0.00"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                disabled={!takeProfitStopLoss}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-green-500 text-white py-4 rounded-md font-medium flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              Buy Long
            </button>
            <button className="flex-1 bg-red-500 text-white py-4 rounded-md font-medium flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </svg>
              Sell Short
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradingModal