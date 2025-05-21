"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAppSelector } from "./store"
import { selectIsAuthenticated } from "./store/slices/authSlice"

import Header from "./components/Header"
import BottomNavigation from "./components/BottomNavigation"
import HomeScreen from "./screens/HomeScreen"
import TradingScreen from "./screens/TradingScreen"
import IEOScreen from "./screens/IEOScreen"
import NewsScreen from "./screens/NewsScreen"
import PersonalScreen from "./screens/PersonalScreen"
import LoginScreen from "./screens/LoginScreen"
import { SignupForm } from "./screens/SignupScreen"

const PUBLIC_ROUTES = ["/login", "/signup"]

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null
  return <>{children}</>
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState("home")

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
      {/* <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} /> */}
    </div>
  )
}

function App() {
  const pathname = usePathname()

  if (pathname === "/login") return <LoginScreen />
  if (pathname === "/signup") return <SignupForm />

  return (
    <ProtectedLayout>
      <MainLayout />
    </ProtectedLayout>
  )
}

export default App
