"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronDown, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

// Define addresses list
const ADDRESSES = [
  {
    label: "USDT Address",
    value: "0xBAd0D1469f43ee052f842AB736c06cf253914E86",
  },
  {
    label: "ETH Address",
    value: "0x56910c3c90A0f14dc8a5041f458794084D3fa6c2",
  },
  {
    label: "BTC Address",
    value: "bc1q5ge7cl8snyylxpex8l5f03wvnkhykcg25y0724",
  },
]

// Validation schema
const formSchema = z.object({
  address: z.string().min(1, "Please select an address"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("Quantity must be greater than 0"),
  receipt: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: ADDRESSES[0].value,
      quantity: 0,
      receipt: undefined,
    },
  })

  const { setValue, watch, handleSubmit, reset } = form
  const receipt = watch("receipt")

  useEffect(() => {
    if (receipt instanceof File) {
      const reader = new FileReader()
      reader.onload = () => setFilePreview(reader.result as string)
      reader.readAsDataURL(receipt)
    }
  }, [receipt])

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData()
      formData.append("address", data.address)
      formData.append("quantity", data.quantity.toString())
      if (data.receipt instanceof File) {
        formData.append("receipt", data.receipt)
      }

      // TODO: send formData to your API to process deposit

      alert("Deposit request sent successfully!")

      reset()
      setFilePreview(null)
      onClose()
    } catch (error) {
      console.error("Deposit submission failed", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center mr-2" />
          <span className="font-medium text-lg">Deposit Funds</span>
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
              {/* Address select */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Address</FormLabel>
                    <FormControl>
                      <div>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select Address" />
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent>
                            {ADDRESSES.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex flex-col">
                                  <span className="font-semibold">{label}</span>
                                  <span className="text-xs break-all">{value}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Copy Button */}
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all flex-1">
                            {field.value}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(field.value)
                              alert("Address copied to clipboard!")
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity input */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step="any"
                        className="bg-gray-50"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Receipt upload */}
              <FormField
                control={form.control}
                name="receipt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Receipt Upload</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md p-6 bg-gray-50">
                        {filePreview ? (
                          <div className="space-y-4 relative">
                            <img
                              src={filePreview}
                              alt="Receipt"
                              className="max-h-40 mx-auto object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFilePreview(null)
                                setValue("receipt", undefined)
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="receipt-upload"
                                className="cursor-pointer text-primary font-semibold"
                              >
                                Upload a file
                                <input
                                  id="receipt-upload"
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="sr-only"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) field.onChange(file)
                                  }}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-600">
                              PNG, JPG, PDF up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 h-auto text-base font-medium"
        >
          Deposit
        </Button>
      </div>
    </div>
  )
}

export default DepositModal
