"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/src/store"
import { selectIsAuthenticated } from "@/src/store/slices/authSlice"

import Header from "@/src/components/Header"
import BottomNavigation from "@/src/components/BottomNavigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50 relative">
      <Header />
      <div className="flex-1 overflow-y-auto pb-16">{children}</div>
      <BottomNavigation />
    </div>
  )
}
