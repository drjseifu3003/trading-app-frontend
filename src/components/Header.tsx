"use client"

import type React from "react"
import { useAppSelector } from "../store"
import { selectIsAuthenticated } from "../store/slices/authSlice"

const Header: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-indigo-900 text-white rounded flex items-center justify-center font-bold mr-2">
          M
        </div>
        <span className="text-lg font-bold text-amber-500">MDEX Pro</span>
      </div>
      {isAuthenticated && (
        <div className="space-y-1 cursor-pointer">
          <div className="w-6 h-0.5 bg-amber-500"></div>
          <div className="w-6 h-0.5 bg-amber-500"></div>
          <div className="w-6 h-0.5 bg-amber-500"></div>
        </div>
      )}
    </header>
  )
}

export default Header
