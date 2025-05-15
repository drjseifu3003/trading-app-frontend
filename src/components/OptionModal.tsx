"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface OptionsModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  price: string
  changePercent: string
}

interface TimeOption {
  duration: string
  seconds: number
  return: number
}

const OptionsModal: React.FC<OptionsModalProps> = ({ isOpen, onClose, symbol, price, changePercent }) => {
  const [selectedTime, setSelectedTime] = useState<number>(30)
  const [quantity, setQuantity] = useState<string>("")
  const [expectedReturn, setExpectedReturn] = useState<string>("0.00")

  const timeOptions: TimeOption[] = [
    { duration: "30s", seconds: 30, return: 3 },
    { duration: "60s", seconds: 60, return: 10 },
    { duration: "90s", seconds: 90, return: 15 },
    { duration: "120s", seconds: 120, return: 22 },
    { duration: "180s", seconds: 180, return: 30 },
    { duration: "300s", seconds: 300, return: 40 },
  ]

  useEffect(() => {
    if (quantity && !isNaN(Number.parseFloat(quantity))) {
      const selectedOption = timeOptions.find((option) => option.seconds === selectedTime)
      if (selectedOption) {
        const returnAmount = (Number.parseFloat(quantity) * selectedOption.return) / 100
        setExpectedReturn(returnAmount.toFixed(2))
      }
    } else {
      setExpectedReturn("0.00")
    }
  }, [quantity, selectedTime, timeOptions])

  if (!isOpen) return null

  const isNegative = changePercent.startsWith("-")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-white">₿</span>
            </div>
            <span className="font-medium">{symbol}</span>
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
            <span className={`text-2xl font-bold ${isNegative ? "text-red-500" : "text-green-500"}`}>{price}</span>
            <span className={`ml-2 text-sm ${isNegative ? "text-red-500" : "text-green-500"}`}>{changePercent}</span>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="text-gray-600 mb-2">Time</div>
          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map((option) => (
              <div
                key={option.seconds}
                className={`p-3 rounded border text-center cursor-pointer ${
                  selectedTime === option.seconds
                    ? "bg-amber-500 border-amber-600 text-white"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
                onClick={() => setSelectedTime(option.seconds)}
              >
                <div className="flex justify-center items-center mb-1">
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
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="font-medium">{option.duration}</div>
                <div className="text-sm">Return: {option.return}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-2">
            <div className="text-gray-600">Quantity (USDT)</div>
            <div className="text-gray-600">
              Expected return <span className="text-amber-500">{expectedReturn}</span>
            </div>
          </div>

          <div className="flex mb-4">
            <input
              type="number"
              className="flex-1 p-3 bg-gray-100 rounded-l-md outline-none"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="bg-gray-100 rounded-r-md p-3 flex items-center">
              <span className="text-gray-600">USDT</span>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-white">$</span>
              </div>
              <span className="text-sm">Balance: 0.00 USDT</span>
            </div>
            <div className="text-sm text-gray-600">Limit: 100 - 499</div>
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

export default OptionsModal
