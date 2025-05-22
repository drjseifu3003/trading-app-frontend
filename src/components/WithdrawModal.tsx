"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubmitWithdrawMutation } from "../store/api/userApi"

const withdrawSchema = z.object({
  type: z.enum(["USDT", "ETH", "BTC"], { required_error: "Select a currency type" }),
  address: z.string().min(1, "Address is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than zero"),
})

type WithdrawFormValues = z.infer<typeof withdrawSchema>

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      type: "USDT",
      address: "",
      amount: 0,
    },
  })

  const [submitWithdraw, { isLoading }] = useSubmitWithdrawMutation()

  const { handleSubmit, reset } = form

  const onSubmit = async (data: WithdrawFormValues) => {
    try {
      await submitWithdraw(data).unwrap()
      toast.success("Withdrawal request submitted successfully")
      reset()
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit withdrawal")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mr-2" />
          <span className="font-medium text-lg">Withdraw Funds</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Type Select */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Withdraw Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDT">USDT (ERC20)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address input */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Withdrawal Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your wallet address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step="any"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="Enter amount to withdraw"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 h-auto text-base font-medium"
              >
                {isLoading ? "Submitting..." : "Withdraw"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default WithdrawModal
