// CountdownModal.tsx
import React, { useEffect, useState } from "react"

interface CountdownModalProps {
  duration: number
  entryPrice: number
  onClose: () => void
  getCurrentPrice: () => number
}

const CountdownModal: React.FC<CountdownModalProps> = ({
  duration,
  entryPrice,
  onClose,
  getCurrentPrice,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [currentPrice, setCurrentPrice] = useState(entryPrice)
  const [result, setResult] = useState<null | {
    outcome: "WIN" | "LOSS"
    change: number
    exit: number
  }>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          const exit = getCurrentPrice()
          const changePct = ((exit - entryPrice) / entryPrice) * 100
          const outcome = exit < entryPrice ? "WIN" : "LOSS"
          setCurrentPrice(exit)
          setResult({ outcome, change: Math.abs(changePct), exit })
          return 0
        }
        setCurrentPrice(getCurrentPrice())
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-lg font-bold">Trade In Progress</h2>
        <div className="text-gray-600">Entry Price: <b>{entryPrice.toFixed(2)}</b></div>
        <div className="text-gray-600">Current Price: <b>{currentPrice.toFixed(2)}</b></div>

        {result ? (
          <div>
            <div className={`mt-4 text-2xl font-bold ${result.outcome === "WIN" ? "text-green-600" : "text-red-600"}`}>
              {result.outcome}
            </div>
            <div className="text-sm text-gray-500">
              Exit: {result.exit.toFixed(2)} <br />
              Change: {result.change.toFixed(2)}%
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-xl font-semibold text-amber-500">
            Trade ends in: {timeLeft}s
          </div>
        )}
      </div>
    </div>
  )
}

export default CountdownModal
