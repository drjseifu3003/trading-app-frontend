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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAddTradeMutation } from "../store/api/marketApi"
import { useGetUserBalanceQuery } from "../store/api/userApi"

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
  roi: number
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
  const { data: userBalance } = useGetUserBalanceQuery()
  const [AddTrade, { isLoading, data: tradeResponse, isSuccess }] = useAddTradeMutation()
  const [selectedTime, setSelectedTime] = useState<number>(30)
  const [expectedReturn, setExpectedReturn] = useState("0.00")

  const [isCountingDown, setIsCountingDown] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)
  const [openResultModal, setOpenResultModal] = useState<boolean>(false)
  const [buyCount, setBuyCount] = useState<boolean>(false)
  const [sellCount, setSellCount] = useState<boolean>(false)

  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const priceRef = useRef<number>(parseFloat(price))

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: "" },
  })

  const quantity = form.watch("quantity")

  const timeOptions: TimeOption[] = [
    { duration: "30s", seconds: 30, roi: 3 },
    { duration: "60s", seconds: 60, roi: 10 },
    { duration: "90s", seconds: 90, roi: 15 },
    { duration: "120s", seconds: 120, roi: 22 },
    { duration: "180s", seconds: 180, roi: 30 },
    { duration: "300s", seconds: 300, roi: 40 },
  ]

  const getCurrentPrice = () => priceRef.current

  const startCountdown = async (type: string) => {
    if(type === "Buy Long") {
      setBuyCount(true)
    } else if(type === "Sell Short"){
      setSellCount(true)
    }
    const amount = parseFloat(quantity)
    if (isNaN(amount)) return
    const start = getCurrentPrice()
    setIsCountingDown(true)
    setTimer(selectedTime)

    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current!)
          finishTrade(start, type)
          return null
        }
        return (prev || 0) - 1
      })
    }, 1000)
  }

  const finishTrade = async (entry: number, type: string) => {
    try {
      const exit = getCurrentPrice()
    const changePct = ((exit - entry) / entry) * 100
    const outcome = type === "Buy Long"
      ? exit > entry ? "WIN" : "LOSS"
      : exit < entry ? "WIN" : "LOSS"
      const percent = timeOptions.find(t => t.seconds === selectedTime)?.roi ?? 0
      
    await AddTrade({
      symbol,
      currency_pair: parseFloat(quantity),
      expected_profit_loss: percent * parseFloat(quantity),
      time: selectedTime.toString(),
      final_profit_loss: percent * parseFloat(quantity),
      type,
    }).unwrap()
    } catch(err) {
      setIsCountingDown(false)
      setBuyCount(false)
      setSellCount(false)
    } finally {
      setIsCountingDown(false)
      setBuyCount(false)
      setSellCount(false)
    }
    

    
  }

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

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  useEffect(() => {
    priceRef.current = parseFloat(price)
  }, [price])

  useEffect(() => {
    if (isSuccess && tradeResponse) setOpenResultModal(true)
  }, [isSuccess, tradeResponse])

  if (!isOpen) return null
  const isNegative24h = changePercent.startsWith("-")

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
        <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg overflow-hidden shadow-lg">
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
                  <span className="text-sm block">Return {opt.roi}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <Form {...form}>
              <form>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity (USDT)</span>
                  <span className="text-gray-600">
                    Expected <span className="text-amber-500">{expectedReturn}</span>
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          disabled={isCountingDown}
                          placeholder="0.00"
                          className="text-black"
                          min={0}
                          // max={userBalance?.balance}
                        />
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
                    Balance: {userBalance?.balance} USDT
                  </div>
                  <span>Limit: 100 – 100000</span>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => startCountdown("Buy Long")}
                    disabled={isCountingDown || !form.formState.isValid}
                    className={`flex-1 py-4 rounded-md font-medium text-white transition ${
                      isCountingDown
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    
                    {(buyCount && isCountingDown) ? `Counting down: ${timer}s` : "Buy Long"}
                    
                  </button>

                  <button
                    type="button"
                    onClick={() => startCountdown("Sell Short")}
                    disabled={isCountingDown || !form.formState.isValid}
                    className={`flex-1 py-4 rounded-md font-medium text-white transition ${
                      isCountingDown
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {(sellCount && isCountingDown) ? `Counting down: ${timer}s` : "Sell Short"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={openResultModal} onOpenChange={(open) => setOpenResultModal(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Completed</DialogTitle>
            <DialogDescription>
              Trade for {symbol} is recorded successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-lg mt-4">
            Outcome:{" "}
            <span
              className={`font-bold ${
                tradeResponse?.success
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {tradeResponse?.result === "win"
                ? "WIN 🎉"
                : "LOSS 😢"}i
            </span>
          </div>
          <DialogClose asChild>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OptionsModal
