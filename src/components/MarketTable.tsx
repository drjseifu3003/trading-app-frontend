import { useRouter } from "next/navigation"
import type React from "react"

interface MarketItem {
  name: string
  symbol: string
  price: string
  change: string
  isPositive: boolean
  icon?: React.ReactNode
}

interface MarketTableProps {
  items: Coin[],
  isClick: boolean
}

export type Coin = {
  id: string;
  symbol: string;
  name: string;
};

const MarketTable: React.FC<MarketTableProps> = ({ items, isClick }) => {
  const router = useRouter()
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left">
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Id</th>
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Name</th>
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Symbol</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} onClick={() => {if(isClick) router.push(`/market/${item.id}`)}} className="cursor-pointer hover:bg-gray-100">
            <td className="py-3 px-1 border-b border-gray-200 flex items-center">
              {item.id}
            </td>
            <td className="py-3 px-1 border-b border-gray-200 flex items-center">
              {item.name}
            </td>
            <td className="py-3 px-1 border-b border-gray-200">{item.symbol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MarketTable
