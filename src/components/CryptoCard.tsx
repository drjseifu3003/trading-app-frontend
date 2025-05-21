"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useNavigate } from "react-router-dom"

interface CryptoCardProps {
  id: string,
  name: string
  price: string
  change: string
  type: "btc" | "eth"
}

const CryptoCard: React.FC<CryptoCardProps> = ({ id, name, price, change, type }) => {
  const router = useRouter()
  const isPositive = change.startsWith("+")

  const bgClass =
    type === "btc" ? "bg-gradient-to-br from-yellow-300 to-yellow-500" : "bg-gradient-to-br from-gray-100 to-blue-400"

  const handleClick = () => {
    router.push(`/market/${id}`)
  }

  return (
    <div className={`min-w-[150px] p-4 rounded-xl ${bgClass} shadow cursor-pointer`} onClick={handleClick}>
      <div className="font-bold mb-1">{name}</div>
      <div className="text-lg font-bold mb-1">{price}</div>
      <div className={isPositive ? "text-green-600" : "text-red-600"}>{change}</div>
    </div>
  )
}

export default CryptoCard
