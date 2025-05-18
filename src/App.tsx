"use client"

import { useState } from "react"

import type React from "react"
import { useAppSelector } from "./store"
import { selectIsAuthenticated } from "./store/slices/authSlice"
import Header from "./components/Header"
import BottomNavigation from "./components/BottomNavigation"
import HomeScreen from "./screens/HomeScreen"
import TradingScreen from "./screens/TradingScreen"
import IEOScreen from "./screens/IEOScreen"
import NewsScreen from "./screens/NewsScreen"
import PersonalScreen from "./screens/PersonalScreen"
import { useRouter } from "next/navigation"


// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />
    router.push('/login')
  }

  return <>{children}</>
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState("home")

  // This component is rendered within the Router context
  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />
      case "trading":
        return <TradingScreen />
      case "ieo":
        return <IEOScreen />
      case "news":
        return <NewsScreen />
      case "personal":
        return <PersonalScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50 relative">
      <Header />
      <div className="flex-1 overflow-y-auto pb-16">{renderScreen()}</div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

function App() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>

  )
}

export default App
