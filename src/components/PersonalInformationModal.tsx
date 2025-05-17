"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<File[]>([])
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])

      // Create preview for the first file
      const reader = new FileReader()
      reader.onload = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(newFiles[0])
    }
  }

  const removeFile = () => {
    setFiles([])
    setFilePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-white">K</span>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" placeholder="Surname" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="First name" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" placeholder="Birthday" type="date" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="cn">China</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="br">Brazil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Address" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex">
                <div className="flex items-center bg-gray-50 border rounded-l-md px-3 border-r-0">
                  <span className="text-sm flex items-center gap-1">
                    <span className="inline-block w-5">🇺🇸</span> +1 <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
                <Input id="phone" placeholder="Phone number" className="bg-gray-50 rounded-l-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">ID Document Upload</Label>
              <div className="border-2 border-dashed rounded-md p-6 bg-gray-50">
                {filePreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={filePreview || "/placeholder.svg"}
                        alt="Document preview"
                        className="max-h-40 mx-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-center text-gray-500">{files.map((file) => file.name).join(", ")}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, PDF up to 10MB (ID, passport, driving license)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer with Save button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 h-auto text-base font-medium"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default PersonalInfoModal
