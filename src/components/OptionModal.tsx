"use client"

import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAddTradeMutation } from "../store/api/marketApi"

interface OptionsModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string                // e.g. "BTC/USDT"
  price: string                 // latest price as string
  changePercent: string         // 24 h change (e.g. "+0.82%")
}

interface TimeOption {
  duration: string   // label, e.g. "30s"
  seconds: number    // 30
  roi: number        // % return, e.g. 3
}

const formSchema = z.object({
  quantity: z
    .string()
    .min(1, "Required")
    .refine((v) => {
      const n = parseFloat(v)
      return !isNaN(n) && n >= 100 && n <= 499
    }, "Enter an amount between 100 – 499 USDT"),
})

type FormValues = z.infer<typeof formSchema>

const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  symbol,
  price,
  changePercent,
}) => {
  const [AddTrade, { isLoading }] = useAddTradeMutation()
  const [selectedTime, setSelectedTime] = useState<number>(30)
  const [expectedReturn, setExpectedReturn] = useState("0.00")

  const [isCountingDown, setIsCountingDown] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)

  const [entryPrice, setEntryPrice] = useState<number | null>(null)

  const [tradeOutcome, setTradeOutcome] = useState<{
    result: "WIN" | "LOSS"
    change: number      // % price change
    exit: number
  } | null>(null)

  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  /* Live price ref so we always use the very latest prop value */
  const priceRef = useRef<number>(parseFloat(price))
  useEffect(() => {
    priceRef.current = parseFloat(price)
  }, [price])

  /* ───────────── Form ───────────── */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: "" },
  })
  const quantity = form.watch("quantity")

  /* ───────────── Config ───────────── */
  const timeOptions: TimeOption[] = [
    { duration: "30s",  seconds: 30,  roi:  3 },
    { duration: "60s",  seconds: 60,  roi: 10 },
    { duration: "90s",  seconds: 90,  roi: 15 },
    { duration: "120s", seconds: 120, roi: 22 },
    { duration: "180s", seconds: 180, roi: 30 },
    { duration: "300s", seconds: 300, roi: 40 },
  ]

  /* ───────────── Expected return calc ───────────── */
  useEffect(() => {
    const amount = parseFloat(quantity || "")
    if (isNaN(amount)) {
      setExpectedReturn("0.00")
      return
    }
    const { roi } = timeOptions.find((t) => t.seconds === selectedTime)!
    const rtn = (amount * roi) / 100
    setExpectedReturn(rtn.toFixed(2))
  }, [quantity, selectedTime])

  /* ───────────── Countdown helpers ───────────── */
  const getCurrentPrice = () => priceRef.current

  const startCountdown = async () => {
    const amount = parseFloat(quantity)
    if (isNaN(amount)) return
    const start = getCurrentPrice()

    setEntryPrice(start)
    setTradeOutcome(null)
    setIsCountingDown(true)
    setTimer(selectedTime)

    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current!)
          finishTrade(start)
          return null
        }
        return (prev || 0) - 1
      })
    }, 1000)
  }

  const finishTrade = async (entry: number) => {
    const exit = getCurrentPrice()
    const changePct = ((exit - entry) / entry) * 100
    const outcome = exit < entry ? "WIN" : "LOSS"

    await AddTrade({
      symbol,
      currency_pair: parseFloat(quantity),
      expected_profit_loss: exit,
      time: selectedTime.toString(),
      final_profit_loss: exit,
    }).unwrap()

    setTradeOutcome({ result: outcome, change: Math.abs(changePct), exit })
    setIsCountingDown(false)
  }

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  /* ───────────── Render guard ───────────── */
  if (!isOpen) return null
  const isNegative24h = changePercent.startsWith("-")

  /* ───────────── JSX ───────────── */


  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-white">₿</span>
            </div>
            <span className="font-medium">{symbol}</span>
          </div>
          <button
            onClick={onClose}
            disabled={isCountingDown}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Price row */}
        <div className="p-4 border-b">
          <span
            className={`text-2xl font-semibold ${
              isNegative24h ? "text-red-500" : "text-green-600"
            }`}
          >
            {price}
          </span>
          <span
            className={`ml-2 text-sm ${
              isNegative24h ? "text-red-500" : "text-green-600"
            }`}
          >
            {changePercent}
          </span>
        </div>

        {/* Time selection */}
        <div className="p-4 border-b">
          <p className="text-gray-600 mb-2">Time</p>
          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map((opt) => (
              <div
                key={opt.seconds}
                onClick={() => !isCountingDown && setSelectedTime(opt.seconds)}
                className={`cursor-pointer rounded border p-3 text-center ${
                  selectedTime === opt.seconds
                    ? "bg-amber-500 border-amber-600 text-white"
                    : "border-gray-200 text-black"
                } ${isCountingDown && "opacity-50 cursor-not-allowed"}`}
              >
                <span className="block font-medium">{opt.duration}</span>
                <span className="text-sm block">Return {opt.roi}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity form */}
        <div className="p-4">
          <Form {...form}>
            <form>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity (USDT)</span>
                <span className="text-gray-600">
                  Expected&nbsp;
                  <span className="text-amber-500">{expectedReturn}</span>
                </span>
              </div>

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex">
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          disabled={isCountingDown}
                          placeholder="0.00"
                          className="rounded-l-md text-black"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <span className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-xs text-white font-bold mr-2">
                    $
                  </span>
                  Balance: 0.00&nbsp;USDT
                </div>
                <span>Limit: 100 – 499</span>
              </div>

              {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              disabled
              className="flex-1 bg-green-400 cursor-not-allowed text-white py-4 rounded-md font-medium opacity-60"
            >
              Buy Long
            </button>

            <button
              type="submit"
              onClick={startCountdown}
              disabled={isCountingDown || !form.formState.isValid}
              className={`flex-1 py-4 rounded-md font-medium text-white transition ${
                isCountingDown
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isCountingDown ? `Counting down: ${timer}s` : "Sell Short"}
            </button>
          </div>
            </form>
          </Form>

          

          {/* Outcome */}
          {tradeOutcome && (
            <Dialog open={!!tradeOutcome} onOpenChange={(open) => !open && setTradeOutcome(null)}>
              <DialogContent
                className={`text-center p-6 rounded-lg ${
                  tradeOutcome?.result === "WIN"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {tradeOutcome?.result === "WIN" ? "🎉 You Win!" : "❌ You Lose"}
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-2 font-normal text-inherit">
                    Entry&nbsp;
                    {entryPrice?.toFixed(2)} → Exit&nbsp;
                    {tradeOutcome?.exit.toFixed(2)} (
                    {tradeOutcome?.change.toFixed(2)}%)
                  </DialogDescription>
                </DialogHeader>

                {/* Close Button (optional) */}
                <DialogClose asChild>
                  <button className="mt-4 text-sm font-medium underline hover:text-black">
                    Close
                  </button>
                </DialogClose>
              </DialogContent>
            </Dialog>

          )}
        </div>
      </div>
    </div>
  )
}

export default OptionsModal
