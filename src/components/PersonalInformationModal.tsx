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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../store/api/userApi"


const formSchema = z.object({
  fullName: z.string().min(1),
  gender: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().min(1),
  document: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ isOpen, onClose }) => {
  const { data: userProfile } = useGetUserProfileQuery()
  const [UpdateProfile, {isLoading}] = useUpdateUserProfileMutation()
  const [filePreview, setFilePreview] = useState<string | null>(userProfile?.government_id ? `https://onchainvip.etoure.com/uploads/${userProfile?.government_id}` : null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userProfile?.full_name ?? "",
      gender: userProfile?.geneder ?? "male",
      address: userProfile?.address ?? "",
      phone: userProfile?.phone ?? "",
      document: undefined,
    },
  })

  const { setValue, watch, handleSubmit, reset } = form
  const document = watch("document")

  useEffect(() => {
    if (document instanceof File) {
      const reader = new FileReader()
      reader.onload = () => setFilePreview(reader.result as string)
      reader.readAsDataURL(document)
    }
  }, [document])


  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData()

      formData.append("full_name", data.fullName)
      if (data.gender) formData.append("gender", data.gender)
      formData.append("address", data.address)
      formData.append("phone", data.phone)
      if (data.document instanceof File) {
        formData.append("government_id", data.document)
      }

      // Assuming your update API supports multipart/form-data
      await UpdateProfile(formData).unwrap()

      alert("Profile updated successfully")

      // onClose()
    } catch (error) {
      console.error("Update failed", error)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center mr-2">
            {/* <span className="text-sm font-bold text-white">K</span> */}
          </div>
          <span className="font-medium text-lg">Personal</span>
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
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input {...field} className="bg-gray-50 rounded-l-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Document Upload</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md p-6 bg-gray-50">
                        {filePreview ? (
                          <div className="space-y-4 relative">
                            <img src={filePreview} alt="Document" className="max-h-40 mx-auto object-contain" />
                            <button
                              type="button"
                              onClick={() => {
                                setFilePreview(null)
                                setValue("document", undefined)
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
                              <label htmlFor="file-upload" className="cursor-pointer text-primary font-semibold">
                                Upload a file
                                <input
                                  id="file-upload"
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
                              PNG, JPG, PDF up to 10MB (ID, passport, driving license)
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
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 h-auto text-base font-medium"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

export default PersonalInfoModal
