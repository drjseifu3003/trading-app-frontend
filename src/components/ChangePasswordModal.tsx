"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword)
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    // Simple password strength calculation
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25

    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25

    setPasswordStrength(strength)

    // Feedback based on strength
    if (strength < 25) {
      setPasswordFeedback("Very weak")
    } else if (strength < 50) {
      setPasswordFeedback("Weak")
    } else if (strength < 75) {
      setPasswordFeedback("Medium")
    } else {
      setPasswordFeedback("Strong")
    }
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    calculatePasswordStrength(value)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!currentPassword) {
      alert("Please enter your current password")
      return
    }

    if (!newPassword) {
      alert("Please enter a new password")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match")
      return
    }

    if (passwordStrength < 50) {
      alert("Please choose a stronger password")
      return
    }

    // Handle password change
    console.log("Password change submitted")
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
          <span className="font-medium text-lg">Change Password</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="bg-gray-50 pl-10 pr-10"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={toggleShowCurrentPassword}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="bg-gray-50 pl-10 pr-10"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={toggleShowNewPassword}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Password Strength</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength < 50
                          ? "text-red-500"
                          : passwordStrength < 75
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {passwordFeedback}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }} />
                  </div>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1 pl-5 list-disc">
                    <li className={newPassword.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(newPassword) ? "text-green-500" : ""}>At least one uppercase letter</li>
                    <li className={/[a-z]/.test(newPassword) ? "text-green-500" : ""}>At least one lowercase letter</li>
                    <li className={/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? "text-green-500" : ""}>
                      At least one number or special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="bg-gray-50 pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
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

export default ChangePasswordModal
