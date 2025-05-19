"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetTradesQuery } from "../store/api/marketApi"
import { array } from "zod"

export interface HistoryItem {
  time: string
  currency_pair: string
  expected_profit_loss: number
  final_profit_loss: number
  symbol: string;
  date: string;
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const { data, isLoading } = useGetTradesQuery()

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="font-medium text-lg">History</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {data?.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No history available</div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Currency Pair</th>
                <th className="p-3">Expected P/L</th>
                <th className="p-3">Final P/L</th>
                <th className="p-3">Symbol</th>
              </tr>
            </thead>
            <tbody>
              {data && (Array.isArray(data) ? data : [data]).map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">{item?.date ?? "NA"}</td>
                    <td className="p-3 whitespace-nowrap">{item?.time}</td>
                    <td className="p-3">{item?.currency_pair}</td>
                    <td className="p-3 text-blue-600">{item?.expected_profit_loss}</td>
                    <td className={`p-3 ${item?.final_profit_loss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item?.final_profit_loss}
                    </td>
                    <td className="p-3">{item?.symbol}</td>
                </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button onClick={onClose} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 h-auto text-base font-medium">
          Close
        </Button>
      </div>
    </div>
  )
}

export default HistoryModal