import type React from "react"

interface MarketItem {
  name: string
  price: string
  change: string
  isPositive: boolean
  icon?: React.ReactNode
}

interface MarketTableProps {
  items: MarketItem[]
}

const MarketTable: React.FC<MarketTableProps> = ({ items }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left">
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Name</th>
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Price</th>
          <th className="py-2 px-1 border-b border-gray-200 text-sm">Chart</th>
          <th className="py-2 px-1 border-b border-gray-200 text-sm">24-hour change</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="py-3 px-1 border-b border-gray-200 flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.name}
            </td>
            <td className="py-3 px-1 border-b border-gray-200">{item.price}</td>
            <td className="py-3 px-1 border-b border-gray-200">
              <svg className="w-20 h-8" viewBox="0 0 100 30">
                <path
                  d={
                    item.isPositive
                      ? "M0,20 L10,18 L20,19 L30,15 L40,17 L50,10 L60,12 L70,8 L80,5 L90,7 L100,5"
                      : "M0,15 L10,10 L20,20 L30,5 L40,15 L50,10 L60,15 L70,5 L80,10 L90,15 L100,10"
                  }
                  stroke={item.isPositive ? "#4CAF50" : "#F44336"}
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </td>
            <td className={`py-3 px-1 border-b border-gray-200 ${item.isPositive ? "text-green-600" : "text-red-600"}`}>
              {item.change}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MarketTable
